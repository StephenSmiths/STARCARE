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
  return { ok: errors.length === 0, errors }
}
