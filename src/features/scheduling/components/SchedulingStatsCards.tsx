import { uiTokens } from '../../shared/ui/uiTokens'

interface SchedulingStatsCardsProps {
  totalResidents: number
  compliantCount: number
  pendingSlots: number
}

/** 頂部三張數據摘要卡 */
export const SchedulingStatsCards = ({
  totalResidents,
  compliantCount,
  pendingSlots,
}: SchedulingStatsCardsProps) => {
  const cards = [
    { title: '總院友數', value: totalResidents, hint: '納入本週排班之名單' },
    { title: '本週已達標數', value: compliantCount, hint: '資助復康週次數已滿足' },
    { title: '待補齊人次', value: pendingSlots, hint: '尚缺之服務節數加總' },
  ]
  return (
    <div className={uiTokens.schedulingStatsGrid}>
      {cards.map((card) => (
        <div key={card.title} className={uiTokens.surfaceCardCompact}>
          <p className={uiTokens.statCardTitleMuted}>{card.title}</p>
          <p className={uiTokens.schedulingStatValue3xl}>{card.value}</p>
          <p className={uiTokens.dashboardStatTileHint}>{card.hint}</p>
        </div>
      ))}
    </div>
  )
}
