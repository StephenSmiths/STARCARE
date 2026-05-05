import type { ServiceFormRepository } from '../../../repositories/serviceFormRepository'
import type { ServiceFormRecord } from '../types/serviceForm'
import { scheduleUpsertServiceFormThenHydrate } from './serviceFormWorkspaceEdgeUpsert'

/**
 * Domain 樂觀寫入後：刷新本機 store 並排程 Edge upsert + 審計 hydration。
 * PDF 02【5】Seq 17 — audit_events append。
 */
export const scheduleEdgeUpsertAfterLocalMutation = (
  repo: ServiceFormRepository,
  facilityId: string,
  row: ServiceFormRecord,
  skipRemoteAuditPersist: boolean,
  refreshForms: () => void,
): void => {
  refreshForms()
  scheduleUpsertServiceFormThenHydrate(repo, facilityId, row, skipRemoteAuditPersist)
}
