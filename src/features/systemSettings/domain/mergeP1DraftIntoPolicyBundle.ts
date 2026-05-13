import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'
import { draftFixedActivitiesToBundle } from './policyFixedActivityDraft'
import { bundlePassOrderToDraft, draftPassOrderToBundle } from './policyPassOrderDraft'
import { draftTiersToBundle } from './policySubsidizedTierDraft'
import { draftRoleOfferingsToBundle } from './policySubsidizedRoleOfferingDraft'
import { draftDementiaCoreToBundle, draftDementiaRoleOfferingsToBundle } from './policyDementiaDraft'
import { PRESERVED_NON_THERAPY_SLOT_KINDS } from './subsidizedRehabNonTherapyIntervals'
import type { SystemSettingsSnapshot } from '../types'
import { shiftPrepSlotTimes } from './shiftPrepWindow'

/** 雲端 bundle 之 Pass 次序；不足或無效時回預設（與 `policyPassOrderDraft` 一致） */
const passOrderFromBaseBundle = (base: SchedulingPolicyBundle | null): SchedulingPolicyBundle['subsidizedPassOrder'] =>
  bundlePassOrderToDraft(base?.subsidizedPassOrder)

const mergedSubsidizedPassOrder = (
  draft: SystemSettingsSnapshot,
  base: SchedulingPolicyBundle | null,
): SchedulingPolicyBundle['subsidizedPassOrder'] => {
  if (draft.policySubsidizedPassOrderHydrated === true || !base) {
    return draftPassOrderToBundle(draft.policySubsidizedPassOrder)
  }
  return passOrderFromBaseBundle(base)
}

const mergedFixedActivities = (
  draft: SystemSettingsSnapshot,
  base: SchedulingPolicyBundle | null,
): SchedulingPolicyBundle['fixedActivities'] => {
  if (draft.policyFixedActivitiesHydrated === true || !base) {
    return draftFixedActivitiesToBundle(draft.policyFixedActivities)
  }
  return base.fixedActivities ?? []
}

const mergedSubsidizedTiers = (
  draft: SystemSettingsSnapshot,
  base: SchedulingPolicyBundle | null,
): SchedulingPolicyBundle['subsidizedTiers'] => {
  if (draft.policySubsidizedTiersHydrated === true || !base) {
    return draftTiersToBundle(draft.policySubsidizedTiers)
  }
  return base.subsidizedTiers ?? []
}

const mergedSubsidizedRoleOfferings = (
  draft: SystemSettingsSnapshot,
  base: SchedulingPolicyBundle | null,
): SchedulingPolicyBundle['subsidizedRoleOfferings'] => {
  if (draft.policySubsidizedRoleOfferingsHydrated === true || !base) {
    return draftRoleOfferingsToBundle(draft.policySubsidizedRoleOfferings)
  }
  return base.subsidizedRoleOfferings ?? []
}

const mergedDementiaCore = (
  draft: SystemSettingsSnapshot,
  base: SchedulingPolicyBundle | null,
): SchedulingPolicyBundle['dementiaCore'] => {
  if (draft.policyDementiaCoreHydrated === true || !base) {
    return draftDementiaCoreToBundle(draft.policyDementiaCore)
  }
  return base.dementiaCore ?? null
}

const mergedDementiaRoleOfferings = (
  draft: SystemSettingsSnapshot,
  base: SchedulingPolicyBundle | null,
): SchedulingPolicyBundle['dementiaRoleOfferings'] => {
  if (draft.policyDementiaRoleOfferingsHydrated === true || !base) {
    return draftDementiaRoleOfferingsToBundle(draft.policyDementiaRoleOfferings)
  }
  return base.dementiaRoleOfferings ?? []
}

/** 以目前 bundle 為底，覆寫 P1（非治療時段、開工準備、數字上限）；P2 固定活動見 `mergedFixedActivities`；P2 Pass 次序見 `mergedSubsidizedPassOrder`；P2 資助三列見 `mergedSubsidizedTiers`；P2 職類矩陣見 `mergedSubsidizedRoleOfferings`；P2 認知障礙症見 `mergedDementiaCore`／`mergedDementiaRoleOfferings` */
export const mergeP1DraftIntoPolicyBundle = (
  draft: SystemSettingsSnapshot,
  base: SchedulingPolicyBundle | null,
  facilityId: string,
): SchedulingPolicyBundle => {
  const slotsFromDraft: SchedulingPolicyBundle['nonTherapySlots'] = [
    { slotKind: 'LUNCH', timeStart: draft.nonTherapyWindowStart.trim(), timeEnd: draft.nonTherapyWindowEnd.trim() },
  ]
  if (draft.shiftPrepBlockEnabled) {
    const { timeStart, timeEnd } = shiftPrepSlotTimes(draft.schedulingWindowStart, draft.schedulingWindowEnd)
    slotsFromDraft.push({ slotKind: 'SHIFT_PREP_BLOCK', timeStart, timeEnd })
  }
  const preservedSlots = (base?.nonTherapySlots ?? []).filter((row) =>
    PRESERVED_NON_THERAPY_SLOT_KINDS.has(String(row.slotKind)),
  )
  const nonTherapySlots: SchedulingPolicyBundle['nonTherapySlots'] = [...slotsFromDraft, ...preservedSlots]
  const numericLimits = {
    therapistGroupSessionsDailyCap: draft.therapistGroupSessionsDailyCap,
    assistantGroupSessionsDailyCap: draft.assistantGroupSessionsDailyCap,
    groupParticipantCap: draft.groupParticipantCap,
  }
  if (base) {
    return {
      ...base,
      facilityId,
      nonTherapySlots,
      numericLimits,
      subsidizedPassOrder: mergedSubsidizedPassOrder(draft, base),
      fixedActivities: mergedFixedActivities(draft, base),
      subsidizedTiers: mergedSubsidizedTiers(draft, base),
      subsidizedRoleOfferings: mergedSubsidizedRoleOfferings(draft, base),
      dementiaCore: mergedDementiaCore(draft, base),
      dementiaRoleOfferings: mergedDementiaRoleOfferings(draft, base),
    }
  }
  return {
    facilityId,
    policyVersion: null,
    nonTherapySlots,
    numericLimits,
    fixedActivities: mergedFixedActivities(draft, null),
    subsidizedTiers: mergedSubsidizedTiers(draft, null),
    subsidizedRoleOfferings: mergedSubsidizedRoleOfferings(draft, null),
    subsidizedPassOrder: mergedSubsidizedPassOrder(draft, null),
    dementiaCore: mergedDementiaCore(draft, null),
    dementiaRoleOfferings: mergedDementiaRoleOfferings(draft, null),
    legacySchedulingRules: null,
  }
}

/** Edge validate／commit 請求體（camelCase） */
export const bundleToPolicyCommitBody = (
  bundle: SchedulingPolicyBundle,
  params: { effectiveFromIso: string; changeSummary: string; confirmToken?: string },
): Record<string, unknown> => ({
  facilityId: bundle.facilityId,
  effectiveFrom: params.effectiveFromIso,
  changeSummary: params.changeSummary,
  confirmToken: params.confirmToken,
  nonTherapySlots: bundle.nonTherapySlots,
  numericLimits: bundle.numericLimits,
  fixedActivities: bundle.fixedActivities,
  subsidizedTiers: bundle.subsidizedTiers,
  subsidizedRoleOfferings: bundle.subsidizedRoleOfferings,
  subsidizedPassOrder: bundle.subsidizedPassOrder,
  dementiaCore: bundle.dementiaCore,
  dementiaRoleOfferings: bundle.dementiaRoleOfferings,
})
