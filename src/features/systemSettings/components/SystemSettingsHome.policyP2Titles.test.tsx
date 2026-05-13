/** @vitest-environment happy-dom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingPolicyRepository } from '../../../repositories/schedulingPolicyRepository'
import { SystemSettingsHome } from './SystemSettingsHome'

vi.mock('../../auth', () => ({
  useAuth: () => ({ user: { id: 'vitest-actor' } }),
}))

vi.mock('../../shared/hooks/useAuditTrailList', () => ({
  useAuditTrailList: () => [],
}))

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
  getSupabaseBrowserCredentials: () => ({
    supabaseUrl: 'https://stub.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.stub-for-policy-p2-titles-test',
  }),
}))

vi.mock('../systemSettingsExternalStore', () => ({
  bumpSystemSettingsExternalVersion: vi.fn(),
}))

afterEach(() => {
  cleanup()
})

describe('SystemSettingsHome P2 標題（edgeEnabled mock）', () => {
  it('雲端政策 P2 小節 h3 可見', async () => {
    vi.mocked(mockRepo.getCurrentBundle).mockResolvedValue(null)
    vi.mocked(mockRepo.listPolicyVersionSummaries).mockResolvedValue([])
    render(<SystemSettingsHome />)

    const titles = [
      '固定活動（雲端政策 P2）',
      '資助復康三列（雲端政策 P2）',
      '資助職類矩陣（雲端政策 P2）',
      '資助 Pass 優先次序（雲端政策 P2）',
      '認知障礙症政策（雲端政策 P2）',
    ] as const

    for (const name of titles) {
      const el = await screen.findByRole('heading', { level: 3, name })
      expect(el.tagName.toLowerCase()).toBe('h3')
    }
    expect(mockRepo.getCurrentBundle).toHaveBeenCalled()
  })
})
