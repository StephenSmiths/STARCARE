import { createAuditTrailRepository } from '../repositories/auditTrailRepository'
import { globalAuditTrailService } from './auditTrailService'

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
