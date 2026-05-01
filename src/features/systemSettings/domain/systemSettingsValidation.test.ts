import { describe, expect, it } from 'vitest'
import { hmLessThan, isValidHm, validateSystemSettings } from './systemSettingsValidation'
import type { SystemSettingsSnapshot } from '../types'

const base = (): SystemSettingsSnapshot => ({
  schedulingWindowStart: '07:00',
  schedulingWindowEnd: '22:00',
  nonTherapyWindowStart: '12:00',
  nonTherapyWindowEnd: '14:00',
  rulesEngineEnabled: true,
  fixedActivitiesEnabled: true,
  serviceTypesEnabled: true,
  specialCareTherapistOnly: false,
})

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

  it('validateSystemSettings：區間須開始早於結束', () => {
    const bad = { ...base(), schedulingWindowStart: '22:00', schedulingWindowEnd: '07:00' }
    const r = validateSystemSettings(bad)
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.includes('排班開始'))).toBe(true)
  })

  it('validateSystemSettings：合法快照通過', () => {
    expect(validateSystemSettings(base()).ok).toBe(true)
  })
})
