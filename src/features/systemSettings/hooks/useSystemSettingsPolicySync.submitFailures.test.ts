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

describe('useSystemSettingsPolicySync（提交失敗與例外）', () => {
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
    vi.mocked(mockRepo.commitBundle).mockResolvedValue({
      ok: true,
      policyVersionId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    })
  })

  it('validate 失敗時寫入 validateErrors、不呼叫 commit', async () => {
    vi.mocked(mockRepo.validateBundle).mockResolvedValue({
      ok: false,
      errors: [{ code: 'R_EFFECTIVE', message: '生效日無效' }],
    })

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: vi.fn() }),
    )
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))

    await act(async () => {
      await result.current.submitPolicyVersion({
        effectiveFromLocal: '2030-02-01T09:00',
        changeSummary: '測試',
        confirmed: true,
      })
    })

    expect(result.current.validateErrors).toEqual([{ code: 'R_EFFECTIVE', message: '生效日無效' }])
    expect(mockRepo.commitBundle).not.toHaveBeenCalled()
    expect(vi.mocked(bumpSystemSettingsExternalVersion)).not.toHaveBeenCalled()
    expect(mockRepo.getCurrentBundle).toHaveBeenCalledTimes(1)
  })

  it('commit 失敗且含 errors 時寫入 validateErrors', async () => {
    vi.mocked(mockRepo.commitBundle).mockResolvedValue({
      ok: false,
      errors: [{ code: 'R_OVERLAP', message: '區間重疊' }],
    })

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: vi.fn() }),
    )
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))

    await act(async () => {
      await result.current.submitPolicyVersion({
        effectiveFromLocal: '2030-03-01T11:00',
        changeSummary: '第二次',
        confirmed: true,
      })
    })

    expect(result.current.validateErrors).toEqual([{ code: 'R_OVERLAP', message: '區間重疊' }])
    expect(vi.mocked(bumpSystemSettingsExternalVersion)).not.toHaveBeenCalled()
    expect(mockRepo.getCurrentBundle).toHaveBeenCalledTimes(1)
  })

  it('commit 失敗僅 error 字串時寫入 submitMessage', async () => {
    vi.mocked(mockRepo.commitBundle).mockResolvedValue({ ok: false, error: 'idempotency 衝突' })

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: vi.fn() }),
    )
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))

    await act(async () => {
      await result.current.submitPolicyVersion({
        effectiveFromLocal: '2030-04-01T12:00',
        changeSummary: '第三次',
        confirmed: true,
      })
    })

    expect(result.current.submitMessage).toBe('idempotency 衝突')
    expect(result.current.validateErrors).toEqual([])
    expect(vi.mocked(bumpSystemSettingsExternalVersion)).not.toHaveBeenCalled()
  })

  it('validate 拋錯時寫入 submitMessage', async () => {
    vi.mocked(mockRepo.validateBundle).mockRejectedValue(new Error('連線逾時'))

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: vi.fn() }),
    )
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))

    await act(async () => {
      await result.current.submitPolicyVersion({
        effectiveFromLocal: '2030-05-01T13:00',
        changeSummary: '第四次',
        confirmed: true,
      })
    })

    expect(result.current.submitMessage).toBe('Error: 連線逾時')
    expect(vi.mocked(bumpSystemSettingsExternalVersion)).not.toHaveBeenCalled()
  })
})
