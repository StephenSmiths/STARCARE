import type { SchedulingKpiSnapshot } from '../../../services/schedulingKpiService'
import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'

interface SchedulingKpiCardsProps {
  kpis: SchedulingKpiSnapshot
  complianceAlerts: SchedulingComplianceAlert[]
}

const formatPercent = (value: number): string => `${value.toFixed(1)}%`

const formatDecimal = (value: number): string => value.toFixed(2)

export const SchedulingKpiCards = ({ kpis, complianceAlerts }: SchedulingKpiCardsProps) => {
  const cards = [
    { title: '覆蓋率', value: formatPercent(kpis.coverageRate), hint: '已達標院友比例' },
    { title: '衝突率（每百位）', value: formatPercent(kpis.conflictRatePer100), hint: '每 100 位院友衝突數' },
    {
      title: '平均指派次數',
      value: formatDecimal(kpis.averageAssignmentsPerResident),
      hint: '本次排班每位院友平均指派',
    },
    { title: '待補齊比例', value: formatPercent(kpis.underTargetRate), hint: '尚未達標院友比例' },
  ]
  const hasMidweekAlert = complianceAlerts.length > 0
  const previewNames = complianceAlerts.slice(0, 3).map((item) => item.residentName)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{card.title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{card.value}</p>
          <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
        </div>
      ))}
      <div
        className={`rounded-xl border p-5 shadow-sm ${
          hasMidweekAlert ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'
        }`}
      >
        <p className={`text-sm font-medium ${hasMidweekAlert ? 'text-amber-900' : 'text-slate-500'}`}>
          週三 0 次提醒
        </p>
        <p className={`mt-2 text-2xl font-bold tracking-tight ${hasMidweekAlert ? 'text-amber-900' : 'text-slate-900'}`}>
          {complianceAlerts.length}
        </p>
        <p className={`mt-1 text-xs ${hasMidweekAlert ? 'text-amber-800' : 'text-slate-400'}`}>
          {hasMidweekAlert
            ? `需優先跟進：${previewNames.join('、')}${complianceAlerts.length > 3 ? '…' : ''}`
            : '目前無需跟進個案'}
        </p>
      </div>
    </div>
  )
}
