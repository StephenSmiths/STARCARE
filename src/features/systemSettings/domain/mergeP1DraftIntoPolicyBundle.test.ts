import { describe, expect, it } from 'vitest'
import { minimalSchedulingPolicyBundle } from '../../../repositories/schedulingPolicyRepository.fixtures'
import { POLICY_SYNC_VALID_DRAFT } from '../hooks/policySyncTestDraft'
import { mergeP1DraftIntoPolicyBundle } from './mergeP1DraftIntoPolicyBundle'

const serverFixed = {
  serviceType: 'Subsidized_Rehab',
  timeStart: '14:00',
  timeEnd: '15:00',
  deliveryMode: 'Individual',
  activityName: 'server',
  rolePt: false,
  rolePta: true,
  roleOt: false,
  roleOta: false,
}

describe('mergeP1DraftIntoPolicyBundle', () => {
  it('已 hydrated 時以草稿覆寫固定活動（P2）', () => {
    const base = { ...minimalSchedulingPolicyBundle, fixedActivities: [serverFixed] }
    const draft = {
      ...POLICY_SYNC_VALID_DRAFT,
      policyFixedActivities: [
        {
          serviceType: 'Dementia_Care',
          timeStart: '10:00',
          timeEnd: '11:00',
          deliveryMode: 'Group',
          activityName: 'client',
          rolePt: true,
          rolePta: false,
          roleOt: false,
          roleOta: false,
        },
      ],
      policyFixedActivitiesHydrated: true,
    }
    const out = mergeP1DraftIntoPolicyBundle(draft, base, 'facility-main')
    expect(out.fixedActivities).toHaveLength(1)
    expect(out.fixedActivities[0]?.activityName).toBe('client')
  })

  it('雲端有列、未 hydrated、草稿空陣列時保留雲端（舊 localStorage）', () => {
    const base = { ...minimalSchedulingPolicyBundle, fixedActivities: [serverFixed] }
    const draft = { ...POLICY_SYNC_VALID_DRAFT, policyFixedActivities: [] }
    const out = mergeP1DraftIntoPolicyBundle(draft, base, 'facility-main')
    expect(out.fixedActivities).toHaveLength(1)
    expect(out.fixedActivities[0]?.activityName).toBe('server')
  })
})
