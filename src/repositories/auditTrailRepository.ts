import type { AuditTrailRecord } from '../services/auditTrailService'
import { mapAuditTrailApiRow } from '../services/auditTrailRemoteMapper'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

/** 01 §5：審計落庫／列表經 Edge（Seq 12）；失敗不拋錯以免阻斷主流程 */
export interface AuditTrailRepository {
  append: (event: AuditTrailRecord) => Promise<void>
  listRecent: (limit?: number) => Promise<AuditTrailRecord[] | null>
}

class NullAuditTrailRepository implements AuditTrailRepository {
  async append(): Promise<void> {
    /* 無 Supabase 環境 */
  }

  async listRecent(): Promise<AuditTrailRecord[] | null> {
    return null
  }
}

class EdgeAuditTrailRepository implements AuditTrailRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async append(event: AuditTrailRecord): Promise<void> {
    try {
      const idem = `audit-${event.action}-${event.entityId}-${event.occurredAt}`.slice(0, 200)
      const headers = await buildEdgeInvokeHeaders(this.anonKey, idem)
      const res = await fetch(`${this.supabaseUrl}/functions/v1/audit-trail-append`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ event }),
      })
      if (!res.ok) {
        void res.text()
      }
    } catch {
      /* 未登入或網路錯誤：略過，記憶體軌跡仍保留 */
    }
  }

  async listRecent(limit = 200): Promise<AuditTrailRecord[] | null> {
    try {
      const headers = await buildEdgeInvokeHeaders(this.anonKey)
      const q = new URLSearchParams({ limit: String(limit) })
      const res = await fetch(`${this.supabaseUrl}/functions/v1/audit-trail-list?${q}`, { headers })
      if (!res.ok) return null
      const data: unknown = await res.json()
      if (!Array.isArray(data)) return null
      return data.map(mapAuditTrailApiRow).filter((r): r is AuditTrailRecord => r != null)
    } catch {
      return null
    }
  }
}

export const createAuditTrailRepository = (): AuditTrailRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new NullAuditTrailRepository()
  }
  return new EdgeAuditTrailRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
