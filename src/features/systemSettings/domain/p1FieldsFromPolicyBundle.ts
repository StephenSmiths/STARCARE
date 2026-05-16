import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'
import { bundleFixedActivitiesToDraft } from './policyFixedActivityDraft'
import { bundlePassOrderToDraft } from './policyPassOrderDraft'
import { bundleTiersToDraft } from './policySubsidizedTierDraft'
import { bundleRoleOfferingsToDraft } from './policySubsidizedRoleOfferingDraft'
import { bundleDementiaCoreToDraft, bundleDementiaRoleOfferingsToDraft } from './policyDementiaDraft'
import { intervalsFromPolicyNonTherapySlots, shouldAttachSubsidizedRehabNonTherapyIntervalsFromPolicy } from './subsidizedRehabNonTherapyIntervals'
import { DEFAULT_SYSTEM_SETTINGS } from '../repository/systemSettingsRepository'
import { specialCareTherapistOnlyFromPolicyBundle } from './specialCareTherapistOnlyFromPolicy'
import type { SystemSettingsSnapshot } from '../types'

/** 自伺服器 bundle 還原本機草稿之 P1 欄位（其餘欄位保留 prev） */
export const p1FieldsFromPolicyBundle = (b: SchedulingPolicyBundle): Partial<SystemSettingsSnapshot> => {
  const lunch = b.nonTherapySlots.find((s) => s.slotKind === 'LUNCH')
  const prep = b.nonTherapySlots.some((s) => s.slotKind === 'SHIFT_PREP_BLOCK')
  const sortedIntervals = intervalsFromPolicyNonTherapySlots(b.nonTherapySlots ?? [])
  return {
    nonTherapyWindowStart: lunch?.timeStart ?? DEFAULT_SYSTEM_SETTINGS.nonTherapyWindowStart,
    nonTherapyWindowEnd: lunch?.timeEnd ?? DEFAULT_SYSTEM_SETTINGS.nonTherapyWindowEnd,
    ...(shouldAttachSubsidizedRehabNonTherapyIntervalsFromPolicy(b.nonTherapySlots)
      ? { subsidizedRehabNonTherapyIntervals: sortedIntervals }
      : {}),
    shiftPrepBlockEnabled: prep,
    therapistGroupSessionsDailyCap: b.numericLimits.therapistGroupSessionsDailyCap,
    assistantGroupSessionsDailyCap: b.numericLimits.assistantGroupSessionsDailyCap,
    groupParticipantCap: b.numericLimits.groupParticipantCap,
    specialCareTherapistOnly: specialCareTherapistOnlyFromPolicyBundle(b),
    policyFixedActivities: bundleFixedActivitiesToDraft(b.fixedActivities ?? []),
    policyFixedActivitiesHydrated: true,
    policySubsidizedPassOrder: bundlePassOrderToDraft(b.subsidizedPassOrder),
    policySubsidizedPassOrderHydrated: true,
    policySubsidizedTiers: bundleTiersToDraft(b.subsidizedTiers ?? []),
    policySubsidizedTiersHydrated: true,
    policySubsidizedRoleOfferings: bundleRoleOfferingsToDraft(b.subsidizedRoleOfferings ?? []),
    policySubsidizedRoleOfferingsHydrated: true,
    policyDementiaCore: bundleDementiaCoreToDraft(b.dementiaCore),
    policyDementiaCoreHydrated: true,
    policyDementiaRoleOfferings: bundleDementiaRoleOfferingsToDraft(b.dementiaRoleOfferings),
    policyDementiaRoleOfferingsHydrated: true,
  }
}
