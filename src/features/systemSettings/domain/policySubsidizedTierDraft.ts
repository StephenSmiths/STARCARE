import type {
  PolicySubsidizedFundingTier,
  PolicySubsidizedTierRow,
  SchedulingPolicyBundle,
} from '../../../repositories/schedulingPolicyTypes'
import { POLICY_SUBSIDIZED_FUNDING_TIERS } from '../../../repositories/schedulingPolicyTypes'

const TIER_SET = new Set<string>(POLICY_SUBSIDIZED_FUNDING_TIERS)

const isFundingTier = (s: string): s is PolicySubsidizedFundingTier => TIER_SET.has(s)

const tierIndex = (t: PolicySubsidizedFundingTier) => POLICY_SUBSIDIZED_FUNDING_TIERS.indexOf(t)

/** 甲一／院舍券／私位各一列之預設（啟用、每週最低 0、SC 不限治療師） */
export const DEFAULT_POLICY_SUBSIDIZED_TIER_ROWS: PolicySubsidizedTierRow[] = POLICY_SUBSIDIZED_FUNDING_TIERS.map(
  (fundingTier) => ({
    fundingTier,
    enabled: true,
    weeklyMinSessions: 0,
    specialCareTherapistOnly: false,
  }),
)

export const sortTiersByCanonicalOrder = (rows: PolicySubsidizedTierRow[]): PolicySubsidizedTierRow[] =>
  [...rows].sort((a, b) => tierIndex(a.fundingTier) - tierIndex(b.fundingTier))

/** 恰好三列且 fundingTier 兩兩相異；每週最低次數須為非負整數 */
export const isValidPolicySubsidizedTiers = (rows: PolicySubsidizedTierRow[]): boolean => {
  if (rows.length !== 3) return false
  const tiers = new Set(rows.map((r) => r.fundingTier))
  if (tiers.size !== 3) return false
  return rows.every(
    (r) =>
      isFundingTier(r.fundingTier) &&
      typeof r.enabled === 'boolean' &&
      typeof r.specialCareTherapistOnly === 'boolean' &&
      Number.isInteger(r.weeklyMinSessions) &&
      r.weeklyMinSessions >= 0,
  )
}

/** 自 bundle 還原草稿；列數或欄位不足時回預設三列 */
export const bundleTiersToDraft = (rows: SchedulingPolicyBundle['subsidizedTiers'] | undefined): PolicySubsidizedTierRow[] => {
  const list: PolicySubsidizedTierRow[] = []
  for (const raw of rows ?? []) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const fundingTier = String(r.fundingTier ?? r.funding_tier ?? '')
    if (!isFundingTier(fundingTier)) continue
    const w = Number(r.weeklyMinSessions ?? r.weekly_min_sessions ?? 0)
    list.push({
      fundingTier,
      enabled: Boolean(r.enabled ?? true),
      weeklyMinSessions: Number.isInteger(w) ? w : NaN,
      specialCareTherapistOnly: Boolean(r.specialCareTherapistOnly ?? r.special_care_therapist_only),
    })
  }
  return isValidPolicySubsidizedTiers(list) ? sortTiersByCanonicalOrder(list) : [...DEFAULT_POLICY_SUBSIDIZED_TIER_ROWS]
}

/** 合併至 bundle；無效或空陣列時回預設三列（與無 base 之首版提交對齊） */
export const draftTiersToBundle = (rows: PolicySubsidizedTierRow[]): SchedulingPolicyBundle['subsidizedTiers'] =>
  isValidPolicySubsidizedTiers(rows) ? sortTiersByCanonicalOrder(rows) : [...DEFAULT_POLICY_SUBSIDIZED_TIER_ROWS]
