/** @vitest-environment happy-dom */
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadSystemSettings } from '../repository/systemSettingsRepository'
import { saveSystemSettingsWithAudit } from '../services/systemSettingsPersistService'
import type { SystemSettingsSnapshot } from '../types'
import { useSystemSettings } from './useSystemSettings'

const { validDraft } = vi.hoisted(() => {
  const d: SystemSettingsSnapshot = {
    schedulingWindowStart: '08:00',
    schedulingWindowEnd: '18:00',
    nonTherapyWindowStart: '12:00',
    nonTherapyWindowEnd: '13:00',
    shiftPrepBlockEnabled: false,
    therapistGroupSessionsDailyCap: 4,
    assistantGroupSessionsDailyCap: 4,
    groupParticipantCap: 6,
    rulesEngineEnabled: false,
    fixedActivitiesEnabled: false,
    serviceTypesEnabled: false,
    specialCareTherapistOnly: false,
  }
  return { validDraft: d }
})

vi.mock('../repository/systemSettingsRepository', () => ({
  loadSystemSettings: vi.fn(() => validDraft),
}))

vi.mock('../services/systemSettingsPersistService', () => ({
  saveSystemSettingsWithAudit: vi.fn(),
}))

describe('useSystemSettings（本機儲存 isSaving 可觀測）', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.mocked(loadSystemSettings).mockReturnValue(validDraft)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('驗證通過後：計時器跑完前 isSaving 為 true，完成後為 false 並寫入 savedMessage', () => {
    const { result } = renderHook(() => useSystemSettings('actor-1'))
    act(() => {
      result.current.save()
    })
    expect(result.current.isSaving).toBe(true)
    expect(saveSystemSettingsWithAudit).not.toHaveBeenCalled()
    act(() => {
      vi.runAllTimers()
    })
    expect(result.current.isSaving).toBe(false)
    expect(saveSystemSettingsWithAudit).toHaveBeenCalledWith('actor-1', validDraft)
    expect(result.current.savedMessage).toContain('已儲存')
  })

  it('驗證失敗時不排程儲存、isSaving 維持 false', () => {
    vi.mocked(loadSystemSettings).mockReturnValue({
      ...validDraft,
      schedulingWindowStart: 'xx',
    })
    const { result } = renderHook(() => useSystemSettings('actor-2'))
    act(() => {
      result.current.save()
    })
    expect(result.current.isSaving).toBe(false)
    expect(saveSystemSettingsWithAudit).not.toHaveBeenCalled()
    expect(result.current.validationErrors.length).toBeGreaterThan(0)
  })
})
