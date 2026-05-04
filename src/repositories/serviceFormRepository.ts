import type { ServiceFormRecord } from '../features/serviceForms/types/serviceForm'
import { isSupabaseBrowserConfigured } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type ServiceFormListOptions = {
  /** PDF 02【10】：僅回傳已核准列（供歷史文件匣伺服端篩選） */
  approvedOnly?: boolean
}

/** 01 §2.2：表單經 Edge 讀寫 PostgreSQL（Seq 3）；失敗時由呼叫端回退 localStorage */
export interface ServiceFormRepository {
  /** 成功回傳陣列（可為空）；失敗回傳 null（不覆寫本機） */
  listForms: (facilityId: string, options?: ServiceFormListOptions) => Promise<ServiceFormRecord[] | null>
  upsertForm: (facilityId: string, form: ServiceFormRecord) => Promise<void>
  /** 01 §5：DB 標記 is_deleted（列不存在時視為成功） */
  softDeleteForm: (formId: string) => Promise<void>
}

class NullServiceFormRepository implements ServiceFormRepository {
  async listForms(facilityId: string, options?: ServiceFormListOptions): Promise<ServiceFormRecord[] | null> {
    void facilityId
    void options
    return null
  }

  async upsertForm(): Promise<void> {
    /* 無 Supabase 環境 */
  }

  async softDeleteForm(): Promise<void> {
    /* 無 Supabase 環境 */
  }
}

class EdgeServiceFormRepository implements ServiceFormRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async listForms(facilityId: string, options?: ServiceFormListOptions): Promise<ServiceFormRecord[] | null> {
    try {
      const headers = await buildEdgeInvokeHeaders(this.anonKey)
      const q = new URLSearchParams({ facilityId })
      if (options?.approvedOnly) q.set('approvedOnly', '1')
      const url = `${this.supabaseUrl}/functions/v1/service-forms-list?${q.toString()}`
      const res = await fetch(url, { headers })
      if (!res.ok) return null
      const data: unknown = await res.json()
      if (!Array.isArray(data)) return null
      return data as ServiceFormRecord[]
    } catch {
      return null
    }
  }

  async upsertForm(facilityId: string, form: ServiceFormRecord): Promise<void> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey, `service-form-upsert-${form.id}`)
    const res = await fetch(`${this.supabaseUrl}/functions/v1/service-forms-upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ facilityId, form }),
    })
    if (!res.ok) {
      throw new Error(await res.text())
    }
  }

  async softDeleteForm(formId: string): Promise<void> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey, `service-form-soft-delete-${formId}`)
    const res = await fetch(`${this.supabaseUrl}/functions/v1/service-forms-soft-delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: formId }),
    })
    if (!res.ok) {
      const t = await res.text()
      throw new Error(t || `HTTP ${res.status}`)
    }
  }
}

export const createServiceFormRepository = (): ServiceFormRepository => {
  if (!isSupabaseBrowserConfigured()) {
    return new NullServiceFormRepository()
  }
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}
  const supabaseUrl = env.VITE_SUPABASE_URL
  const anonKey = env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) {
    return new NullServiceFormRepository()
  }
  return new EdgeServiceFormRepository({ supabaseUrl, anonKey })
}
