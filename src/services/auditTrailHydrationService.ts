import { createAuditTrailRepository } from '../repositories/auditTrailRepository'
import {
  globalAuditTrailService,
  type AuditTrailRecord,
  type AuditTrailService,
} from './auditTrailService'
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

/** 對指定實例寫入審計並非阻塞合併遠端列（供 `SchedulingService` 注入之測試隔離）；`skipRemotePersist` 語意同 `AuditTrailService.record`（Seq 12）。 */
export const recordAuditTrailThenHydrateWithService = (
  auditTrailService: AuditTrailService,
  event: AuditTrailRecord,
  skipRemotePersist = false,
): void => {
  auditTrailService.record(event, skipRemotePersist)
  hydrateAuditTrailAfterLocalRecord()
}

/** 本機寫入審計並非阻塞合併遠端列；`skipRemotePersist` 語意同 `AuditTrailService.record`（Seq 12）。表單草稿／submit 須待 Edge upsert 後再 hydrate 者請維持僅 `record` + 非同步 upsert 路徑。 */
export const recordAuditTrailThenHydrate = (
  event: AuditTrailRecord,
  skipRemotePersist = false,
): void => {
  recordAuditTrailThenHydrateWithService(globalAuditTrailService, event, skipRemotePersist)
}
