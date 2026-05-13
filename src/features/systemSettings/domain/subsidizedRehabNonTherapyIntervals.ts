/**
 * PDF 02【16】Seq 29：資助復康引擎用「非治療排除區間」（可多段 HH:mm）。
 * 雲端 `facility_policy_non_therapy_slots` 經 bundle 還原；未帶時回落單一午休欄。
 */
import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'
import type { SubsidizedRehabNonTherapyInterval, SystemSettingsSnapshot } from '../types'
import { hmLessThan, isValidHm } from './systemSettingsValidation'

/** 自政策列組出已驗證、依開始時間排序之排除區間（僅時段，不含 slot_kind 語意） */
export const intervalsFromPolicyNonTherapySlots = (
  slots: SchedulingPolicyBundle['nonTherapySlots'],
): SubsidizedRehabNonTherapyInterval[] => {
  const rows = (slots ?? [])
    .map((s) => ({ ts: String(s.timeStart ?? '').trim(), te: String(s.timeEnd ?? '').trim() }))
    .filter(({ ts, te }) => isValidHm(ts) && isValidHm(te) && hmLessThan(ts, te))
    .map(({ ts, te }) => ({ timeStart: ts, timeEnd: te }))
  rows.sort((a, b) => (a.timeStart < b.timeStart ? -1 : a.timeStart > b.timeStart ? 1 : 0))
  return rows
}

/** localStorage 反序列化：僅接受物件陣列且每列 HH:mm 合法 */
export const parseSubsidizedRehabNonTherapyIntervals = (raw: unknown): SubsidizedRehabNonTherapyInterval[] | undefined => {
  if (!Array.isArray(raw) || raw.length === 0) return undefined
  const out: SubsidizedRehabNonTherapyInterval[] = []
  for (const x of raw) {
    if (typeof x !== 'object' || x === null) continue
    const r = x as Record<string, unknown>
    const timeStart = String(r.timeStart ?? r.time_start ?? '').trim()
    const timeEnd = String(r.timeEnd ?? r.time_end ?? '').trim()
    if (!isValidHm(timeStart) || !isValidHm(timeEnd) || !hmLessThan(timeStart, timeEnd)) continue
    out.push({ timeStart, timeEnd })
  }
  return out.length > 0 ? out : undefined
}

/**
 * 供資助復康時段過濾：優先 `subsidizedRehabNonTherapyIntervals`；否則單一午休欄。
 * 回傳空陣列表示「無任何有效非治療排除」（與舊版無效午休時略過整段過濾之前提對齊）。
 */
export const resolveSubsidizedRehabNonTherapyIntervalsForFilter = (
  s: SystemSettingsSnapshot,
): SubsidizedRehabNonTherapyInterval[] => {
  const fromKey = s.subsidizedRehabNonTherapyIntervals
  if (fromKey && fromKey.length > 0) {
    return fromKey.filter(
      ({ timeStart, timeEnd }) =>
        isValidHm(timeStart) && isValidHm(timeEnd) && hmLessThan(timeStart.trim(), timeEnd.trim()),
    )
  }
  const ns = s.nonTherapyWindowStart.trim()
  const ne = s.nonTherapyWindowEnd.trim()
  if (isValidHm(ns) && isValidHm(ne) && hmLessThan(ns, ne)) return [{ timeStart: ns, timeEnd: ne }]
  return []
}

/** 提交 P1 時保留雲端僅能由擴充路徑維護之 slot（午休／開工準備由草稿覆寫） */
export const PRESERVED_NON_THERAPY_SLOT_KINDS = new Set(['MORNING_DOC', 'AFTERNOON_DOC', 'OTHER'])
