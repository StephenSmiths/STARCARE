import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'

export const recordStaffOverviewExportAudit = (actorId: string, count: number): void => {
  recordAuditTrailThenHydrate({
    action: 'STAFF_EXPORT',
    entityType: 'Staff',
    entityId: `staff-export-${Date.now()}`,
    actorId,
    beforeState: null,
    afterState: JSON.stringify({ count }),
    detail: '匯出員工概覽（CSV／Excel 可開）',
    occurredAt: new Date().toISOString(),
  })
}
