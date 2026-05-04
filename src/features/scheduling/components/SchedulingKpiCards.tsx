import type { SchedulingKpiSnapshot } from '../../../services/schedulingKpiService'
import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'
import { uiTokens } from '../../shared/ui/uiTokens'

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
    <div className={uiTokens.schedulingKpiCardsGrid}>
      {cards.map((card) => (
        <div key={card.title} className={uiTokens.surfaceCardCompact}>
          <p className={uiTokens.statCardTitleMuted}>{card.title}</p>
          <p className={uiTokens.schedulingStatValue2xl}>{card.value}</p>
          <p className={uiTokens.dashboardStatTileHint}>{card.hint}</p>
        </div>
      ))}
      <div className={hasMidweekAlert ? uiTokens.surfaceCardCompactWarn : uiTokens.surfaceCardCompact}>
        <p
          className={
            hasMidweekAlert ? uiTokens.schedulingStatCardTitleAmber900 : uiTokens.statCardTitleMuted
          }
        >
          週三 0 次提醒
        </p>
        <p
          className={
            hasMidweekAlert ? uiTokens.schedulingStatValue2xlAmber900 : uiTokens.schedulingStatValue2xl
          }
        >
          {complianceAlerts.length}
        </p>
        <p className={hasMidweekAlert ? uiTokens.schedulingMidweekKpiHintAmber : uiTokens.dashboardStatTileHint}>
          {hasMidweekAlert
            ? `需優先跟進：${previewNames.join('、')}${complianceAlerts.length > 3 ? '…' : ''}`
            : '目前無需跟進個案'}
        </p>
      </div>
    </div>
  )
}
