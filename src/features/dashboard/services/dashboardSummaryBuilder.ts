import type { SchedulingSession } from '../../../services/schedulingService'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { StaffOverviewRow } from '../../staff/services/staffManagementService'
import type { DashboardSummary } from './dashboardSummaryTypes'
import { rehabDisciplineFamilyFromStaff } from './dashboardSummaryDiscipline'
import { countSessionsOnLocalDateByTrack } from './dashboardSummarySessionCounts'

export const buildDashboardSummary = (input: {
  residentTotal: number
  subsidizedRehabCohortCount: number
  staffRows: StaffOverviewRow[]
  schedulingSessions: SchedulingSession[]
  todayLocalYmd: string
  kpiHistoryNewestFirst: SchedulingKpiRunRecord[]
  assessmentDueWithin14Count: number
}): DashboardSummary => {
  let pt = 0
  let ot = 0
  let other = 0
  for (const row of input.staffRows) {
    const family = rehabDisciplineFamilyFromStaff(row)
    if (family === 'PT') pt += 1
    else if (family === 'OT') ot += 1
    else other += 1
  }

  const latest = input.kpiHistoryNewestFirst[0] ?? null
  const todayByTrack = countSessionsOnLocalDateByTrack(input.schedulingSessions, input.todayLocalYmd)

  return {
    residentTotal: input.residentTotal,
    subsidizedRehabCohortCount: input.subsidizedRehabCohortCount,
    staffTotal: input.staffRows.length,
    todaySubsidizedRehabSessionCount: todayByTrack.subsidizedRehab,
    todayDementiaServiceSessionCount: todayByTrack.dementiaService,
    lastWeeklyCoveragePercent: latest ? latest.kpis.coverageRate : null,
    lastKpiRanAt: latest?.ranAt ?? null,
    assessmentDueWithin14Count: input.assessmentDueWithin14Count,
    teamPtFamilyCount: pt,
    teamOtFamilyCount: ot,
    teamOtherDisciplineCount: other,
  }
}
