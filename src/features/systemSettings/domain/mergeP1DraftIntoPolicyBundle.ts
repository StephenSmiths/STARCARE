import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'
import { draftFixedActivitiesToBundle } from './policyFixedActivityDraft'
import { bundlePassOrderToDraft, draftPassOrderToBundle } from './policyPassOrderDraft'
import { draftTiersToBundle } from './policySubsidizedTierDraft'
import { draftRoleOfferingsToBundle } from './policySubsidizedRoleOfferingDraft'
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

/** 以目前 bundle 為底，覆寫 P1（非治療時段、開工準備、數字上限）；P2 固定活動見 `mergedFixedActivities`；P2 Pass 次序見 `mergedSubsidizedPassOrder`；P2 資助三列見 `mergedSubsidizedTiers`；P2 職類矩陣見 `mergedSubsidizedRoleOfferings` */
export const mergeP1DraftIntoPolicyBundle = (
  draft: SystemSettingsSnapshot,
  base: SchedulingPolicyBundle | null,
  facilityId: string,
): SchedulingPolicyBundle => {
  const slots: SchedulingPolicyBundle['nonTherapySlots'] = [
    { slotKind: 'LUNCH', timeStart: draft.nonTherapyWindowStart.trim(), timeEnd: draft.nonTherapyWindowEnd.trim() },
  ]
  if (draft.shiftPrepBlockEnabled) {
    const { timeStart, timeEnd } = shiftPrepSlotTimes(draft.schedulingWindowStart, draft.schedulingWindowEnd)
    slots.push({ slotKind: 'SHIFT_PREP_BLOCK', timeStart, timeEnd })
  }
  const numericLimits = {
    therapistGroupSessionsDailyCap: draft.therapistGroupSessionsDailyCap,
    assistantGroupSessionsDailyCap: draft.assistantGroupSessionsDailyCap,
    groupParticipantCap: draft.groupParticipantCap,
  }
  if (base) {
    return {
      ...base,
      facilityId,
      nonTherapySlots: slots,
      numericLimits,
      subsidizedPassOrder: mergedSubsidizedPassOrder(draft, base),
      fixedActivities: mergedFixedActivities(draft, base),
      subsidizedTiers: mergedSubsidizedTiers(draft, base),
      subsidizedRoleOfferings: mergedSubsidizedRoleOfferings(draft, base),
    }
  }
  return {
    facilityId,
    policyVersion: null,
    nonTherapySlots: slots,
    numericLimits,
    fixedActivities: mergedFixedActivities(draft, null),
    subsidizedTiers: mergedSubsidizedTiers(draft, null),
    subsidizedRoleOfferings: mergedSubsidizedRoleOfferings(draft, null),
    subsidizedPassOrder: mergedSubsidizedPassOrder(draft, null),
    dementiaCore: null,
    dementiaRoleOfferings: [],
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
