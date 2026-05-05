import type { StaffProfileUpdatePayload } from '../../../repositories/staffProfileUpdateRepository'
import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import { isSupabaseBrowserConfigured } from '../../../services/supabaseBrowserEnv'
import type { StaffOverviewRow } from './staffManagementTypes'

/** 員工主檔更新：閉環審計（Edge 模式 skip 僅 hydrate 記憶體軌跡）。 */
export const recordStaffProfileUpdateAudit = (
  actorId: string,
  input: Omit<StaffProfileUpdatePayload, 'actorId'>,
  auditBefore: Pick<StaffOverviewRow, 'staffName' | 'roleType' | 'serviceScope'>,
): void => {
  recordAuditTrailThenHydrate(
    {
      action: 'UPDATE',
      entityType: 'Staff',
      entityId: input.staffId,
      actorId,
      beforeState: JSON.stringify(auditBefore),
      afterState: JSON.stringify({
        staffName: input.displayName,
        roleType: input.roleType,
        serviceScope: input.serviceScope,
      }),
      detail: '更新員工主檔（display_name／role_type／service_scope）',
      occurredAt: new Date().toISOString(),
    },
    isSupabaseBrowserConfigured(),
  )
}

/** 員工軟刪除審計。 */
export const recordStaffSoftDeleteAudit = (actorId: string, staffId: string): void => {
  recordAuditTrailThenHydrate(
    {
      action: 'SOFT_DELETE',
      entityType: 'Staff',
      entityId: staffId,
      actorId,
      beforeState: JSON.stringify({ staffId, isDeleted: false }),
      afterState: JSON.stringify({ staffId, isDeleted: true }),
      detail: '軟刪除員工資料',
      occurredAt: new Date().toISOString(),
    },
    isSupabaseBrowserConfigured(),
  )
}
