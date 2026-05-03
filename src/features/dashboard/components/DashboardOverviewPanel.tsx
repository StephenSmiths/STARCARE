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

/** PDF 02【1】／01 §4.2：核心指標卡片（今日時段分軌顯示） */
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
