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
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    {hint ? <p className="mt-1 text-[11px] text-slate-400">{hint}</p> : null}
  </div>
)

/** PDF 02【1】核心指標卡片（不含獨立「今日工作節」模組，此處為跨模組彙總） */
export const DashboardOverviewPanel = ({ summary, isLoading, error, onRetry }: DashboardOverviewPanelProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
        載入儀表盤…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p>{error}</p>
        <button type="button" className={`${uiTokens.btnSecondary} mt-3 text-xs`} onClick={() => void onRetry()}>
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
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="院友總數（在住）" value={String(summary.residentTotal)} />
        <StatCard label="員工總數（概覽）" value={String(summary.staffTotal)} />
        <StatCard label="今日工作節" value={String(summary.todaySessionCount)} hint="對應已發布之活動時段／排班時段列" />
        <StatCard label="本週合規（最近 KPI）" value={coverageDisplay} hint={coverageHint} />
        <StatCard
          label="待辦（評估 14 天內到期）"
          value={String(summary.assessmentDueWithin14Count)}
          hint="Seq 9 骨架；正式資料模型上線後替換"
        />
        <StatCard
          label="今日團隊 PT / OT（推斷）"
          value={`${summary.teamPtFamilyCount} / ${summary.teamOtFamilyCount}`}
          hint={`未標示職類：${summary.teamOtherDisciplineCount}；待 role_type 欄位`}
        />
      </div>
    </div>
  )
}
