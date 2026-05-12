import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import {
  createSchedulingPolicyRepository,
  EdgeSchedulingPolicyRepository,
  InMemorySchedulingPolicyRepository,
} from './schedulingPolicyRepository'

vi.mock('../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(),
}))

describe('createSchedulingPolicyRepository', () => {
  beforeEach(() => {
    vi.mocked(getSupabaseBrowserCredentials).mockReset()
  })

  it('無憑證時回 InMemorySchedulingPolicyRepository', () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue(null)
    const repo = createSchedulingPolicyRepository()
    expect(repo).toBeInstanceOf(InMemorySchedulingPolicyRepository)
  })

  it('有憑證時回 EdgeSchedulingPolicyRepository', () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    const repo = createSchedulingPolicyRepository()
    expect(repo).toBeInstanceOf(EdgeSchedulingPolicyRepository)
  })
})
