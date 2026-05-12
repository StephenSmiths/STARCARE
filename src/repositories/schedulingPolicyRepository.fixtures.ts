import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import type { SchedulingPolicyBundle, SchedulingPolicyVersionSummary } from './schedulingPolicyTypes'

/** Vitest 用：與 Edge 回應形狀一致之最小 bundle／摘要 */
export const samplePolicyVersionSummary: SchedulingPolicyVersionSummary = {
  id: 'pv-test-1',
  effectiveFrom: '2026-01-15T08:00:00.000Z',
  effectiveUntil: null,
  status: 'active',
  changeSummary: '午休調整',
  createdAt: '2026-01-14T10:00:00.000Z',
}

export const minimalSchedulingPolicyBundle: SchedulingPolicyBundle = {
  facilityId: STARCARE_DEFAULT_FACILITY_ID,
  policyVersion: samplePolicyVersionSummary,
  nonTherapySlots: [],
  numericLimits: {
    therapistGroupSessionsDailyCap: 4,
    assistantGroupSessionsDailyCap: 4,
    groupParticipantCap: 6,
  },
  fixedActivities: [],
  subsidizedTiers: [],
  subsidizedRoleOfferings: [],
  subsidizedPassOrder: [],
  dementiaCore: null,
  dementiaRoleOfferings: [],
  legacySchedulingRules: null,
}
