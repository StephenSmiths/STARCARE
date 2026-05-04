import { isSupabaseBrowserConfigured } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

/** 寫入 public.scheduling_history（snake_case；由 Edge 批量 INSERT） */
export interface ScheduleAssignmentRecord {
  resident_id: string
  session_id: string
  staff_id: string
  pass: number
  service_type: string
  actor_id: string
  batch_id: string
}

export interface ScheduleAssignmentRepository {
  saveBatch: (rows: ScheduleAssignmentRecord[]) => Promise<void>
  /** 01 §5：依 batch_id 標記 scheduling_history is_deleted（Edge 或本機模擬） */
  softDeleteHistoryBatch: (batchId: string) => Promise<void>
}

/** 本地開發：模擬批量寫入成功 */
export class InMemoryScheduleAssignmentRepository implements ScheduleAssignmentRepository {
  private readonly store: ScheduleAssignmentRecord[] = []

  async saveBatch(rows: ScheduleAssignmentRecord[]): Promise<void> {
    this.store.unshift(...rows)
  }

  async softDeleteHistoryBatch(batchId: string): Promise<void> {
    let i = this.store.length
    while (i--) {
      if (this.store[i].batch_id === batchId) this.store.splice(i, 1)
    }
  }
}

interface EdgeConfig {
  supabaseUrl: string
  anonKey: string
}

/**
 * Edge Function：`POST /functions/v1/schedule-assignments-batch`
 * 請於 Edge 內將 body.assignments 寫入 public.scheduling_history。
 */
export class EdgeScheduleAssignmentRepository implements ScheduleAssignmentRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: EdgeConfig) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async saveBatch(rows: ScheduleAssignmentRecord[]): Promise<void> {
    let response: Response
    try {
      const actorId = rows[0]?.actor_id ?? 'unknown-actor'
      const headers = await buildEdgeInvokeHeaders(
        this.anonKey,
        `schedule-assignments-batch:${actorId}:${crypto.randomUUID()}`,
      )
      response = await fetch(`${this.supabaseUrl}/functions/v1/schedule-assignments-batch`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ assignments: rows }),
      })
    } catch (error) {
      if (error instanceof Error && error.message === '請先登入') {
        throw error
      }
      throw new Error('無法連線至後端，請檢查網路或 Supabase 設定。', { cause: error })
    }
    if (!response.ok) {
      throw new Error(`儲存排班失敗（HTTP ${response.status}）`)
    }
  }

  async softDeleteHistoryBatch(batchId: string): Promise<void> {
    const headers = await buildEdgeInvokeHeaders(
      this.anonKey,
      `scheduling-history-soft-delete:${batchId}:${crypto.randomUUID()}`,
    )
    const response = await fetch(`${this.supabaseUrl}/functions/v1/scheduling-history-soft-delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ batch_id: batchId }),
    })
    if (!response.ok) {
      throw new Error((await response.text()) || `軟刪除批次失敗（HTTP ${response.status}）`)
    }
  }
}

export const createScheduleAssignmentRepository = (): ScheduleAssignmentRepository => {
  if (!isSupabaseBrowserConfigured()) {
    return new InMemoryScheduleAssignmentRepository()
  }
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    return new InMemoryScheduleAssignmentRepository()
  }
  return new EdgeScheduleAssignmentRepository({ supabaseUrl: url, anonKey: key })
}
