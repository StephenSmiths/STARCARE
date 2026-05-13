import { SYSTEM_SETTINGS_STORAGE_KEY } from '../localStorageKeys'
import { bumpSystemSettingsExternalVersion } from '../systemSettingsExternalStore'
import type { PolicyFixedActivityRow, PolicySubsidizedPassOrderRow, PolicySubsidizedTierRow, PolicySubsidizedRoleOfferingRow } from '../../../repositories/schedulingPolicyTypes'
import { POLICY_SUBSIDIZED_FUNDING_TIERS, POLICY_SUBSIDIZED_ROLE_TYPES, POLICY_SLOT_VARIANTS } from '../../../repositories/schedulingPolicyTypes'
import type { SystemSettingsSnapshot } from '../types'

const parsePolicyFixedActivities = (raw: unknown): PolicyFixedActivityRow[] => {
  if (!Array.isArray(raw)) return []
  const out: PolicyFixedActivityRow[] = []
  for (const x of raw) {
    if (!isRecord(x)) continue
    const serviceType = String(x.serviceType ?? x.service_type ?? '')
    const deliveryMode = String(x.deliveryMode ?? x.delivery_mode ?? '')
    const timeStart = String(x.timeStart ?? x.time_start ?? '')
    const timeEnd = String(x.timeEnd ?? x.time_end ?? '')
    if (!serviceType || !deliveryMode || !timeStart || !timeEnd) continue
    out.push({
      serviceType,
      timeStart,
      timeEnd,
      deliveryMode,
      activityName: String(x.activityName ?? x.activity_name ?? ''),
      rolePt: Boolean(x.rolePt ?? x.role_pt),
      rolePta: Boolean(x.rolePta ?? x.role_pta),
      roleOt: Boolean(x.roleOt ?? x.role_ot),
      roleOta: Boolean(x.roleOta ?? x.role_ota),
    })
  }
  return out
}

const FUNDING_TIER_PARSE = new Set<string>(POLICY_SUBSIDIZED_FUNDING_TIERS)
const ROLE_TYPE_PARSE = new Set<string>(POLICY_SUBSIDIZED_ROLE_TYPES)
const SLOT_VARIANT_PARSE = new Set<string>(POLICY_SLOT_VARIANTS)

const parsePolicySubsidizedPassOrder = (raw: unknown): PolicySubsidizedPassOrderRow[] => {
  if (!Array.isArray(raw)) return []
  const out: PolicySubsidizedPassOrderRow[] = []
  for (const x of raw) {
    if (!isRecord(x)) continue
    const sortOrder = Number(x.sortOrder ?? x.sort_order)
    const fundingTier = String(x.fundingTier ?? x.funding_tier ?? '')
    if (!Number.isInteger(sortOrder) || !FUNDING_TIER_PARSE.has(fundingTier)) continue
    out.push({ sortOrder, fundingTier: fundingTier as PolicySubsidizedPassOrderRow['fundingTier'] })
  }
  return out
}

const parsePolicySubsidizedTiers = (raw: unknown): PolicySubsidizedTierRow[] => {
  if (!Array.isArray(raw)) return []
  const out: PolicySubsidizedTierRow[] = []
  for (const x of raw) {
    if (!isRecord(x)) continue
    const fundingTier = String(x.fundingTier ?? x.funding_tier ?? '')
    if (!FUNDING_TIER_PARSE.has(fundingTier)) continue
    const w = Number(x.weeklyMinSessions ?? x.weekly_min_sessions ?? 0)
    out.push({
      fundingTier: fundingTier as PolicySubsidizedTierRow['fundingTier'],
      enabled: Boolean(x.enabled ?? true),
      weeklyMinSessions: Number.isInteger(w) ? w : NaN,
      specialCareTherapistOnly: Boolean(x.specialCareTherapistOnly ?? x.special_care_therapist_only),
    })
  }
  return out
}

const parsePolicySubsidizedRoleOfferings = (raw: unknown): PolicySubsidizedRoleOfferingRow[] => {
  if (!Array.isArray(raw)) return []
  const out: PolicySubsidizedRoleOfferingRow[] = []
  for (const x of raw) {
    if (!isRecord(x)) continue
    const fundingTier = String(x.fundingTier ?? x.funding_tier ?? '')
    const roleType = String(x.roleType ?? x.role_type ?? '')
    const slotVariant = String(x.slotVariant ?? x.slot_variant ?? '')
    if (!FUNDING_TIER_PARSE.has(fundingTier) || !ROLE_TYPE_PARSE.has(roleType) || !SLOT_VARIANT_PARSE.has(slotVariant)) {
      continue
    }
    out.push({
      fundingTier: fundingTier as PolicySubsidizedRoleOfferingRow['fundingTier'],
      roleType: roleType as PolicySubsidizedRoleOfferingRow['roleType'],
      slotVariant: slotVariant as PolicySubsidizedRoleOfferingRow['slotVariant'],
      enabled: Boolean(x.enabled),
    })
  }
  return out
}

