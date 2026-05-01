import { DashboardOverviewPanel } from './DashboardOverviewPanel'
import { useDashboardOverview } from '../hooks/useDashboardOverview'

/** PDF 02【1】儀表盤入口（Seq 13） */
export const DashboardHome = () => {
  const { summary, isLoading, error, reload } = useDashboardOverview()

  return (
    <div className="space-y-6">
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
    </div>
  )
}
