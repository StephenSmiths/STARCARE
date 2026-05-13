import type {
  PolicySubsidizedFundingTier,
  PolicySubsidizedRoleOfferingRow,
  PolicySubsidizedRoleType,
  PolicySlotVariant,
  SchedulingPolicyBundle,
} from '../../../repositories/schedulingPolicyTypes'
import {
  POLICY_SUBSIDIZED_FUNDING_TIERS,
  POLICY_SUBSIDIZED_ROLE_TYPES,
  POLICY_SLOT_VARIANTS,
} from '../../../repositories/schedulingPolicyTypes'

const TIER_SET = new Set<string>(POLICY_SUBSIDIZED_FUNDING_TIERS)
const ROLE_SET = new Set<string>(POLICY_SUBSIDIZED_ROLE_TYPES)
const VARIANT_SET = new Set<string>(POLICY_SLOT_VARIANTS)

export const POLICY_SUBSIDIZED_ROLE_OFFERING_COUNT =
  POLICY_SUBSIDIZED_FUNDING_TIERS.length * POLICY_SUBSIDIZED_ROLE_TYPES.length * POLICY_SLOT_VARIANTS.length

const isFundingTier = (s: string): s is PolicySubsidizedFundingTier => TIER_SET.has(s)
const isRoleType = (s: string): s is PolicySubsidizedRoleType => ROLE_SET.has(s)
const isSlotVariant = (s: string): s is PolicySlotVariant => VARIANT_SET.has(s)

/** 完整 48 格預設（全關；與 PDF 勾選項對齊，由使用者於 UI 啟用） */
export const DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS: PolicySubsidizedRoleOfferingRow[] =
  POLICY_SUBSIDIZED_FUNDING_TIERS.flatMap((fundingTier) =>
    POLICY_SUBSIDIZED_ROLE_TYPES.flatMap((roleType) =>
      POLICY_SLOT_VARIANTS.map((slotVariant) => ({
        fundingTier,
        roleType,
        slotVariant,
        enabled: false,
      })),
    ),
  )

const sortKey = (r: PolicySubsidizedRoleOfferingRow): string =>
  `${r.fundingTier}\0${r.roleType}\0${r.slotVariant}`

export const sortRoleOfferingsCanonical = (rows: PolicySubsidizedRoleOfferingRow[]): PolicySubsidizedRoleOfferingRow[] =>
  [...rows].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))

/** 須恰好 48 筆且 (fundingTier, roleType, slotVariant) 不重複、枚舉合法 */
export const isValidPolicySubsidizedRoleOfferings = (rows: PolicySubsidizedRoleOfferingRow[]): boolean => {
  if (rows.length !== POLICY_SUBSIDIZED_ROLE_OFFERING_COUNT) return false
  const seen = new Set<string>()
  for (const r of rows) {
    if (!isFundingTier(r.fundingTier) || !isRoleType(r.roleType) || !isSlotVariant(r.slotVariant)) return false
    if (typeof r.enabled !== 'boolean') return false
    const k = sortKey(r)
    if (seen.has(k)) return false
    seen.add(k)
  }
  return seen.size === POLICY_SUBSIDIZED_ROLE_OFFERING_COUNT
}

/** 自 bundle 還原；列不完整或鍵重複時回預設 48 格 */
export const bundleRoleOfferingsToDraft = (
  rows: SchedulingPolicyBundle['subsidizedRoleOfferings'] | undefined,
): PolicySubsidizedRoleOfferingRow[] => {
  const list: PolicySubsidizedRoleOfferingRow[] = []
  for (const raw of rows ?? []) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const fundingTier = String(r.fundingTier ?? r.funding_tier ?? '')
    const roleType = String(r.roleType ?? r.role_type ?? '')
    const slotVariant = String(r.slotVariant ?? r.slot_variant ?? '')
    if (!isFundingTier(fundingTier) || !isRoleType(roleType) || !isSlotVariant(slotVariant)) continue
    list.push({
      fundingTier,
      roleType,
      slotVariant,
      enabled: Boolean(r.enabled),
    })
  }
  return isValidPolicySubsidizedRoleOfferings(list) ? sortRoleOfferingsCanonical(list) : [...DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS]
}

export const draftRoleOfferingsToBundle = (
  rows: PolicySubsidizedRoleOfferingRow[],
): SchedulingPolicyBundle['subsidizedRoleOfferings'] =>
  isValidPolicySubsidizedRoleOfferings(rows) ? sortRoleOfferingsCanonical(rows) : [...DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS]
