import { describe, expect, it } from 'vitest'
import { DEFAULT_POLICY_DEMENTIA_ROLE_OFFERINGS } from './policyDementiaDraft'
import { DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS } from './policySubsidizedRoleOfferingDraft'
import { hmLessThan, isValidHm, validateSystemSettings } from './systemSettingsValidation'
import type { SystemSettingsSnapshot } from '../types'
import { DEFAULT_SYSTEM_SETTINGS } from '../repository/systemSettingsRepository'

const base = (): SystemSettingsSnapshot => ({ ...DEFAULT_SYSTEM_SETTINGS })

describe('systemSettingsValidation', () => {
  it('isValidHm 接受 24h HH:mm', () => {
    expect(isValidHm('00:00')).toBe(true)
    expect(isValidHm('23:59')).toBe(true)
    expect(isValidHm('24:00')).toBe(false)
    expect(isValidHm('12:60')).toBe(false)
  })

  it('hmLessThan 可比較同日時段字串', () => {
    expect(hmLessThan('07:00', '22:00')).toBe(true)
    expect(hmLessThan('22:00', '07:00')).toBe(false)
  })

  it('validateSystemSettings：固定活動 serviceType 須合法', () => {
    const bad = {
      ...base(),
      policyFixedActivities: [
        {
          serviceType: 'Invalid',
          timeStart: '09:00',
          timeEnd: '10:00',
          deliveryMode: 'Group',
          activityName: '',
          rolePt: true,
          rolePta: false,
          roleOt: false,
          roleOta: false,
        },
      ],
    }
    const r = validateSystemSettings(bad)
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('固定活動'))).toBe(true)
  })

  it('validateSystemSettings：區間須開始早於結束', () => {
    const bad = { ...base(), schedulingWindowStart: '22:00', schedulingWindowEnd: '07:00' }
    const r = validateSystemSettings(bad)
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('排班開始'))).toBe(true)
  })

  it('validateSystemSettings：Pass 次序不完整時須報錯', () => {
    const bad = {
      ...base(),
      policySubsidizedPassOrder: [{ sortOrder: 1, fundingTier: 'GradeA_Subsidized' as const }],
    }
    const r = validateSystemSettings(bad)
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('Pass'))).toBe(true)
  })

  it('validateSystemSettings：資助三列不完整時須報錯', () => {
    const bad = {
      ...base(),
      policySubsidizedTiers: [
        { fundingTier: 'GradeA_Subsidized' as const, enabled: true, weeklyMinSessions: 0, specialCareTherapistOnly: false },
      ],
    }
    const r = validateSystemSettings(bad)
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('資助復康三列'))).toBe(true)
  })

  it('validateSystemSettings：職類矩陣不完整時須報錯', () => {
    const bad = {
      ...base(),
      policySubsidizedRoleOfferings: DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS.slice(0, 47),
    }
    const r = validateSystemSettings(bad)
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('職類矩陣'))).toBe(true)
  })

  it('validateSystemSettings：認知職類格不完整時須報錯', () => {
    const bad = {
      ...base(),
      policyDementiaRoleOfferings: DEFAULT_POLICY_DEMENTIA_ROLE_OFFERINGS.slice(0, 7),
    }
    const r = validateSystemSettings(bad)
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('認知障礙症職類格'))).toBe(true)
  })

  it('validateSystemSettings：認知核心 weekly 非整數時須報錯', () => {
    const bad = {
      ...base(),
      policyDementiaCore: { enabled: true, weeklyMinSessions: 1.5, specialCareTherapistOnly: false },
    }
    const r = validateSystemSettings(bad)
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('認知障礙症政策核心'))).toBe(true)
  })

  it('validateSystemSettings：合法快照通過', () => {
    expect(validateSystemSettings(base()).ok).toBe(true)
  })
})
