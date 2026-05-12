/** @vitest-environment happy-dom */
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingPolicyRepository } from '../../../repositories/schedulingPolicyRepository'
import {
  minimalSchedulingPolicyBundle,
  samplePolicyVersionSummary,
} from '../../../repositories/schedulingPolicyRepository.fixtures'
import { getSupabaseBrowserCredentials } from '../../../services/supabaseBrowserEnv'
import { bumpSystemSettingsExternalVersion } from '../systemSettingsExternalStore'
import type { SystemSettingsSnapshot } from '../types'
import { useSystemSettingsPolicySync } from './useSystemSettingsPolicySync'

const validDraft: SystemSettingsSnapshot = {
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

const { mockRepo, createRepoMock } = vi.hoisted(() => {
  const r = {
    getCurrentBundle: vi.fn(),
    listPolicyVersionSummaries: vi.fn(),
    validateBundle: vi.fn(),
    commitBundle: vi.fn(),
  }
  return {
    mockRepo: r as unknown as SchedulingPolicyRepository,
    createRepoMock: vi.fn(() => r as unknown as SchedulingPolicyRepository),
  }
})

vi.mock('../../../repositories/schedulingPolicyRepository', () => ({
  createSchedulingPolicyRepository: createRepoMock,
}))

vi.mock('../../../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(),
}))

vi.mock('../systemSettingsExternalStore', () => ({
  bumpSystemSettingsExternalVersion: vi.fn(),
}))

describe('useSystemSettingsPolicySync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue(null)
    vi.mocked(mockRepo.getCurrentBundle).mockResolvedValue(null)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([])
    vi.mocked(mockRepo.validateBundle).mockResolvedValue({
      ok: true,
      errors: [],
      normalized: minimalSchedulingPolicyBundle,
    })
    vi.mocked(mockRepo.commitBundle).mockResolvedValue({
      ok: true,
      policyVersionId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    })
  })

  it('無 Supabase 憑證時不觸發載入、edgeEnabled 為 false', async () => {
    const hydrate = vi.fn()
    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: validDraft, hydrateP1FromBundle: hydrate }),
    )

    expect(result.current.edgeEnabled).toBe(false)
    expect(result.current.isPolicyLoading).toBe(false)
    await act(async () => {
      await Promise.resolve()
    })
    expect(mockRepo.getCurrentBundle).not.toHaveBeenCalled()
    expect(hydrate).not.toHaveBeenCalled()
  })

  it('有憑證時並行載入 bundle 與版本列並 hydrate', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
    vi.mocked(mockRepo.getCurrentBundle).mockResolvedValue(minimalSchedulingPolicyBundle)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([samplePolicyVersionSummary])

    const hydrate = vi.fn()
    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: validDraft, hydrateP1FromBundle: hydrate }),
    )

    expect(result.current.edgeEnabled).toBe(true)
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))
    expect(mockRepo.getCurrentBundle).toHaveBeenCalled()
    expect(mockRepo.listPolicyVersionSummaries).toHaveBeenCalled()
    expect(hydrate).toHaveBeenCalledWith(minimalSchedulingPolicyBundle)
    expect(result.current.policyVersions).toEqual([samplePolicyVersionSummary])
    expect(result.current.currentPolicyVersion).toEqual(samplePolicyVersionSummary)
    expect(result.current.loadError).toBeNull()
  })

  it('未勾選確認時不呼叫 validate／commit', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
    vi.mocked(mockRepo.getCurrentBundle).mockResolvedValue(minimalSchedulingPolicyBundle)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([])

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: validDraft, hydrateP1FromBundle: vi.fn() }),
    )
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))

    await act(async () => {
      await result.current.submitPolicyVersion({
        effectiveFromLocal: '2030-01-01T10:00',
        changeSummary: '原因',
        confirmed: false,
      })
    })

    expect(result.current.submitMessage).toBe('請勾選「已確認變更」')
    expect(mockRepo.validateBundle).not.toHaveBeenCalled()
    expect(mockRepo.commitBundle).not.toHaveBeenCalled()
  })

  it('驗證與提交成功後刷新資料並 bump 外部版本', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
    vi.mocked(mockRepo.getCurrentBundle).mockResolvedValue(minimalSchedulingPolicyBundle)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([samplePolicyVersionSummary])

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: validDraft, hydrateP1FromBundle: vi.fn() }),
    )
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))

    await act(async () => {
      await result.current.submitPolicyVersion({
        effectiveFromLocal: '2030-06-15T14:00',
        changeSummary: '調整午休',
        confirmed: true,
      })
    })

    expect(mockRepo.validateBundle).toHaveBeenCalledTimes(1)
    expect(mockRepo.commitBundle).toHaveBeenCalledTimes(1)
    expect(vi.mocked(bumpSystemSettingsExternalVersion)).toHaveBeenCalledTimes(1)
    expect(mockRepo.getCurrentBundle).toHaveBeenCalledTimes(2)
    expect(mockRepo.listPolicyVersionSummaries).toHaveBeenCalledTimes(2)
    expect(result.current.submitMessage).toContain('已建立政策版本')
  })
})
