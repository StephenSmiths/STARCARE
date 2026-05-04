import { createAuditTrailRepository } from '../repositories/auditTrailRepository'
import { globalAuditTrailService } from './auditTrailService'
import { isSupabaseBrowserConfigured } from './supabaseBrowserEnv'

let inFlight = false

/** 登入後自 Edge 拉取審計並合併至全域服務（01 §5／Seq 12） */
export const hydrateAuditTrailFromRemote = async (): Promise<void> => {
  if (inFlight) return
  inFlight = true
  try {
    const repo = createAuditTrailRepository()
    const rows = await repo.listRecent(200)
    if (rows?.length) {
      globalAuditTrailService.mergeRemoteRecords(rows)
    }
  } finally {
    inFlight = false
  }
}

/** 本機 `record`／domain 審計後：若瀏覽器已設定 Supabase，非阻塞合併遠端列（Seq 12 UX） */
export const hydrateAuditTrailAfterLocalRecord = (): void => {
  if (!isSupabaseBrowserConfigured()) return
  void hydrateAuditTrailFromRemote().catch(() => {})
}
