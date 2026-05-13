import type { SystemSettingsSnapshot } from '../types'
import { isValidPolicySubsidizedPassOrder } from './policyPassOrderDraft'
import { isValidPolicySubsidizedRoleOfferings } from './policySubsidizedRoleOfferingDraft'
import { isValidPolicySubsidizedTiers } from './policySubsidizedTierDraft'

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

  const policySvc = new Set(['Subsidized_Rehab', 'Dementia_Care'])
  const policyDel = new Set(['Individual', 'Group'])
  input.policyFixedActivities.forEach((r, i) => {
    const idx = i + 1
    if (!policySvc.has(r.serviceType)) errors.push(`固定活動第 ${idx} 筆：服務類型須為 Subsidized_Rehab 或 Dementia_Care`)
    if (!policyDel.has(r.deliveryMode)) errors.push(`固定活動第 ${idx} 筆：模式須為 Individual 或 Group`)
    if (!isValidHm(r.timeStart) || !isValidHm(r.timeEnd)) errors.push(`固定活動第 ${idx} 筆：時段須為 HH:mm`)
    if (isValidHm(r.timeStart) && isValidHm(r.timeEnd) && !hmLessThan(r.timeStart, r.timeEnd)) {
      errors.push(`固定活動第 ${idx} 筆：開始須早於結束`)
    }
  })

  const passNeedsValidation =
    input.policySubsidizedPassOrderHydrated === true || input.policySubsidizedPassOrder.length > 0
  if (passNeedsValidation && !isValidPolicySubsidizedPassOrder(input.policySubsidizedPassOrder)) {
    errors.push(
      '資助復康 Pass 優先次序須為三筆：sortOrder 須為 1、2、3 各一，且 fundingTier 須為 GradeA_Subsidized、Voucher、Private 各出現一次（PDF 02【16】facility_policy_subsidized_pass_order）',
    )
  }

  const tiersNeedValidation =
    input.policySubsidizedTiersHydrated === true || input.policySubsidizedTiers.length > 0
  if (tiersNeedValidation && !isValidPolicySubsidizedTiers(input.policySubsidizedTiers)) {
    errors.push(
      '資助復康三列須為甲一／院舍券／私位各一：enabled／specialCareTherapistOnly 為布林，weeklyMinSessions 須為非負整數（PDF 02【16】facility_policy_subsidized_tier）',
    )
  }

  const roleOfferingsNeedValidation =
    input.policySubsidizedRoleOfferingsHydrated === true || input.policySubsidizedRoleOfferings.length > 0
  if (roleOfferingsNeedValidation && !isValidPolicySubsidizedRoleOfferings(input.policySubsidizedRoleOfferings)) {
    errors.push(
      '資助復康職類矩陣須為完整 48 格（3 資助列 × 4 職類 × 4 節長變體），鍵不重複且 enabled 為布林（PDF 02【16】facility_policy_subsidized_role_offerings）',
    )
  }

  return { ok: errors.length === 0, errors }
}
