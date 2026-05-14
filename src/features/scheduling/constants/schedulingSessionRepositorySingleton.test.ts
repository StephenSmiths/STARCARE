/** PDF 02【3】：排班可排時段全域 singleton（Seq 15；無 Supabase 時 InMemory 預設列）。 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('../../../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(() => null),
}))

import { schedulingSessionRepository } from './schedulingSessionRepositorySingleton'

describe('schedulingSessionRepositorySingleton', () => {
  it('listSessions 回傳預設示範時段（staffId 與種子對齊）', async () => {
    const rows = await schedulingSessionRepository.listSessions()
    expect(rows.length).toBeGreaterThanOrEqual(3)
    expect(rows.map((r) => r.id).sort()).toEqual(['session-1', 'session-2', 'session-3'].sort())
    expect(rows.find((r) => r.id === 'session-1')?.staffId).toBe('staff-ot-1')
  })
})
