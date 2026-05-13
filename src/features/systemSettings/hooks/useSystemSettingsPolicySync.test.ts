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
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: hydrate }),
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
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: hydrate }),
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

  it('並行載入失敗時設定 loadError、結束 loading、不 hydrate', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
    vi.mocked(mockRepo.getCurrentBundle).mockRejectedValue(new Error('載入院舍政策失敗（HTTP 502）'))
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([])

    const hydrate = vi.fn()
    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: hydrate }),
    )

    expect(result.current.edgeEnabled).toBe(true)
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))
    expect(result.current.loadError).toBe('Error: 載入院舍政策失敗（HTTP 502）')
    expect(hydrate).not.toHaveBeenCalled()
    expect(result.current.policyVersions).toEqual([])
    expect(result.current.currentPolicyVersion).toBeNull()
  })

  it('版本列載入失敗時 Promise.all 失敗並設定 loadError', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
    vi.mocked(mockRepo.getCurrentBundle).mockResolvedValue(minimalSchedulingPolicyBundle)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockRejectedValue(
      new Error('載入政策版本列表失敗（HTTP 500）'),
    )

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: vi.fn() }),
    )

    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))
    expect(result.current.loadError).toBe('Error: 載入政策版本列表失敗（HTTP 500）')
  })

  it('未勾選確認時不呼叫 validate／commit', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
    vi.mocked(mockRepo.getCurrentBundle).mockResolvedValue(minimalSchedulingPolicyBundle)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([])

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: vi.fn() }),
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

    expect(mockRepo.validateBundle).toHaveBeenCalledTimes(1)
    expect(mockRepo.commitBundle).toHaveBeenCalledTimes(1)
    expect(vi.mocked(bumpSystemSettingsExternalVersion)).toHaveBeenCalledTimes(1)
    expect(mockRepo.getCurrentBundle).toHaveBeenCalledTimes(2)
    expect(mockRepo.listPolicyVersionSummaries).toHaveBeenCalledTimes(2)
    expect(result.current.submitMessage).toContain('已建立政策版本')
  })

  it('validate 通過但 commit 回 errors 時寫入 validateErrors（HTTP 400 與 validate 同形）', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://x.supabase.co',
      anonKey: 'anon',
    })
    vi.mocked(mockRepo.getCurrentBundle).mockResolvedValue(minimalSchedulingPolicyBundle)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([])
    vi.mocked(mockRepo.commitBundle).mockResolvedValue({
      ok: false,
      errors: [{ code: 'BAD_TIER_COUNT', message: 'subsidizedTiers 須恰好 3 筆或留空' }],
    })

    const { result } = renderHook(() =>
      useSystemSettingsPolicySync({ draft: POLICY_SYNC_VALID_DRAFT, hydrateP1FromBundle: vi.fn() }),
    )
    await waitFor(() => expect(result.current.isPolicyLoading).toBe(false))

    await act(async () => {
      await result.current.submitPolicyVersion({
        effectiveFromLocal: '2030-06-15T14:00',
        changeSummary: '調整',
        confirmed: true,
      })
    })

    expect(mockRepo.validateBundle).toHaveBeenCalledTimes(1)
    expect(mockRepo.commitBundle).toHaveBeenCalledTimes(1)
    expect(result.current.validateErrors).toEqual([
      { code: 'BAD_TIER_COUNT', message: 'subsidizedTiers 須恰好 3 筆或留空' },
    ])
    expect(result.current.submitMessage).toBeNull()
    expect(vi.mocked(bumpSystemSettingsExternalVersion)).not.toHaveBeenCalled()
  })
})
