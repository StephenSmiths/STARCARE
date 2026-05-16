import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'

/** 與 scheduling-rules-get 之 specialCareTherapistOnlyFromPolicy 語意對齊（P2 各列 OR） */
export const specialCareTherapistOnlyFromPolicyBundle = (bundle: SchedulingPolicyBundle): boolean => {
  const tiers = bundle.subsidizedTiers ?? []
  return tiers.some((t) => t.specialCareTherapistOnly) || Boolean(bundle.dementiaCore?.specialCareTherapistOnly)
}
