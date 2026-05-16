/**
 * 將 hh:mm–hh:mm 依節長（分鐘）切為多段（PDF 02【16】P2／週更表／排班時段）。
 */
export const hmToMinutes = (hm: string): number => {
  const m = hm.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return 0
  return Number(m[1]) * 60 + Number(m[2])
}

export const minutesToHm = (totalMinutes: number): string => {
  const h = Math.floor(totalMinutes / 60) % 24
  const min = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

export type HmTimeRange = { startHm: string; endHm: string }

/** 若總長 ≤ chunk 則回傳單段；否則由起點起連續切分（最後一段可短於 chunk）。 */
export const splitHmTimeRangeByChunkMinutes = (
  startHm: string,
  endHm: string,
  chunkMinutes: number,
): HmTimeRange[] => {
  const start = hmToMinutes(startHm)
  const end = hmToMinutes(endHm)
  const chunk = Math.max(1, Math.floor(chunkMinutes))
  if (end <= start) return [{ startHm, endHm }]
  const total = end - start
  if (total <= chunk) return [{ startHm, endHm }]
  const out: HmTimeRange[] = []
  let cursor = start
  while (cursor < end) {
    const next = Math.min(cursor + chunk, end)
    out.push({ startHm: minutesToHm(cursor), endHm: minutesToHm(next) })
    cursor = next
  }
  return out
}

export const schedulingSessionTimeSlotDurationMinutes = (timeSlot: string): number => {
  const [a, b] = timeSlot.split('-').map((s) => s.trim())
  if (!a || !b) return 0
  return Math.max(0, hmToMinutes(b) - hmToMinutes(a))
}
