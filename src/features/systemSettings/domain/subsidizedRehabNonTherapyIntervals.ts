/**
 * PDF 02【16】Seq 29：資助復康引擎用「非治療排除區間」（可多段 HH:mm）。
 * 雲端 `facility_policy_non_therapy_slots` 經 bundle 還原；未帶時回落單一午休欄。
 */
import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'
import type { SubsidizedRehabNonTherapyInterval, SystemSettingsSnapshot } from '../types'
import { shiftPrepSlotTimes } from './shiftPrepWindow'
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

/** localStorage 反序列化：空陣列視為「已啟用多段編輯但無額外列」；缺鍵由呼叫端不寫入 snapshot */
export const parseSubsidizedRehabNonTherapyIntervals = (raw: unknown): SubsidizedRehabNonTherapyInterval[] | undefined => {
  if (!Array.isArray(raw)) return undefined
  if (raw.length === 0) return []
  const out: SubsidizedRehabNonTherapyInterval[] = []
  for (const x of raw) {
    if (typeof x !== 'object' || x === null) continue
    const r = x as Record<string, unknown>
    const timeStart = String(r.timeStart ?? r.time_start ?? '').trim()
    const timeEnd = String(r.timeEnd ?? r.time_end ?? '').trim()
    if (!isValidHm(timeStart) || !isValidHm(timeEnd) || !hmLessThan(timeStart, timeEnd)) continue
    out.push({ timeStart, timeEnd })
  }
  return out
}

/** 僅當政策列需與單一午休欄分流（多段或含 DOC／OTHER）時附加至 hydrate 快照 */
export const shouldAttachSubsidizedRehabNonTherapyIntervalsFromPolicy = (
  slots: SchedulingPolicyBundle['nonTherapySlots'],
): boolean => {
  const rows = slots ?? []
  if (intervalsFromPolicyNonTherapySlots(rows).length > 1) return true
  return rows.some((s) => s.slotKind !== 'LUNCH' && s.slotKind !== 'SHIFT_PREP_BLOCK')
}

/**
 * 將草稿「多段排除」轉為 **`OTHER`** 列（已排除與午休／開工準備重疊者，供 **`mergeP1DraftIntoPolicyBundle`**）。
 */
export const draftOtherNonTherapySlotsFromIntervals = (
  draft: SystemSettingsSnapshot,
): Array<{ slotKind: 'OTHER'; timeStart: string; timeEnd: string }> => {
  const intervals = draft.subsidizedRehabNonTherapyIntervals
  if (intervals === undefined) return []
  const lunchS = draft.nonTherapyWindowStart.trim()
  const lunchE = draft.nonTherapyWindowEnd.trim()
  let prepS = ''
  let prepE = ''
  if (draft.shiftPrepBlockEnabled) {
    const p = shiftPrepSlotTimes(draft.schedulingWindowStart, draft.schedulingWindowEnd)
    prepS = p.timeStart.trim()
    prepE = p.timeEnd.trim()
  }
  const seen = new Set<string>()
  const out: Array<{ slotKind: 'OTHER'; timeStart: string; timeEnd: string }> = []
  for (const row of intervals) {
    const ts = row.timeStart.trim()
    const te = row.timeEnd.trim()
    if (!isValidHm(ts) || !isValidHm(te) || !hmLessThan(ts, te)) continue
    if (ts === lunchS && te === lunchE) continue
    if (draft.shiftPrepBlockEnabled && ts === prepS && te === prepE) continue
    const k = `${ts}|${te}`
    if (seen.has(k)) continue
    seen.add(k)
    out.push({ slotKind: 'OTHER', timeStart: ts, timeEnd: te })
  }
  return out
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

/** 提交 P1 時保留雲端 **DOC** 列；**`OTHER`** 由草稿多段或沿用雲端（見 **`mergeP1DraftIntoPolicyBundle`**） */
export const PRESERVED_DOC_NON_THERAPY_SLOT_KINDS = new Set(['MORNING_DOC', 'AFTERNOON_DOC'])
