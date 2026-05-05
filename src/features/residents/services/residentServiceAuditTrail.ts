import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import type { Resident } from '../types/resident'

/** 院友新增：寫入閉環審計（Supabase 模式下 skip 僅更新記憶體軌跡，避免重覆 append）。 */
export const recordResidentCreateAudit = (
  actorId: string,
  resident: Resident,
  skipRemoteAuditPersist: boolean,
): void => {
  recordAuditTrailThenHydrate(
    {
      action: 'CREATE',
      entityType: 'Resident',
      entityId: resident.id,
      actorId,
      beforeState: null,
      afterState: JSON.stringify(resident),
      detail: '新增院友資料',
      occurredAt: new Date().toISOString(),
    },
    skipRemoteAuditPersist,
  )
}

/** 院友修改：審計變更前後狀態。 */
export const recordResidentUpdateAudit = (
  actorId: string,
  id: string,
  previous: Resident,
  updated: Resident,
  skipRemoteAuditPersist: boolean,
): void => {
  recordAuditTrailThenHydrate(
    {
      action: 'UPDATE',
      entityType: 'Resident',
      entityId: id,
      actorId,
      beforeState: JSON.stringify(previous),
      afterState: JSON.stringify(updated),
      detail: '修改院友資料',
      occurredAt: new Date().toISOString(),
    },
    skipRemoteAuditPersist,
  )
}

/** 院友軟刪除：審計標記後狀態。 */
export const recordResidentSoftDeleteAudit = (
  actorId: string,
  id: string,
  previous: Resident,
  updated: Resident,
  skipRemoteAuditPersist: boolean,
): void => {
  recordAuditTrailThenHydrate(
    {
      action: 'SOFT_DELETE',
      entityType: 'Resident',
      entityId: id,
      actorId,
      beforeState: JSON.stringify(previous),
      afterState: JSON.stringify(updated),
      detail: '軟刪除院友資料',
      occurredAt: new Date().toISOString(),
    },
    skipRemoteAuditPersist,
  )
}
