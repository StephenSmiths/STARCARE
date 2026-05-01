import type { StaffOverviewRow } from '../../staff/services/staffManagementService'
import type { SchedulingSession } from '../../../services/schedulingService'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'

/** PDF 02【1】儀表盤摘要（Seq 13）；數值由呼叫端餵入，保持可測試 */
export interface DashboardSummary {
  residentTotal: number
  staffTotal: number
  /** 今日工作節（與 scheduling_sessions 日期對齊） */
  todaySessionCount: number
  /** 最近一次排班 KPI 之覆蓋率（%）；無紀錄為 null */
  lastWeeklyCoveragePercent: number | null
  lastKpiRanAt: string | null
  /** Seq 9：14 天內評估到期待辦筆數 */
  assessmentDueWithin14Count: number
  /** 今日團隊復康職類粗分（待 profile.role_type 上線後改為正式欄位） */
  teamPtFamilyCount: number
  teamOtFamilyCount: number
  teamOtherDisciplineCount: number
}

/**
 * 由員工顯示名稱推斷 PT / OT 家族（對齊匯入 role_type 語意：PTA→PT、OTA→OT）。
 * 正式環境應改讀 staff_profiles.role_type，見 PDF 02【1】「今日團隊分 PT/OT」。
 */
export const inferRehabDisciplineFamily = (staffDisplayName: string): 'PT' | 'OT' | 'Other' => {
  const name = staffDisplayName.trim()
  if (!name) return 'Other'
  if (/\bPTA\b/i.test(name)) return 'PT'
  if (/\bOTA\b/i.test(name)) return 'OT'
  if (/\bPT\b/i.test(name)) return 'PT'
  if (/\bOT\b/i.test(name)) return 'OT'
  return 'Other'
}

export const countSessionsOnLocalDate = (sessions: SchedulingSession[], localDateYmd: string): number =>
  sessions.filter((s) => s.date === localDateYmd).length

export const buildDashboardSummary = (input: {
  residentTotal: number
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
    const family = inferRehabDisciplineFamily(row.staffName)
    if (family === 'PT') pt += 1
    else if (family === 'OT') ot += 1
    else other += 1
  }

  const latest = input.kpiHistoryNewestFirst[0] ?? null

  return {
    residentTotal: input.residentTotal,
    staffTotal: input.staffRows.length,
    todaySessionCount: countSessionsOnLocalDate(input.schedulingSessions, input.todayLocalYmd),
    lastWeeklyCoveragePercent: latest ? latest.kpis.coverageRate : null,
    lastKpiRanAt: latest?.ranAt ?? null,
    assessmentDueWithin14Count: input.assessmentDueWithin14Count,
    teamPtFamilyCount: pt,
    teamOtFamilyCount: ot,
    teamOtherDisciplineCount: other,
  }
}
