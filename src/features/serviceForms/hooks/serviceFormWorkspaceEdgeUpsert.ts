import type { ServiceFormRepository } from '../../../repositories/serviceFormRepository'
import { hydrateAuditTrailAfterLocalRecord } from '../../../services/auditTrailHydrationService'
import type { ServiceFormRecord } from '../types/serviceForm'

/**
 * PDF 02【5】Seq 17：`skipRemoteAuditPersist` 為 true 時審計已由 Edge 落庫，成功後合併遠端列。
 */
export const upsertServiceFormThenHydrateAuditIfSkipped = async (
  repo: ServiceFormRepository,
  facilityId: string,
  row: ServiceFormRecord,
  skipRemoteAuditPersist: boolean,
): Promise<void> => {
  await repo.upsertForm(facilityId, row)
  if (skipRemoteAuditPersist) hydrateAuditTrailAfterLocalRecord()
}

/** 非阻塞；Edge 失敗時本機樂觀列保留 */
export const scheduleUpsertServiceFormThenHydrate = (
  repo: ServiceFormRepository,
  facilityId: string,
  row: ServiceFormRecord,
  skipRemoteAuditPersist: boolean,
): void => {
  void upsertServiceFormThenHydrateAuditIfSkipped(
    repo,
    facilityId,
    row,
    skipRemoteAuditPersist,
  ).catch(() => {})
}
