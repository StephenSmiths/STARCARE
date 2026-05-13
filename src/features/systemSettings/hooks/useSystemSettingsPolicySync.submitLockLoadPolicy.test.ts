/** @vitest-environment happy-dom */
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingPolicyRepository } from '../../../repositories/schedulingPolicyRepository'
import { minimalSchedulingPolicyBundle } from '../../../repositories/schedulingPolicyRepository.fixtures'
import { getSupabaseBrowserCredentials } from '../../../services/supabaseBrowserEnv'
import { bumpSystemSettingsExternalVersion } from '../systemSettingsExternalStore'
import { POLICY_SYNC_VALID_DRAFT } from './policySyncTestDraft'
import { useSystemSettingsPolicySync } from './useSystemSettingsPolicySync'

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

describe('useSystemSettingsPolicySync submit lock vs loadPolicy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
    vi.mocked(mockRepo.getCurrentBundle).mockResolvedValue(minimalSchedulingPolicyBundle)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([])
    vi.mocked(mockRepo.validateBundle).mockResolvedValue({
      ok: true,
      errors: [],
      normalized: minimalSchedulingPolicyBundle,
    })
  })

  it('提交鎖期間 reloadPolicy 不觸發額外 getCurrentBundle', async () => {
    let resolveCommit!: (v: { ok: true; policyVersionId: string }) => void
    const commitPending = new Promise<{ ok: true; policyVersionId: string }>((r) => {
      resolveCommit = r
    })
    vi.mocked(mockRepo.commitBundle).mockReturnValue(commitPending)

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: vi.fn() }),
    )
    await waitFor(() =>
      expect(result.current.currentPolicyVersion).toEqual(minimalSchedulingPolicyBundle.policyVersion),
    )
    expect(mockRepo.getCurrentBundle).toHaveBeenCalledTimes(1)

    act(() => {
      void result.current.submitPolicyVersion({
        effectiveFromLocal: '2030-06-15T14:00',
        changeSummary: '調整',
        confirmed: true,
      })
    })

    await waitFor(() => expect(result.current.isSubmitting).toBe(true))
    expect(mockRepo.commitBundle).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.reloadPolicy()
    })
    expect(mockRepo.getCurrentBundle).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveCommit({ ok: true, policyVersionId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' })
    })
    await waitFor(() => expect(result.current.isSubmitting).toBe(false))
    expect(mockRepo.getCurrentBundle).toHaveBeenCalledTimes(2)
    expect(vi.mocked(bumpSystemSettingsExternalVersion)).toHaveBeenCalledTimes(1)
  })
})
