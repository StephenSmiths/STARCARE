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
