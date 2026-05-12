/** 開工準備時段：自排班視窗起算 30 分鐘，且不超出排班視窗結束（PDF 02【16】／P1） */

const parseHmToMin = (s: string): number => {
  const [h, m] = s.trim().split(':').map(Number)
  return h * 60 + m
}

const minToHm = (total: number): string => {
  const t = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const h = Math.floor(t / 60)
  const m = t % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export const shiftPrepSlotTimes = (
  schedulingWindowStart: string,
  schedulingWindowEnd: string,
): { timeStart: string; timeEnd: string } => {
  const a = parseHmToMin(schedulingWindowStart)
  const b = parseHmToMin(schedulingWindowEnd)
  const prepEnd = Math.min(a + 30, b)
  return { timeStart: minToHm(a), timeEnd: minToHm(prepEnd) }
}
