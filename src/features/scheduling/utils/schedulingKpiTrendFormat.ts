/** Phase 4 Day 2：KPI 趨勢顯示格式（對齊 SOP 3.x 資助復康排班結果追蹤） */

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
