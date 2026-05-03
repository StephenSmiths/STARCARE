import type { StaffOverviewRow } from '../../staff/services/staffManagementService'
import type { SchedulingSession } from '../../../services/schedulingService'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'

/** PDF 02【1】儀表盤摘要（Seq 13）；數值由呼叫端餵入，保持可測試 */
export interface DashboardSummary {
  residentTotal: number
  /** PDF 01 §4.1：納入資助復康排班／KPI 合規計算之院友數（與全院友總數分開） */
  subsidizedRehabCohortCount: number
  staffTotal: number
  /** PDF 01 §4.2：今日資助復康活動時段筆數（與認知軌分計） */
  todaySubsidizedRehabSessionCount: number
  /** PDF 01 §4.2：今日認知障礙症服務時段筆數 */
  todayDementiaServiceSessionCount: number
  /** 最近一次排班 KPI 之覆蓋率（%）；無紀錄為 null */
  lastWeeklyCoveragePercent: number | null
  lastKpiRanAt: string | null
  /** Seq 9：14 天內評估到期待辦筆數 */
  assessmentDueWithin14Count: number
  /** 今日團隊復康職類粗分（僅 `staff_profiles.role_type`，無主檔歸「其他」） */
  teamPtFamilyCount: number
  teamOtFamilyCount: number
  teamOtherDisciplineCount: number
}

/** PDF 02【1】：僅以 DB `role_type` 分類；TeamLead 與未填職類歸「其他」（不依顯示名推斷） */
export const rehabDisciplineFamilyFromStaff = (row: StaffOverviewRow): 'PT' | 'OT' | 'Other' => {
  const t = row.roleType
  if (t === 'PT' || t === 'PTA') return 'PT'
  if (t === 'OT' || t === 'OTA') return 'OT'
  return 'Other'
}

/** 指定曆日之時段筆數（不分軌；測試與舊邏輯用） */
export const countSessionsOnLocalDate = (sessions: SchedulingSession[], localDateYmd: string): number =>
  sessions.filter((s) => s.date === localDateYmd).length

/** PDF 01 §4.2：指定曆日依服務類型分軌計數（絕不混算） */
export const countSessionsOnLocalDateByTrack = (
  sessions: SchedulingSession[],
  localDateYmd: string,
): { subsidizedRehab: number; dementiaService: number } => {
  const onDate = sessions.filter((s) => s.date === localDateYmd)
  return {
    subsidizedRehab: onDate.filter((s) => s.serviceType === 'Subsidized_Rehab').length,
    dementiaService: onDate.filter((s) => s.serviceType === 'Dementia_Service').length,
  }
}

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
