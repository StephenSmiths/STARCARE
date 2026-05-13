import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'
import { draftFixedActivitiesToBundle } from './policyFixedActivityDraft'
import type { SystemSettingsSnapshot } from '../types'
import { shiftPrepSlotTimes } from './shiftPrepWindow'

const DEFAULT_PASS: Array<{ sortOrder: number; fundingTier: string }> = [
  { sortOrder: 1, fundingTier: 'GradeA_Subsidized' },
  { sortOrder: 2, fundingTier: 'Voucher' },
  { sortOrder: 3, fundingTier: 'Private' },
]

const passOrderOrDefault = (base: SchedulingPolicyBundle | null): Array<{ sortOrder: number; fundingTier: string }> => {
  const p = base?.subsidizedPassOrder
  return p && p.length === 3 ? p : DEFAULT_PASS
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

/** 以目前 bundle 為底，覆寫 P1（非治療時段、開工準備、數字上限）；P2 固定活動列見 `mergedFixedActivities` */
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
      subsidizedPassOrder: passOrderOrDefault(base),
      fixedActivities: mergedFixedActivities(draft, base),
    }
  }
  return {
    facilityId,
    policyVersion: null,
    nonTherapySlots: slots,
    numericLimits,
    fixedActivities: mergedFixedActivities(draft, null),
    subsidizedTiers: [],
    subsidizedRoleOfferings: [],
    subsidizedPassOrder: DEFAULT_PASS,
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
