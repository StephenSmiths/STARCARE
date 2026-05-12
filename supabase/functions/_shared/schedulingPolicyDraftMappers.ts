import type { SchedulingPolicyBundle } from './schedulingPolicyTypes.ts'
import {
  DELIVERY_MODES,
  FUNDING_TIERS,
  ROLE_TYPES_DEM,
  ROLE_TYPES_SUB,
  SERVICE_TYPES,
  SLOT_KINDS,
  SLOT_VARIANTS,
} from './schedulingPolicyTypes.ts'

const err = (code: string, message: string) => ({ code, message })

/** 契約：TIME 欄位可接受 HH:mm 或 HH:mm:ss */
export const toPgTime = (s: unknown): string | null => {
  if (typeof s !== 'string') return null
  const t = s.trim()
  if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t
  return null
}

const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])

export type PolicyDraftArrays = {
  nonTherapySlots: SchedulingPolicyBundle['nonTherapySlots']
  numericLimits: SchedulingPolicyBundle['numericLimits']
  fixedActivities: SchedulingPolicyBundle['fixedActivities']
  subsidizedTiers: SchedulingPolicyBundle['subsidizedTiers']
  subsidizedRoleOfferings: SchedulingPolicyBundle['subsidizedRoleOfferings']
  subsidizedPassOrder: SchedulingPolicyBundle['subsidizedPassOrder']
  dementiaCore: SchedulingPolicyBundle['dementiaCore']
  dementiaRoleOfferings: SchedulingPolicyBundle['dementiaRoleOfferings']
}

