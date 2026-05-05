import { assessmentDueTaskRepository } from '../../../repositories/assessmentDueTaskRepository'
import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'
import { buildMidweekSubsidizedZeroAlerts } from '../../../services/schedulingComplianceAlertService'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import { mapActiveResidentsToSubsidizedSchedulingResidents } from '../../scheduling/utils/mapActiveResidentsToSubsidizedSchedulingResidents'
import { residentService } from '../../residents/services/residentService'
import { staffManagementService } from '../../staff/services/staffManagementService'
import { localCalendarYmd } from '../../shared/date/localCalendarYmd'
import { buildDashboardSummary, type DashboardSummary } from './dashboardSummaryService'

/** 儀表首屏資料快照（摘要 + 組長週三提醒列）。 */
export type DashboardOverviewSnapshot = {
  summary: DashboardSummary
  teamLeadWednesdayAlerts: SchedulingComplianceAlert[]
}

/** PDF 02【1】：並行載入並組裝摘要（Seq 13 骨架；無 React／狀態）。 */
export async function fetchDashboardOverviewSnapshot(
  facilityId: string,
): Promise<DashboardOverviewSnapshot> {
  const [residents, staffRows, sessions] = await Promise.all([
    residentService.listActiveResidents(),
    staffManagementService.listStaffOverview(facilityId),
    schedulingConfigService.listSchedulingSessions(facilityId),
  ])
  const kpiHistory = schedulingKpiHistorySyncService.loadLocal(facilityId)
  const dueTasks = await assessmentDueTaskRepository.listDueWithinLeadDays(residents)
  const subsidizedRehabResidents = mapActiveResidentsToSubsidizedSchedulingResidents(residents)
  const teamLeadWednesdayAlerts = buildMidweekSubsidizedZeroAlerts(subsidizedRehabResidents)
  const summary = buildDashboardSummary({
    residentTotal: residents.length,
    subsidizedRehabCohortCount: subsidizedRehabResidents.length,
    staffRows,
    schedulingSessions: sessions,
    todayLocalYmd: localCalendarYmd(),
    kpiHistoryNewestFirst: kpiHistory,
    assessmentDueWithin14Count: dueTasks.length,
  })
  return { summary, teamLeadWednesdayAlerts }
}
