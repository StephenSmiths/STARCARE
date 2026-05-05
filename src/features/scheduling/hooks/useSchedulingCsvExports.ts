import { useCallback } from 'react'
import type { SchedulingResident } from '../../../services/schedulingService'
import { getWeeklyTargetByFundingType } from '../../../services/schedulingTargets'
import { downloadWeeklyComplianceCsv } from '../../../services/weeklyComplianceCsvService'
import { downloadSchedulingComplianceAlertsCsv } from '../../../services/schedulingComplianceAlertCsvService'
import {
  recordComplianceAlertsExportAudit,
  recordWeeklyComplianceExportAudit,
} from '../services/schedulingCsvExportAuditService'
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
    recordWeeklyComplianceExportAudit(actorId, residents.length)
  }, [actorId, residents])

  const exportComplianceAlertsCsv = useCallback(() => {
    if (complianceAlerts.length === 0) return
    downloadSchedulingComplianceAlertsCsv(complianceAlerts)
    recordComplianceAlertsExportAudit(actorId, complianceAlerts.length)
  }, [actorId, complianceAlerts])

  return { exportWeeklyComplianceCsv, exportComplianceAlertsCsv }
}
