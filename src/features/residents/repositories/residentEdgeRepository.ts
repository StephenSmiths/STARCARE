import { buildEdgeInvokeHeaders } from '../../../repositories/edgeFunctionHeaders'
import type { Resident, ResidentRecord } from '../types/resident'
import { toResident, toResidentRecord } from './residentMapper'
import type { ResidentRepository } from './residentRepository'

interface SupabaseConfig {
  supabaseUrl: string
  anonKey: string
}

const wait = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export class ResidentEdgeRepository implements ResidentRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: SupabaseConfig) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  private async edgeHeaders(): Promise<Record<string, string>> {
    return buildEdgeInvokeHeaders(this.anonKey)
  }

  private async requestWithRetry(path: string, options?: RequestInit): Promise<Response> {
    const retryDelays = [0, 300, 900]
    let lastError: unknown
    for (const delay of retryDelays) {
      if (delay > 0) {
        await wait(delay)
      }
      try {
        const base = await this.edgeHeaders()
        const response = await fetch(`${this.supabaseUrl}${path}`, {
          ...options,
          headers: {
            ...base,
            ...options?.headers,
          },
        })
        if (response.ok || ![408, 425, 429, 500, 502, 503, 504].includes(response.status)) {
          return response
        }
        lastError = new Error(`暫時性錯誤：${response.status}`)
      } catch (error) {
        lastError = error
      }
    }
    throw new Error(`Edge Function 請求失敗：${String(lastError)}`)
  }

  async listResidents(): Promise<Resident[]> {
    const response = await this.requestWithRetry('/functions/v1/residents-list')
    const records = (await response.json()) as ResidentRecord[]
    return records.map(toResident)
  }

  async createResident(resident: Resident): Promise<void> {
    const response = await this.requestWithRetry('/functions/v1/residents-create', {
      method: 'POST',
      body: JSON.stringify(toResidentRecord(resident)),
    })
    if (!response.ok) {
      throw new Error('新增院友失敗')
    }
  }

  async updateResident(resident: Resident): Promise<void> {
    const response = await this.requestWithRetry('/functions/v1/residents-update', {
      method: 'POST',
      body: JSON.stringify(toResidentRecord(resident)),
    })
    if (!response.ok) {
      throw new Error('修改院友失敗')
    }
  }

  async softDeleteResident(id: string): Promise<void> {
    const response = await this.requestWithRetry('/functions/v1/residents-soft-delete', {
      method: 'POST',
      body: JSON.stringify({ id, is_deleted: true }),
    })
    if (!response.ok) {
      throw new Error('軟刪除院友失敗')
    }
  }

  async findResidentById(id: string): Promise<Resident | null> {
    const response = await this.requestWithRetry(`/functions/v1/residents-get?id=${id}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('查詢院友失敗')
    }
    const record = (await response.json()) as ResidentRecord
    return toResident(record)
  }
}
