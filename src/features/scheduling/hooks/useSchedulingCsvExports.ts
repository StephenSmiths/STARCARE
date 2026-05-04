import { useCallback } from 'react'
import type { SchedulingResident } from '../../../services/schedulingService'
import { getWeeklyTargetByFundingType } from '../../../services/schedulingTargets'
import { downloadWeeklyComplianceCsv } from '../../../services/weeklyComplianceCsvService'
import { downloadSchedulingComplianceAlertsCsv } from '../../../services/schedulingComplianceAlertCsvService'
import { hydrateAuditTrailAfterLocalRecord } from '../../../services/auditTrailHydrationService'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'

/** 排班頁：週合規／週三提醒 CSV 匯出（抽離以控 useScheduling 行數） */
export const useSchedulingCsvExports = (
  actorId: string,
  residents: SchedulingResident[],
  complianceAlerts: SchedulingComplianceAlert[],
) => {
  const exportWeeklyComplianceCsv = useCallback(() => {
    downloadWeeklyComplianceCsv(
      residents.map((r) => ({
        name: r.name,
        fundingType: r.fundingType,
        isCompliant: r.weeklyCompletedCount >= getWeeklyTargetByFundingType(r.fundingType),
      })),
    )
  }, [residents])

  const exportComplianceAlertsCsv = useCallback(() => {
    if (complianceAlerts.length === 0) return
    downloadSchedulingComplianceAlertsCsv(complianceAlerts)
    globalAuditTrailService.record({
      action: 'COMPLIANCE_ALERT_EXPORT',
      entityType: 'Reporting',
      entityId: `midweek-alerts-${Date.now()}`,
      actorId,
      beforeState: null,
      afterState: JSON.stringify({ alertCount: complianceAlerts.length }),
      detail: '匯出週三 0 次高優先提醒清單（CSV）',
      occurredAt: new Date().toISOString(),
    })
    hydrateAuditTrailAfterLocalRecord()
  }, [actorId, complianceAlerts])

  return { exportWeeklyComplianceCsv, exportComplianceAlertsCsv }
}
