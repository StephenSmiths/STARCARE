/**
 * PDF 02【16】認知障礙症政策草稿：與 Edge `ROLE_TYPES_DEM`／`SLOT_VARIANTS`、`facility_policy_dementia_*` 對齊。
 */
import type {
  PolicyDementiaCore,
  PolicyDementiaRoleOfferingRow,
  PolicyDementiaRoleType,
  PolicySlotVariant,
  SchedulingPolicyBundle,
} from '../../../repositories/schedulingPolicyTypes'
import { POLICY_DEMENTIA_ROLE_TYPES, POLICY_SLOT_VARIANTS } from '../../../repositories/schedulingPolicyTypes'

const ROLE_SET = new Set<string>(POLICY_DEMENTIA_ROLE_TYPES)
const VARIANT_SET = new Set<string>(POLICY_SLOT_VARIANTS)

export const POLICY_DEMENTIA_ROLE_OFFERING_COUNT =
  POLICY_DEMENTIA_ROLE_TYPES.length * POLICY_SLOT_VARIANTS.length

const isRoleType = (s: string): s is PolicyDementiaRoleType => ROLE_SET.has(s)
const isSlotVariant = (s: string): s is PolicySlotVariant => VARIANT_SET.has(s)

export const DEFAULT_POLICY_DEMENTIA_CORE: PolicyDementiaCore = {
  enabled: false,
  weeklyMinSessions: 0,
  specialCareTherapistOnly: false,
}

/** 完整 8 格預設（全關；由使用者於 UI 啟用） */
export const DEFAULT_POLICY_DEMENTIA_ROLE_OFFERINGS: PolicyDementiaRoleOfferingRow[] =
  POLICY_DEMENTIA_ROLE_TYPES.flatMap((roleType) =>
    POLICY_SLOT_VARIANTS.map((slotVariant) => ({
      roleType,
      slotVariant,
      enabled: false,
    })),
  )

const sortKey = (r: PolicyDementiaRoleOfferingRow): string => `${r.roleType}\0${r.slotVariant}`

export const sortDementiaRoleOfferingsCanonical = (rows: PolicyDementiaRoleOfferingRow[]): PolicyDementiaRoleOfferingRow[] =>
  [...rows].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))

export const isValidPolicyDementiaCore = (c: PolicyDementiaCore): boolean =>
  typeof c.enabled === 'boolean' &&
  typeof c.specialCareTherapistOnly === 'boolean' &&
  Number.isInteger(c.weeklyMinSessions) &&
  c.weeklyMinSessions >= 0

/** 須恰好 8 筆且 (roleType, slotVariant) 不重複、枚舉合法 */
export const isValidPolicyDementiaRoleOfferings = (rows: PolicyDementiaRoleOfferingRow[]): boolean => {
  if (rows.length !== POLICY_DEMENTIA_ROLE_OFFERING_COUNT) return false
  const seen = new Set<string>()
  for (const r of rows) {
    if (!isRoleType(r.roleType) || !isSlotVariant(r.slotVariant)) return false
    if (typeof r.enabled !== 'boolean') return false
    const k = sortKey(r)
    if (seen.has(k)) return false
    seen.add(k)
  }
  return seen.size === POLICY_DEMENTIA_ROLE_OFFERING_COUNT
}

export const bundleDementiaCoreToDraft = (
  core: SchedulingPolicyBundle['dementiaCore'] | undefined,
): PolicyDementiaCore => {
  if (!core || typeof core !== 'object') return { ...DEFAULT_POLICY_DEMENTIA_CORE }
  const r = core as Record<string, unknown>
  const w = Number(r.weeklyMinSessions ?? r.weekly_min_sessions ?? 0)
  const c: PolicyDementiaCore = {
    enabled: Boolean(r.enabled ?? true),
    weeklyMinSessions: Number.isInteger(w) && w >= 0 ? w : 0,
    specialCareTherapistOnly: Boolean(r.specialCareTherapistOnly ?? r.special_care_therapist_only),
  }
  return isValidPolicyDementiaCore(c) ? c : { ...DEFAULT_POLICY_DEMENTIA_CORE }
}

export const bundleDementiaRoleOfferingsToDraft = (
  rows: SchedulingPolicyBundle['dementiaRoleOfferings'] | undefined,
): PolicyDementiaRoleOfferingRow[] => {
  const list: PolicyDementiaRoleOfferingRow[] = []
  for (const raw of rows ?? []) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const roleType = String(r.roleType ?? r.role_type ?? '')
    const slotVariant = String(r.slotVariant ?? r.slot_variant ?? '')
    if (!isRoleType(roleType) || !isSlotVariant(slotVariant)) continue
    list.push({ roleType, slotVariant, enabled: Boolean(r.enabled) })
  }
  return isValidPolicyDementiaRoleOfferings(list)
    ? sortDementiaRoleOfferingsCanonical(list)
    : [...DEFAULT_POLICY_DEMENTIA_ROLE_OFFERINGS]
}

export const draftDementiaCoreToBundle = (c: PolicyDementiaCore): PolicyDementiaCore => ({
  enabled: Boolean(c.enabled),
  weeklyMinSessions:
    Number.isInteger(c.weeklyMinSessions) && c.weeklyMinSessions >= 0 ? c.weeklyMinSessions : 0,
  specialCareTherapistOnly: Boolean(c.specialCareTherapistOnly),
})

export const draftDementiaRoleOfferingsToBundle = (
  rows: PolicyDementiaRoleOfferingRow[],
): PolicyDementiaRoleOfferingRow[] =>
  isValidPolicyDementiaRoleOfferings(rows)
    ? sortDementiaRoleOfferingsCanonical(rows)
    : [...DEFAULT_POLICY_DEMENTIA_ROLE_OFFERINGS]
