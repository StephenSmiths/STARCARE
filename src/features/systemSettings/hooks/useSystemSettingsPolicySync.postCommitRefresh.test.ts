/** @vitest-environment happy-dom */
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingPolicyRepository } from '../../../repositories/schedulingPolicyRepository'
import {
  minimalSchedulingPolicyBundle,
} from '../../../repositories/schedulingPolicyRepository.fixtures'
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

describe('useSystemSettingsPolicySync post-commit refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
    vi.mocked(mockRepo.validateBundle).mockResolvedValue({
      ok: true,
      errors: [],
      normalized: minimalSchedulingPolicyBundle,
    })
    vi.mocked(mockRepo.commitBundle).mockResolvedValue({
      ok: true,
      policyVersionId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    })
  })

  it('提交成功後靜默刷新失敗時，成功訊息補述並保留 loadError', async () => {
    vi.mocked(mockRepo.getCurrentBundle)
      .mockResolvedValueOnce(minimalSchedulingPolicyBundle)
      .mockRejectedValueOnce(new Error('重新整理失敗'))
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([])

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: vi.fn() }),
    )
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))

    await act(async () => {
      await result.current.submitPolicyVersion({
        effectiveFromLocal: '2030-06-15T14:00',
        changeSummary: '調整午休',
        confirmed: true,
      })
    })

    expect(vi.mocked(bumpSystemSettingsExternalVersion)).toHaveBeenCalledTimes(1)
    expect(result.current.submitMessage).toMatch(/重新載入雲端政策/)
    expect(result.current.loadError).toBeTruthy()
  })
})
