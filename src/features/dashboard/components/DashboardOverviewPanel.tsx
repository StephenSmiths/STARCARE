import { uiTokens } from '../../shared/ui/uiTokens'
import type { DashboardSummary } from '../services/dashboardSummaryService'

export interface DashboardOverviewPanelProps {
  summary: DashboardSummary | null
  isLoading: boolean
  error: string
  onRetry: () => void
}

const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) => (
  <div className={uiTokens.dashboardStatTile}>
    <p className={uiTokens.dashboardStatTileLabel}>{label}</p>
    <p className={uiTokens.dashboardStatTileValue}>{value}</p>
    {hint ? <p className={uiTokens.dashboardStatTileHint}>{hint}</p> : null}
  </div>
)

/** PDF 02【1】／01 §4.2：核心指標卡片（今日時段分軌顯示） */
export const DashboardOverviewPanel = ({ summary, isLoading, error, onRetry }: DashboardOverviewPanelProps) => {
  if (isLoading) {
    return <div className={uiTokens.dashboardLoadingPanel}>載入儀表盤…</div>
  }

  if (error) {
    return (
      <div className={uiTokens.bannerDanger}>
        <p>{error}</p>
        <button type="button" className={uiTokens.btnSecondaryMt3TextXs} onClick={() => void onRetry()}>
          重試
        </button>
      </div>
    )
  }

  if (!summary) return null

  const coverageDisplay =
    summary.lastWeeklyCoveragePercent !== null
      ? `${summary.lastWeeklyCoveragePercent.toFixed(1)}%`
      : '—'
  const coverageHint =
    summary.lastKpiRanAt !== null ? `最近排班：${summary.lastKpiRanAt}` : '尚未於本裝置記錄排班 KPI，請至排班頁執行'

  return (
    <div className={uiTokens.layoutSpaceY4}>
      <div className={uiTokens.dashboardStatGrid}>
        <StatCard
          label="院友總數（在住）"
          value={String(summary.residentTotal)}
          hint={`§4.1 資助復康排班／KPI 族群：${summary.subsidizedRehabCohortCount} 人（純認知軌不計入）`}
        />
        <StatCard label="員工總數（概覽）" value={String(summary.staffTotal)} />
        <StatCard
          label="今日活動時段（分軌）"
          value={`${summary.todaySubsidizedRehabSessionCount} · ${summary.todayDementiaServiceSessionCount}`}
          hint="左：資助復康；右：認知障礙症服務（01 §4.2 兩軌獨立計數）"
        />
        <StatCard
          label="本週合規（最近 KPI）"
          value={coverageDisplay}
          hint={`${coverageHint}；分母為 §4.1 族群（${summary.subsidizedRehabCohortCount} 人）`}
        />
        <StatCard
          label="待辦（評估 14 天內到期）"
          value={String(summary.assessmentDueWithin14Count)}
          hint="Seq 9 骨架；正式資料模型上線後替換"
        />
        <StatCard
          label="今日團隊 PT / OT"
          value={`${summary.teamPtFamilyCount} / ${summary.teamOtFamilyCount}`}
          hint={`TeamLead／未填職類歸「其他」：${summary.teamOtherDisciplineCount}；僅 staff_profiles.role_type`}
        />
      </div>
    </div>
  )
}
