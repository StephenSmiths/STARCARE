import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'

export const recordWeeklyComplianceExportAudit = (actorId: string, residentCount: number): void => {
  recordAuditTrailThenHydrate({
    action: 'WEEKLY_COMPLIANCE_EXPORT',
    entityType: 'Reporting',
    entityId: `weekly-compliance-${Date.now()}`,
    actorId,
    beforeState: null,
    afterState: JSON.stringify({ residentCount }),
    detail: '匯出本週服務達成／合規清單（CSV）',
    occurredAt: new Date().toISOString(),
  })
}

export const recordComplianceAlertsExportAudit = (actorId: string, alertCount: number): void => {
  recordAuditTrailThenHydrate({
    action: 'COMPLIANCE_ALERT_EXPORT',
    entityType: 'Reporting',
    entityId: `midweek-alerts-${Date.now()}`,
    actorId,
    beforeState: null,
    afterState: JSON.stringify({ alertCount }),
    detail: '匯出週三 0 次高優先提醒清單（CSV）',
    occurredAt: new Date().toISOString(),
  })
}
