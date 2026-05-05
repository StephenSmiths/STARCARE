/** Phase 4 Day 2：KPI 趨勢顯示格式（對齊 SOP 3.x 資助復康排班結果追蹤） */

/** 快照時間本地化字串（無效 ISO 回傳 `-`） */
export const formatKpiTrendRanAtLocal = (iso: string): string => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString()
}

export const formatDeltaPercentPoints = (
  current: number,
  previous: number | undefined,
): string => {
  if (previous === undefined) return '—'
  const delta = current - previous
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)} pt`
}

export const formatDeltaDecimal = (current: number, previous: number | undefined): string => {
  if (previous === undefined) return '—'
  const delta = current - previous
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(2)}`
}
