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
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">{card.title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{card.value}</p>
          <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
        </div>
      ))}
    </div>
  )
}
