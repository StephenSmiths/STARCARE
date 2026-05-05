import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'

export const recordResidentsListExportAudit = (actorId: string, count: number): void => {
  recordAuditTrailThenHydrate({
    action: 'RESIDENTS_EXPORT',
    entityType: 'Resident',
    entityId: `residents-export-${Date.now()}`,
    actorId,
    beforeState: null,
    afterState: JSON.stringify({ count }),
    detail: '匯出院友名單（CSV／Excel 可開）',
    occurredAt: new Date().toISOString(),
  })
}

export const recordAssessmentDueTasksExportAudit = (actorId: string, taskCount: number): void => {
  recordAuditTrailThenHydrate({
    action: 'ASSESSMENT_DUE_EXPORT',
    entityType: 'Reporting',
    entityId: `assessment-due-${Date.now()}`,
    actorId,
    beforeState: null,
    afterState: JSON.stringify({ taskCount }),
    detail: '匯出評估到期待辦清單（CSV）',
    occurredAt: new Date().toISOString(),
  })
}
