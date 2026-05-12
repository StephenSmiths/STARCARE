/** @vitest-environment happy-dom */
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingPolicyRepository } from '../../../repositories/schedulingPolicyRepository'
import {
  minimalSchedulingPolicyBundle,
  samplePolicyVersionSummary,
} from '../../../repositories/schedulingPolicyRepository.fixtures'
import { getSupabaseBrowserCredentials } from '../../../services/supabaseBrowserEnv'
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

describe('useSystemSettingsPolicySync reloadPolicy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
  })

  it('初次載入失敗後 reloadPolicy 成功則清除 loadError 並 hydrate', async () => {
    vi.mocked(mockRepo.getCurrentBundle)
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(minimalSchedulingPolicyBundle)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([samplePolicyVersionSummary])

    const hydrate = vi.fn()
    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: hydrate }),
    )
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))
    expect(result.current.loadError).toBeTruthy()

    await act(async () => {
      result.current.reloadPolicy()
    })
    await waitFor(() => expect(result.current.loadError).toBeNull())
    expect(hydrate).toHaveBeenCalledWith(minimalSchedulingPolicyBundle)
    expect(result.current.policyVersions).toEqual([samplePolicyVersionSummary])
    expect(mockRepo.getCurrentBundle).toHaveBeenCalledTimes(2)
  })
})
