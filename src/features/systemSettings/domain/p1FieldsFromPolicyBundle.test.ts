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
})
