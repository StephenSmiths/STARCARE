import type { SystemSettingsSnapshot } from '../types'

/** HH:mm，24 小時制 */
const HM = /^([01]\d|2[0-3]):[0-5]\d$/

export interface ValidationResult {
  ok: boolean
  errors: string[]
}

export const isValidHm = (value: string): boolean => HM.test(value.trim())

/** 同格式 HH:mm 字串可比較大小（當日區間，不含跨午夜） */
export const hmLessThan = (a: string, b: string): boolean => a.trim() < b.trim()

export const validateSystemSettings = (input: SystemSettingsSnapshot): ValidationResult => {
  const errors: string[] = []
  const pairs: Array<[string, string]> = [
    ['排班開始', input.schedulingWindowStart],
    ['排班結束', input.schedulingWindowEnd],
    ['非治療開始', input.nonTherapyWindowStart],
    ['非治療結束', input.nonTherapyWindowEnd],
  ]
  for (const [label, raw] of pairs) {
    if (!isValidHm(raw)) errors.push(`${label} 須為 HH:mm（24 小時制）`)
  }
  if (
    isValidHm(input.schedulingWindowStart) &&
    isValidHm(input.schedulingWindowEnd) &&
    !hmLessThan(input.schedulingWindowStart, input.schedulingWindowEnd)
  ) {
    errors.push('排班開始須早於排班結束')
  }
  if (
    isValidHm(input.nonTherapyWindowStart) &&
    isValidHm(input.nonTherapyWindowEnd) &&
    !hmLessThan(input.nonTherapyWindowStart, input.nonTherapyWindowEnd)
  ) {
    errors.push('非治療開始須早於非治療結束')
  }
  const t = input.therapistGroupSessionsDailyCap
  const a = input.assistantGroupSessionsDailyCap
  const g = input.groupParticipantCap
  if (!Number.isFinite(t) || !Number.isInteger(t) || t < 0) errors.push('治療師小組每日上限須為非負整數')
  if (!Number.isFinite(a) || !Number.isInteger(a) || a < 0) errors.push('治療助理小組每日上限須為非負整數')
  if (!Number.isFinite(g) || !Number.isInteger(g) || g < 1) errors.push('小組人數上限須為至少 1 之整數')
  return { ok: errors.length === 0, errors }
}
