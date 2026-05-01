import { useMemo } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { Resident } from '../types/resident'

interface ResidentsOverviewPanelProps {
  residents: Resident[]
}

/** 院友管理概覽：快速掌握總量、重點照護與資助結構 */
export const ResidentsOverviewPanel = ({ residents }: ResidentsOverviewPanelProps) => {
  const stats = useMemo(() => {
    const total = residents.length
    const specialCare = residents.filter((item) => item.isSpecialCareCase).length
    const dementiaCare = residents.filter(
      (item) => item.dementiaLevel === 'Moderate' || item.dementiaLevel === 'Severe',
    ).length
    const subsidized = residents.filter((item) => item.fundingType === 'GradeA_Subsidized').length
    return { total, specialCare, dementiaCare, subsidized }
  }, [residents])

  return (
    <section>
      <h3 className={uiTokens.blockHeading}>院友資料概覽</h3>
      <p className={uiTokens.blockHelp}>以目前名單即時統計，用於管理層快速掌握重點分佈。</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs text-slate-500">院友總數</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{stats.total}</p>
      </article>
      <article className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs text-amber-700">Special Care 個案</p>
        <p className="mt-1 text-lg font-semibold text-amber-900">{stats.specialCare}</p>
      </article>
      <article className="rounded-lg border border-violet-200 bg-violet-50 p-3">
        <p className="text-xs text-violet-700">中重度認知障礙</p>
        <p className="mt-1 text-lg font-semibold text-violet-900">{stats.dementiaCare}</p>
      </article>
      <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-xs text-emerald-700">甲一買位</p>
        <p className="mt-1 text-lg font-semibold text-emerald-900">{stats.subsidized}</p>
      </article>
      </div>
    </section>
  )
}
