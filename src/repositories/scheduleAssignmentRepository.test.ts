/** PDF 01 §5／Seq 15：`scheduling_history` 批量寫入與批次軟刪 Repository（Edge／本機）。 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(),
}))

vi.mock('./edgeFunctionHeaders', () => ({
  buildEdgeInvokeHeaders: vi.fn(),
}))

import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'
import type { ScheduleAssignmentRecord } from './scheduleAssignmentRepository'
import {
  createScheduleAssignmentRepository,
  EdgeScheduleAssignmentRepository,
  InMemoryScheduleAssignmentRepository,
} from './scheduleAssignmentRepository'

const sampleRow = (overrides: Partial<ScheduleAssignmentRecord> = {}): ScheduleAssignmentRecord => ({
  resident_id: 'r1',
  session_id: 's1',
  staff_id: 'st1',
  pass: 1,
  service_type: 'Subsidized_Rehab',
  actor_id: 'actor1',
  batch_id: 'batch-a',
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('InMemoryScheduleAssignmentRepository', () => {
  it('saveBatch 置頂寫入；softDeleteHistoryBatch 移除同 batch_id 列', async () => {
    const repo = new InMemoryScheduleAssignmentRepository()
    await repo.saveBatch([sampleRow({ batch_id: 'b1' }), sampleRow({ batch_id: 'b2', resident_id: 'r2' })])
    const store = (repo as unknown as { store: ScheduleAssignmentRecord[] }).store
    expect(store.map((r) => r.batch_id)).toEqual(['b1', 'b2'])
    await repo.softDeleteHistoryBatch('b1')
    expect(store.map((r) => r.batch_id)).toEqual(['b2'])
  })
})

describe('createScheduleAssignmentRepository', () => {
  it('無憑證時回傳 InMemoryScheduleAssignmentRepository', () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue(null)
    expect(createScheduleAssignmentRepository()).toBeInstanceOf(InMemoryScheduleAssignmentRepository)
  })

  it('有憑證時回傳 EdgeScheduleAssignmentRepository', () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    expect(createScheduleAssignmentRepository()).toBeInstanceOf(EdgeScheduleAssignmentRepository)
  })
})

describe('EdgeScheduleAssignmentRepository.saveBatch', () => {
  it('POST 成功時不拋錯且 body 帶 assignments', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({ h: '1' } as never)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      }),
    )
    const repo = new EdgeScheduleAssignmentRepository({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    const rows = [sampleRow()]
    await repo.saveBatch(rows)
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'https://proj.supabase.co/functions/v1/schedule-assignments-batch',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ assignments: rows }),
      }),
    )
    expect(vi.mocked(buildEdgeInvokeHeaders)).toHaveBeenCalledWith(
      'anon',
      expect.stringMatching(/^schedule-assignments-batch:actor1:/),
    )
  })

  it('HTTP 非 2xx 時拋錯含狀態碼', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as never)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 418 }))
    const repo = new EdgeScheduleAssignmentRepository({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    await expect(repo.saveBatch([sampleRow()])).rejects.toThrow('儲存排班失敗（HTTP 418）')
  })

  it('請先登入時原樣拋出', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockRejectedValue(new Error('請先登入'))
    const fetchFn = vi.fn()
    vi.stubGlobal('fetch', fetchFn)
    const repo = new EdgeScheduleAssignmentRepository({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    await expect(repo.saveBatch([sampleRow()])).rejects.toThrow('請先登入')
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('連線失敗時包裝固定中文訊息', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as never)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    const repo = new EdgeScheduleAssignmentRepository({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    await expect(repo.saveBatch([sampleRow()])).rejects.toThrow('無法連線至後端，請檢查網路或 Supabase 設定。')
  })

  it('無列時 actor 後綴使用 unknown-actor', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as never)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
    const repo = new EdgeScheduleAssignmentRepository({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    await repo.saveBatch([])
    expect(vi.mocked(buildEdgeInvokeHeaders)).toHaveBeenCalledWith(
      'anon',
      expect.stringMatching(/^schedule-assignments-batch:unknown-actor:/),
    )
  })
})

describe('EdgeScheduleAssignmentRepository.softDeleteHistoryBatch', () => {
  it('POST 成功時不拋錯', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as never)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: vi.fn().mockResolvedValue('') }))
    const repo = new EdgeScheduleAssignmentRepository({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    await expect(repo.softDeleteHistoryBatch('batch-x')).resolves.toBeUndefined()
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'https://proj.supabase.co/functions/v1/scheduling-history-soft-delete',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ batch_id: 'batch-x' }),
      }),
    )
  })

  it('HTTP 非 2xx 時優先採用 response.text()', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as never)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        text: vi.fn().mockResolvedValue('併發衝突'),
      }),
    )
    const repo = new EdgeScheduleAssignmentRepository({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    await expect(repo.softDeleteHistoryBatch('b')).rejects.toThrow('併發衝突')
  })

  it('HTTP 非 2xx 且 text 空字串時回落狀態碼訊息', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as never)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue(''),
      }),
    )
    const repo = new EdgeScheduleAssignmentRepository({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    await expect(repo.softDeleteHistoryBatch('b')).rejects.toThrow('軟刪除批次失敗（HTTP 500）')
  })
})
