/**
 * PDF 02【16】Seq 29：將院舍「排班視窗／非治療時段」偏好餵入資助復康排班引擎（Pass 前過濾時段）。
 * PDF 01 §3「服務類型隔離」：`filterToSubsidizedRehabServiceOnly`／**`filterToDementiaServiceOnly`** 供兩軌乾跑入口併用。
 * 01 §3.1 仍由 schedulingCore 處理；視窗層僅依設定縮小可用 sessions。
 * `rulesEngineEnabled === false` 時不過濾（相容既有行為／除錯）。
 */
import type { SchedulingSession } from '../../../services/schedulingService'
import {
  hmLessThan,
  isValidHm,
  loadSystemSettings,
  type SystemSettingsSnapshot,
} from '../../systemSettings'
import { resolveSubsidizedRehabNonTherapyIntervalsForFilter } from '../../systemSettings/domain/subsidizedRehabNonTherapyIntervals'

/** PDF 01 §3：資助復康 Pass 引擎輸入僅保留 `Subsidized_Rehab`（與認知軌 `Dementia_Service` 永不混用） */
export const filterToSubsidizedRehabServiceOnly = (sessions: SchedulingSession[]): SchedulingSession[] =>
  sessions.filter((row) => row.serviceType === 'Subsidized_Rehab')

/** PDF 01 §3：認知軌乾跑輸入僅保留 `Dementia_Service`（與資助復康 Pass 永不混用） */
export const filterToDementiaServiceOnly = (sessions: SchedulingSession[]): SchedulingSession[] =>
  sessions.filter((row) => row.serviceType === 'Dementia_Service')

const parseSlotStartHm = (timeSlot: string): string | null => {
  const first = timeSlot.trim().split('-')[0]?.trim() ?? ''
  return isValidHm(first) ? first : null
}

/** 半開區間 [start, end)，字串比較適用零填充 HH:mm */
const inHalfOpenHm = (hm: string, start: string, end: string): boolean =>
  (hm === start || hmLessThan(start, hm)) && hmLessThan(hm, end)

export const filterSchedulingSessionsForSubsidizedEngine = (
  sessions: SchedulingSession[],
  snapshot?: SystemSettingsSnapshot,
): SchedulingSession[] => {
  const s = snapshot ?? loadSystemSettings()
  if (!s.rulesEngineEnabled) return [...sessions]

  const ws = s.schedulingWindowStart.trim()
  const we = s.schedulingWindowEnd.trim()
  if (!isValidHm(ws) || !isValidHm(we) || !hmLessThan(ws, we)) return [...sessions]

  const nonTherapyIntervals = resolveSubsidizedRehabNonTherapyIntervalsForFilter(s)
  if (nonTherapyIntervals.length === 0) return [...sessions]

  return sessions.filter((row) => {
    const hm = parseSlotStartHm(row.timeSlot)
    if (!hm) return true
    if (!inHalfOpenHm(hm, ws, we)) return false
    if (
      row.serviceType === 'Subsidized_Rehab' &&
      nonTherapyIntervals.some(({ timeStart, timeEnd }) => inHalfOpenHm(hm, timeStart, timeEnd))
    ) {
      return false
    }
    return true
  })
}