/** 自 body 解析子表陣列（邊解析邊累積 errors） */
export function parseDraftChildArrays(
  o: Record<string, unknown>,
  errors: Array<{ code: string; message: string }>,
): PolicyDraftArrays {
  const nonTherapySlots = asArr(o.nonTherapySlots ?? o.non_therapy_slots).map((x, i) => {
    if (typeof x !== 'object' || !x) {
      errors.push(err('BAD_SLOT', `nonTherapySlots[${i}] 須為物件`))
      return null
    }
    const r = x as Record<string, unknown>
    const slotKind = String(r.slotKind ?? r.slot_kind ?? '')
    const ts = toPgTime(r.timeStart ?? r.time_start)
    const te = toPgTime(r.timeEnd ?? r.time_end)
    if (!SLOT_KINDS.has(slotKind)) errors.push(err('BAD_SLOT_KIND', `nonTherapySlots[${i}].slotKind 無效`))
    if (!ts || !te) errors.push(err('BAD_TIME', `nonTherapySlots[${i}] 時段格式須為 HH:mm`))
    return { slotKind, timeStart: ts ?? '', timeEnd: te ?? '' }
  })

  const num = (typeof o.numericLimits === 'object' && o.numericLimits) ? (o.numericLimits as Record<string, unknown>) : {}
  const numericLimits = {
    therapistGroupSessionsDailyCap: Number(num.therapistGroupSessionsDailyCap ?? num.therapist_group_sessions_daily_cap ?? 8),
    assistantGroupSessionsDailyCap: Number(num.assistantGroupSessionsDailyCap ?? num.assistant_group_sessions_daily_cap ?? 8),
    groupParticipantCap: Number(num.groupParticipantCap ?? num.group_participant_cap ?? 6),
  }
  for (const [k, v] of Object.entries(numericLimits)) {
    if (!Number.isFinite(v) || v < 0 || (k === 'groupParticipantCap' && v < 1)) {
      errors.push(err('BAD_NUMERIC', `${k} 數值無效`))
    }
  }

  const fixedActivities = asArr(o.fixedActivities ?? o.fixed_activities).map((x, i) => {
    if (typeof x !== 'object' || !x) {
      errors.push(err('BAD_FIXED', `fixedActivities[${i}] 須為物件`))
      return null
    }
    const r = x as Record<string, unknown>
    const serviceType = String(r.serviceType ?? r.service_type ?? '')
    const deliveryMode = String(r.deliveryMode ?? r.delivery_mode ?? '')
    const ts = toPgTime(r.timeStart ?? r.time_start)
    const te = toPgTime(r.timeEnd ?? r.time_end)
    if (!SERVICE_TYPES.has(serviceType)) errors.push(err('BAD_SERVICE_TYPE', `fixedActivities[${i}].serviceType`))
    if (!DELIVERY_MODES.has(deliveryMode)) errors.push(err('BAD_DELIVERY', `fixedActivities[${i}].deliveryMode`))
    if (!ts || !te) errors.push(err('BAD_TIME', `fixedActivities[${i}] 時段`))
    return {
      serviceType,
      timeStart: ts ?? '',
      timeEnd: te ?? '',
      deliveryMode,
      activityName: String(r.activityName ?? r.activity_name ?? ''),
      rolePt: Boolean(r.rolePt ?? r.role_pt),
      rolePta: Boolean(r.rolePta ?? r.role_pta),
      roleOt: Boolean(r.roleOt ?? r.role_ot),
      roleOta: Boolean(r.roleOta ?? r.role_ota),
    }
  })

  const subsidizedTiers = asArr(o.subsidizedTiers ?? o.subsidized_tiers).map((x, i) => {
    if (typeof x !== 'object' || !x) {
      errors.push(err('BAD_TIER', `subsidizedTiers[${i}]`))
      return null
    }
    const r = x as Record<string, unknown>
    const fundingTier = String(r.fundingTier ?? r.funding_tier ?? '')
    if (!FUNDING_TIERS.has(fundingTier)) errors.push(err('BAD_FUNDING', `subsidizedTiers[${i}].fundingTier`))
    return {
      fundingTier,
      enabled: Boolean(r.enabled ?? true),
      weeklyMinSessions: Number(r.weeklyMinSessions ?? r.weekly_min_sessions ?? 0),
      specialCareTherapistOnly: Boolean(r.specialCareTherapistOnly ?? r.special_care_therapist_only),
    }
  })

  const subsidizedRoleOfferings = asArr(o.subsidizedRoleOfferings ?? o.subsidized_role_offerings).map((x, i) => {
    if (typeof x !== 'object' || !x) {
      errors.push(err('BAD_ROLE_OFFER', `subsidizedRoleOfferings[${i}]`))
      return null
    }
    const r = x as Record<string, unknown>
    const fundingTier = String(r.fundingTier ?? r.funding_tier ?? '')
    const roleType = String(r.roleType ?? r.role_type ?? '')
    const slotVariant = String(r.slotVariant ?? r.slot_variant ?? '')
    if (!FUNDING_TIERS.has(fundingTier)) errors.push(err('BAD_FUNDING', `subsidizedRoleOfferings[${i}].fundingTier`))
    if (!ROLE_TYPES_SUB.has(roleType)) errors.push(err('BAD_ROLE', `subsidizedRoleOfferings[${i}].roleType`))
    if (!SLOT_VARIANTS.has(slotVariant)) errors.push(err('BAD_VARIANT', `subsidizedRoleOfferings[${i}].slotVariant`))
    return { fundingTier, roleType, slotVariant, enabled: Boolean(r.enabled) }
  })

  const passRaw = asArr(o.subsidizedPassOrder ?? o.subsidized_pass_order)
  if (passRaw.length !== 3) errors.push(err('BAD_PASS_ORDER', 'subsidizedPassOrder 須恰好三筆（Pass 1–3）'))
  const subsidizedPassOrder = passRaw
    .map((x, i) => {
      if (typeof x !== 'object' || !x) {
        errors.push(err('BAD_PASS', `subsidizedPassOrder[${i}]`))
        return null
      }
      const r = x as Record<string, unknown>
      const sortOrder = Number(r.sortOrder ?? r.sort_order)
      const fundingTier = String(r.fundingTier ?? r.funding_tier ?? '')
      if (!Number.isInteger(sortOrder) || sortOrder < 1 || sortOrder > 10) {
        errors.push(err('BAD_PASS', `subsidizedPassOrder[${i}].sortOrder`))
      }
      if (!FUNDING_TIERS.has(fundingTier)) errors.push(err('BAD_FUNDING', `subsidizedPassOrder[${i}].fundingTier`))
      return { sortOrder, fundingTier }
    })
    .filter(Boolean) as Array<{ sortOrder: number; fundingTier: string }>

  const orders = new Set(subsidizedPassOrder.map((p) => p.sortOrder))
  if (orders.size !== 3 || ![1, 2, 3].every((n) => orders.has(n))) {
    errors.push(err('BAD_PASS_ORDER', 'subsidizedPassOrder 須含 sortOrder 1、2、3 各一筆'))
  }
  const tiersPass = new Set(subsidizedPassOrder.map((p) => p.fundingTier))
  if (tiersPass.size !== 3) errors.push(err('BAD_PASS_ORDER', 'subsidizedPassOrder 三筆 fundingTier 須兩兩相異'))

  let dementiaCore: SchedulingPolicyBundle['dementiaCore'] = null
  const demRaw = o.dementiaCore ?? o.dementia_core
  if (demRaw != null && typeof demRaw === 'object') {
    const r = demRaw as Record<string, unknown>
    dementiaCore = {
      enabled: Boolean(r.enabled ?? true),
      weeklyMinSessions: Number(r.weeklyMinSessions ?? r.weekly_min_sessions ?? 0),
      specialCareTherapistOnly: Boolean(r.specialCareTherapistOnly ?? r.special_care_therapist_only),
    }
  }

  const dementiaRoleOfferings = asArr(o.dementiaRoleOfferings ?? o.dementia_role_offerings).map((x, i) => {
    if (typeof x !== 'object' || !x) {
      errors.push(err('BAD_DEM_ROLE', `dementiaRoleOfferings[${i}]`))
      return null
    }
    const r = x as Record<string, unknown>
    const roleType = String(r.roleType ?? r.role_type ?? '')
    const slotVariant = String(r.slotVariant ?? r.slot_variant ?? '')
    if (!ROLE_TYPES_DEM.has(roleType)) errors.push(err('BAD_ROLE', `dementiaRoleOfferings[${i}].roleType`))
    if (!SLOT_VARIANTS.has(slotVariant)) errors.push(err('BAD_VARIANT', `dementiaRoleOfferings[${i}].slotVariant`))
    return { roleType, slotVariant, enabled: Boolean(r.enabled) }
  })

  return {
    nonTherapySlots: nonTherapySlots.filter(Boolean) as SchedulingPolicyBundle['nonTherapySlots'],
    numericLimits,
    fixedActivities: fixedActivities.filter(Boolean) as SchedulingPolicyBundle['fixedActivities'],
    subsidizedTiers: subsidizedTiers.filter(Boolean) as SchedulingPolicyBundle['subsidizedTiers'],
    subsidizedRoleOfferings: subsidizedRoleOfferings.filter(Boolean) as SchedulingPolicyBundle['subsidizedRoleOfferings'],
    subsidizedPassOrder,
    dementiaCore,
    dementiaRoleOfferings: dementiaRoleOfferings.filter(Boolean) as SchedulingPolicyBundle['dementiaRoleOfferings'],
  }
}