export const DEFAULT_SYSTEM_SETTINGS: SystemSettingsSnapshot = {
  schedulingWindowStart: '07:00',
  schedulingWindowEnd: '22:00',
  nonTherapyWindowStart: '12:00',
  nonTherapyWindowEnd: '14:00',
  shiftPrepBlockEnabled: false,
  therapistGroupSessionsDailyCap: 8,
  assistantGroupSessionsDailyCap: 8,
  groupParticipantCap: 6,
  rulesEngineEnabled: true,
  fixedActivitiesEnabled: true,
  serviceTypesEnabled: true,
  specialCareTherapistOnly: false,
  policyFixedActivities: [],
  policySubsidizedPassOrder: [],
  policySubsidizedTiers: [],
  policySubsidizedRoleOfferings: [],
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

export const parseStoredSnapshot = (raw: string | null): SystemSettingsSnapshot | null => {
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return null
    const g = (k: string): unknown => parsed[k]
    const schedulingWindowStart = g('schedulingWindowStart')
    const schedulingWindowEnd = g('schedulingWindowEnd')
    const nonTherapyWindowStart = g('nonTherapyWindowStart')
    const nonTherapyWindowEnd = g('nonTherapyWindowEnd')
    const shiftPrepRaw = g('shiftPrepBlockEnabled')
    const therapistCapRaw = g('therapistGroupSessionsDailyCap')
    const assistantCapRaw = g('assistantGroupSessionsDailyCap')
    const groupCapRaw = g('groupParticipantCap')
    const shiftPrepBlockEnabled = typeof shiftPrepRaw === 'boolean' ? shiftPrepRaw : DEFAULT_SYSTEM_SETTINGS.shiftPrepBlockEnabled
    const therapistGroupSessionsDailyCap =
      typeof therapistCapRaw === 'number' ? therapistCapRaw : DEFAULT_SYSTEM_SETTINGS.therapistGroupSessionsDailyCap
    const assistantGroupSessionsDailyCap =
      typeof assistantCapRaw === 'number' ? assistantCapRaw : DEFAULT_SYSTEM_SETTINGS.assistantGroupSessionsDailyCap
    const groupParticipantCap =
      typeof groupCapRaw === 'number' ? groupCapRaw : DEFAULT_SYSTEM_SETTINGS.groupParticipantCap
    const rulesEngineEnabled = g('rulesEngineEnabled')
    const fixedActivitiesEnabled = g('fixedActivitiesEnabled')
    const serviceTypesEnabled = g('serviceTypesEnabled')
    const specialCareTherapistOnly = g('specialCareTherapistOnly')
    const policyFixedActivitiesRaw = g('policyFixedActivities')
    const policyFixedActivitiesHydrated = g('policyFixedActivitiesHydrated') === true
    const policySubsidizedPassOrderRaw = g('policySubsidizedPassOrder')
    const policySubsidizedPassOrderHydrated = g('policySubsidizedPassOrderHydrated') === true
    const policySubsidizedTiersRaw = g('policySubsidizedTiers')
    const policySubsidizedTiersHydrated = g('policySubsidizedTiersHydrated') === true
    const policySubsidizedRoleOfferingsRaw = g('policySubsidizedRoleOfferings')
    const policySubsidizedRoleOfferingsHydrated = g('policySubsidizedRoleOfferingsHydrated') === true
    if (
      typeof schedulingWindowStart !== 'string' ||
      typeof schedulingWindowEnd !== 'string' ||
      typeof nonTherapyWindowStart !== 'string' ||
      typeof nonTherapyWindowEnd !== 'string' ||
      typeof rulesEngineEnabled !== 'boolean' ||
      typeof fixedActivitiesEnabled !== 'boolean' ||
      typeof serviceTypesEnabled !== 'boolean' ||
      typeof specialCareTherapistOnly !== 'boolean'
    ) {
      return null
    }
    const policyFixedActivities = parsePolicyFixedActivities(policyFixedActivitiesRaw)
    const policySubsidizedPassOrder = parsePolicySubsidizedPassOrder(policySubsidizedPassOrderRaw)
    const policySubsidizedTiers = parsePolicySubsidizedTiers(policySubsidizedTiersRaw)
    const policySubsidizedRoleOfferings = parsePolicySubsidizedRoleOfferings(policySubsidizedRoleOfferingsRaw)
    return {
      schedulingWindowStart,
      schedulingWindowEnd,
      nonTherapyWindowStart,
      nonTherapyWindowEnd,
      shiftPrepBlockEnabled,
      therapistGroupSessionsDailyCap,
      assistantGroupSessionsDailyCap,
      groupParticipantCap,
      rulesEngineEnabled,
      fixedActivitiesEnabled,
      serviceTypesEnabled,
      specialCareTherapistOnly,
      policyFixedActivities,
      policySubsidizedPassOrder,
      policySubsidizedTiers,
      policySubsidizedRoleOfferings,
      ...(policyFixedActivitiesHydrated ? { policyFixedActivitiesHydrated: true as const } : {}),
      ...(policySubsidizedPassOrderHydrated ? { policySubsidizedPassOrderHydrated: true as const } : {}),
      ...(policySubsidizedTiersHydrated ? { policySubsidizedTiersHydrated: true as const } : {}),
      ...(policySubsidizedRoleOfferingsHydrated ? { policySubsidizedRoleOfferingsHydrated: true as const } : {}),
    }
  } catch {
    return null
  }
}

export const loadSystemSettings = (): SystemSettingsSnapshot => {
  if (typeof window === 'undefined') return { ...DEFAULT_SYSTEM_SETTINGS }
  const parsed = parseStoredSnapshot(window.localStorage.getItem(SYSTEM_SETTINGS_STORAGE_KEY))
  return parsed ? { ...DEFAULT_SYSTEM_SETTINGS, ...parsed } : { ...DEFAULT_SYSTEM_SETTINGS }
}

export const saveSystemSettings = (snapshot: SystemSettingsSnapshot): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SYSTEM_SETTINGS_STORAGE_KEY, JSON.stringify(snapshot))
  bumpSystemSettingsExternalVersion()
}
