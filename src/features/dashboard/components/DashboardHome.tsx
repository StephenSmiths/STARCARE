import { useAuth } from '../../auth'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { DashboardDailyFlowPanel } from './DashboardDailyFlowPanel'
import { DashboardOverviewPanel } from './DashboardOverviewPanel'
import { DashboardTeamLeadWednesdayCard } from './DashboardTeamLeadWednesdayCard'
import { useDashboardOverview } from '../hooks/useDashboardOverview'

/** PDF 02【1】儀表盤入口（Seq 13） */
export const DashboardHome = () => {
  const { role } = useAuth()
  const auditTrail = useAuditTrailList()
  const { summary, teamLeadWednesdayAlerts, isLoading, error, reload } = useDashboardOverview()

  return (
    <div className="space-y-6">
      <DashboardDailyFlowPanel />
      {role === 'TeamLead' || role === 'Admin' ? (
        <DashboardTeamLeadWednesdayCard alerts={teamLeadWednesdayAlerts} />
      ) : null}
      <DashboardOverviewPanel summary={summary} isLoading={isLoading} error={error} onRetry={reload} />
      <section className="rounded-md border border-slate-200 bg-white p-4 text-xs text-slate-600">
        <p className="font-medium text-slate-800">快速連結</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <a href="#scheduling" className="text-violet-700 underline">
              智能排班
            </a>
          </li>
          <li>
            <a href="#residents" className="text-violet-700 underline">
              院友管理
            </a>
          </li>
          <li>
            <a href="#staff-import" className="text-violet-700 underline">
              員工管理
            </a>
          </li>
        </ul>
      </section>
      <AuditTrailPanel
        title="全域審計摘要（儀表盤）"
        help="登入後會自雲端合併最近紀錄；完整篩選亦見智能排班／院友等頁（01 §5／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
