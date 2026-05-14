import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SystemSettingsSnapshot } from '../features/systemSettings/types'
import type { SchedulingPolicyBundle } from '../repositories/schedulingPolicyTypes'
import { resolveSchedulingWindowSnapshot } from './schedulingWindowSnapshotService'

const localSnapshot: SystemSettingsSnapshot = {
  nonTherapyWindowStart: '12:00',
  nonTherapyWindowEnd: '13:00',
} as SystemSettingsSnapshot

const p1Patch: Partial<SystemSettingsSnapshot> = {
  nonTherapyWindowStart: '12:30',
  shiftPrepBlockEnabled: true,
}

vi.mock('../features/systemSettings/repository/systemSettingsRepository', () => ({
  loadSystemSettings: vi.fn(() => localSnapshot),
}))

vi.mock('./supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(),
}))

const getCurrentBundle = vi.fn()
vi.mock('../repositories/schedulingPolicyRepository', () => ({
  createSchedulingPolicyRepository: vi.fn(() => ({ getCurrentBundle })),
}))

vi.mock('../features/systemSettings/domain/p1FieldsFromPolicyBundle', () => ({
  p1FieldsFromPolicyBundle: vi.fn(() => p1Patch),
}))

import { loadSystemSettings } from '../features/systemSettings/repository/systemSettingsRepository'
import { getSupabaseBrowserCredentials } from './supabaseBrowserEnv'
import { p1FieldsFromPolicyBundle } from '../features/systemSettings/domain/p1FieldsFromPolicyBundle'

describe('resolveSchedulingWindowSnapshot', () => {
  beforeEach(() => {
    vi.mocked(loadSystemSettings).mockReturnValue(localSnapshot)
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue(null)
    getCurrentBundle.mockReset()
    vi.mocked(p1FieldsFromPolicyBundle).mockReturnValue(p1Patch)
  })

  it('無瀏覽器憑證時直接回落本機設定', async () => {
    await expect(resolveSchedulingWindowSnapshot('fac-1')).resolves.toBe(localSnapshot)
    expect(getCurrentBundle).not.toHaveBeenCalled()
  })

  it('有憑證但 getCurrentBundle 丟錯時仍回落本機', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({} as never)
    getCurrentBundle.mockRejectedValue(new Error('network'))
    await expect(resolveSchedulingWindowSnapshot('fac-1')).resolves.toBe(localSnapshot)
  })

  it('有憑證且 bundle 無 policyVersion 時回落本機', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({} as never)
    getCurrentBundle.mockResolvedValue({ policyVersion: null } as SchedulingPolicyBundle)
    await expect(resolveSchedulingWindowSnapshot('fac-1')).resolves.toBe(localSnapshot)
    expect(p1FieldsFromPolicyBundle).not.toHaveBeenCalled()
  })

  it('有憑證且存在 policyVersion 時合併 P1 欄位', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({} as never)
    getCurrentBundle.mockResolvedValue({
      policyVersion: { id: 'pv1' },
    } as SchedulingPolicyBundle)
    await expect(resolveSchedulingWindowSnapshot('fac-1')).resolves.toEqual({
      ...localSnapshot,
      ...p1Patch,
    })
    expect(p1FieldsFromPolicyBundle).toHaveBeenCalledTimes(1)
  })
})
