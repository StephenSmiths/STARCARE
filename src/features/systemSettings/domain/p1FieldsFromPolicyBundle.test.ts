import { describe, expect, it } from 'vitest'
import { minimalSchedulingPolicyBundle } from '../../../repositories/schedulingPolicyRepository.fixtures'
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
})
