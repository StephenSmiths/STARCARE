/** PDF 02【3】：可排時段 Repository 工廠與記憶體倉（Seq 15；與排班畫面載入鏈一致）。 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(),
}))

vi.mock('./edgeFunctionHeaders', () => ({
  buildEdgeInvokeHeaders: vi.fn(),
}))

import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import {
  createSchedulingSessionRepository,
  EdgeSchedulingSessionRepository,
  InMemorySchedulingSessionRepository,
} from './schedulingSessionRepository'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

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

describe('EdgeSchedulingSessionRepository', () => {
  it('listSessions 透過 Edge GET 回傳 JSON 列', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({
      Authorization: 'Bearer t',
      apikey: 'anon',
      'Content-Type': 'application/json',
    })
    const edgeRow = {
      id: 'edge-1',
      staffId: 'staff-1',
      staffName: 'OT',
      date: '2026-05-01',
      timeSlot: '09:00-10:00',
      serviceType: 'Subsidized_Rehab' as const,
      capacity: 2,
      staffRoleType: 'OT' as const,
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue([edgeRow]),
      }),
    )
    const repo = new EdgeSchedulingSessionRepository({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    const rows = await repo.listSessions()
    expect(rows).toEqual([edgeRow])
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'https://proj.supabase.co/functions/v1/scheduling-sessions-list',
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })
})
