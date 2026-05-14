/** PDF 02【3】：可排時段 Repository 工廠與記憶體倉（Seq 15；與排班畫面載入鏈一致）。 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(),
}))

import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import {
  createSchedulingSessionRepository,
  InMemorySchedulingSessionRepository,
} from './schedulingSessionRepository'

describe('InMemorySchedulingSessionRepository', () => {
  it('listSessions 每次回傳新陣列與列物件（淺拷貝預設列）', async () => {
    const repo = new InMemorySchedulingSessionRepository()
    const a = await repo.listSessions()
    const b = await repo.listSessions()
    expect(a).not.toBe(b)
    expect(a[0]).not.toBe(b[0])
    expect(a).toEqual(b)
  })
})

describe('createSchedulingSessionRepository', () => {
  it('無 Supabase 憑證時回傳 InMemorySchedulingSessionRepository', () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue(null)
    const repo = createSchedulingSessionRepository()
    expect(repo).toBeInstanceOf(InMemorySchedulingSessionRepository)
  })
})
