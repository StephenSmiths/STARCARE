import { describe, expect, it } from 'vitest'
import { minimalSchedulingPolicyBundle } from '../../../repositories/schedulingPolicyRepository.fixtures'
import { DEFAULT_POLICY_SUBSIDIZED_PASS_ORDER } from './policyPassOrderDraft'
import { DEFAULT_POLICY_SUBSIDIZED_TIER_ROWS } from './policySubsidizedTierDraft'
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

const serverPass = [
  { sortOrder: 1, fundingTier: 'Private' as const },
  { sortOrder: 2, fundingTier: 'GradeA_Subsidized' as const },
  { sortOrder: 3, fundingTier: 'Voucher' as const },
]

const serverTiers = [
  {
    fundingTier: 'GradeA_Subsidized' as const,
    enabled: false,
    weeklyMinSessions: 3,
    specialCareTherapistOnly: true,
  },
  { fundingTier: 'Voucher' as const, enabled: true, weeklyMinSessions: 0, specialCareTherapistOnly: false },
  { fundingTier: 'Private' as const, enabled: true, weeklyMinSessions: 1, specialCareTherapistOnly: false },
]

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

  it('雲端已配置 Pass、未 hydrated、草稿空時保留雲端次序（P2）', () => {
    const base = { ...minimalSchedulingPolicyBundle, subsidizedPassOrder: serverPass }
    const draft = { ...POLICY_SYNC_VALID_DRAFT, policySubsidizedPassOrder: [] }
    const out = mergeP1DraftIntoPolicyBundle(draft, base, 'facility-main')
    expect(out.subsidizedPassOrder.map((p) => p.fundingTier)).toEqual(['Private', 'GradeA_Subsidized', 'Voucher'])
  })

  it('已 hydrated 時以草稿 Pass 次序覆寫（P2）', () => {
    const base = { ...minimalSchedulingPolicyBundle, subsidizedPassOrder: serverPass }
    const draft = {
      ...POLICY_SYNC_VALID_DRAFT,
      policySubsidizedPassOrder: [...DEFAULT_POLICY_SUBSIDIZED_PASS_ORDER],
      policySubsidizedPassOrderHydrated: true,
    }
    const out = mergeP1DraftIntoPolicyBundle(draft, base, 'facility-main')
    expect(out.subsidizedPassOrder[0]?.fundingTier).toBe('GradeA_Subsidized')
  })

  it('雲端資助三列、未 hydrated、草稿空時保留雲端（P2）', () => {
    const base = { ...minimalSchedulingPolicyBundle, subsidizedTiers: serverTiers }
    const draft = { ...POLICY_SYNC_VALID_DRAFT, policySubsidizedTiers: [] }
    const out = mergeP1DraftIntoPolicyBundle(draft, base, 'facility-main')
    const g = out.subsidizedTiers.find((t) => t.fundingTier === 'GradeA_Subsidized')
    expect(g?.weeklyMinSessions).toBe(3)
    expect(g?.enabled).toBe(false)
  })

  it('已 hydrated 時以草稿資助三列覆寫（P2）', () => {
    const base = { ...minimalSchedulingPolicyBundle, subsidizedTiers: serverTiers }
    const draft = {
      ...POLICY_SYNC_VALID_DRAFT,
      policySubsidizedTiers: [...DEFAULT_POLICY_SUBSIDIZED_TIER_ROWS],
      policySubsidizedTiersHydrated: true,
    }
    const out = mergeP1DraftIntoPolicyBundle(draft, base, 'facility-main')
    expect(out.subsidizedTiers.find((t) => t.fundingTier === 'GradeA_Subsidized')?.enabled).toBe(true)
  })
})
