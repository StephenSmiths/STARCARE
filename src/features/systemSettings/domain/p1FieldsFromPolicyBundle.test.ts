import { describe, expect, it } from 'vitest'
import { minimalSchedulingPolicyBundle } from '../../../repositories/schedulingPolicyRepository.fixtures'
import { DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS } from './policySubsidizedRoleOfferingDraft'
import { DEFAULT_POLICY_DEMENTIA_ROLE_OFFERINGS } from './policyDementiaDraft'
import { p1FieldsFromPolicyBundle } from './p1FieldsFromPolicyBundle'

describe('p1FieldsFromPolicyBundle', () => {
  it('併入固定活動列並標記 hydrated（P2）', () => {
    const b = {
      ...minimalSchedulingPolicyBundle,
      nonTherapySlots: [{ slotKind: 'LUNCH', timeStart: '12:30', timeEnd: '13:30' }],
      fixedActivities: [
        {
          serviceType: 'Subsidized_Rehab',
          timeStart: '09:00',
          timeEnd: '10:00',
          deliveryMode: 'Group',
          activityName: '早操',
          rolePt: true,
          rolePta: false,
          roleOt: false,
          roleOta: false,
        },
      ],
    }
    const p = p1FieldsFromPolicyBundle(b)
    expect(p.policyFixedActivitiesHydrated).toBe(true)
    expect(p.policyFixedActivities).toHaveLength(1)
    expect(p.policyFixedActivities?.[0]?.activityName).toBe('早操')
  })

  it('併入 Pass 次序並標記 hydrated（P2）', () => {
    const b = {
      ...minimalSchedulingPolicyBundle,
      nonTherapySlots: [],
      subsidizedPassOrder: [
        { sortOrder: 1, fundingTier: 'Voucher' as const },
        { sortOrder: 2, fundingTier: 'Private' as const },
        { sortOrder: 3, fundingTier: 'GradeA_Subsidized' as const },
      ],
    }
    const p = p1FieldsFromPolicyBundle(b)
    expect(p.policySubsidizedPassOrderHydrated).toBe(true)
    expect(p.policySubsidizedPassOrder?.map((x) => x.fundingTier)).toEqual(['Voucher', 'Private', 'GradeA_Subsidized'])
  })

  it('併入資助三列並標記 hydrated（P2）', () => {
    const b = {
      ...minimalSchedulingPolicyBundle,
      nonTherapySlots: [],
      subsidizedTiers: [
        { fundingTier: 'GradeA_Subsidized' as const, enabled: true, weeklyMinSessions: 0, specialCareTherapistOnly: false },
        { fundingTier: 'Voucher' as const, enabled: true, weeklyMinSessions: 5, specialCareTherapistOnly: false },
        { fundingTier: 'Private' as const, enabled: false, weeklyMinSessions: 2, specialCareTherapistOnly: true },
      ],
    }
    const p = p1FieldsFromPolicyBundle(b)
    expect(p.policySubsidizedTiersHydrated).toBe(true)
    expect(p.policySubsidizedTiers?.find((x) => x.fundingTier === 'Voucher')?.weeklyMinSessions).toBe(5)
  })

  it('併入職類矩陣並標記 hydrated（P2）', () => {
    const customRoles = DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS.map((r) =>
      r.fundingTier === 'Private' && r.roleType === 'OTA' && r.slotVariant === 'IND_30' ? { ...r, enabled: true } : r,
    )
    const b = {
      ...minimalSchedulingPolicyBundle,
      nonTherapySlots: [],
      subsidizedRoleOfferings: customRoles,
    }
    const p = p1FieldsFromPolicyBundle(b)
    expect(p.policySubsidizedRoleOfferingsHydrated).toBe(true)
    expect(
      p.policySubsidizedRoleOfferings?.find(
        (x) => x.fundingTier === 'Private' && x.roleType === 'OTA' && x.slotVariant === 'IND_30',
      )?.enabled,
    ).toBe(true)
  })

  it('併入認知障礙症核心與職類格並標記 hydrated（P2）', () => {
    const customDem = DEFAULT_POLICY_DEMENTIA_ROLE_OFFERINGS.map((r) =>
      r.roleType === 'OT' && r.slotVariant === 'IND_15' ? { ...r, enabled: true } : r,
    )
    const b = {
      ...minimalSchedulingPolicyBundle,
      nonTherapySlots: [],
      dementiaCore: { enabled: true, weeklyMinSessions: 3, specialCareTherapistOnly: true },
      dementiaRoleOfferings: customDem,
    }
    const p = p1FieldsFromPolicyBundle(b)
    expect(p.policyDementiaCoreHydrated).toBe(true)
    expect(p.policyDementiaRoleOfferingsHydrated).toBe(true)
    expect(p.policyDementiaCore?.weeklyMinSessions).toBe(3)
    expect(p.policyDementiaRoleOfferings?.find((x) => x.roleType === 'OT' && x.slotVariant === 'IND_15')?.enabled).toBe(
      true,
    )
  })

  it('多段 nonTherapySlots 還原為 subsidizedRehabNonTherapyIntervals（依開始時間排序）', () => {
    const b = {
      ...minimalSchedulingPolicyBundle,
      nonTherapySlots: [
        { slotKind: 'LUNCH', timeStart: '12:00', timeEnd: '13:00' },
        { slotKind: 'MORNING_DOC', timeStart: '10:00', timeEnd: '10:30' },
        { slotKind: 'SHIFT_PREP_BLOCK', timeStart: '07:00', timeEnd: '07:30' },
      ],
    }
    const p = p1FieldsFromPolicyBundle(b)
    expect(p.nonTherapyWindowStart).toBe('12:00')
    expect(p.nonTherapyWindowEnd).toBe('13:00')
    expect(p.shiftPrepBlockEnabled).toBe(true)
    expect(p.subsidizedRehabNonTherapyIntervals?.map((x) => `${x.timeStart}-${x.timeEnd}`)).toEqual([
      '07:00-07:30',
      '10:00-10:30',
      '12:00-13:00',
    ])
  })
})
