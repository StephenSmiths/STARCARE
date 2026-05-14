/** PDF 01 §5／Seq 15：`EdgeScheduleAssignmentRepository` 批量寫入與批次軟刪（**`fetch`** mock）。 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./edgeFunctionHeaders', () => ({
  buildEdgeInvokeHeaders: vi.fn(),
}))

import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'
import type { ScheduleAssignmentRecord } from './scheduleAssignmentRepository'
import { EdgeScheduleAssignmentRepository } from './scheduleAssignmentRepository'

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

const edgeRepo = () =>
  new EdgeScheduleAssignmentRepository({
    supabaseUrl: 'https://proj.supabase.co',
    anonKey: 'anon',
  })

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('EdgeScheduleAssignmentRepository.saveBatch', () => {
  it('POST 成功時不拋錯且 body 帶 assignments', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({ h: '1' } as never)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
    const rows = [sampleRow()]
    await edgeRepo().saveBatch(rows)
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
    await expect(edgeRepo().saveBatch([sampleRow()])).rejects.toThrow('儲存排班失敗（HTTP 418）')
  })

  it('請先登入時原樣拋出', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockRejectedValue(new Error('請先登入'))
    const fetchFn = vi.fn()
    vi.stubGlobal('fetch', fetchFn)
    await expect(edgeRepo().saveBatch([sampleRow()])).rejects.toThrow('請先登入')
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('連線失敗時包裝固定中文訊息', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as never)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    await expect(edgeRepo().saveBatch([sampleRow()])).rejects.toThrow('無法連線至後端，請檢查網路或 Supabase 設定。')
  })

  it('無列時 actor 後綴使用 unknown-actor', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as never)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
    await edgeRepo().saveBatch([])
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
    await expect(edgeRepo().softDeleteHistoryBatch('batch-x')).resolves.toBeUndefined()
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
    await expect(edgeRepo().softDeleteHistoryBatch('b')).rejects.toThrow('併發衝突')
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
    await expect(edgeRepo().softDeleteHistoryBatch('b')).rejects.toThrow('軟刪除批次失敗（HTTP 500）')
  })

  it('請先登入時原樣拋出', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockRejectedValue(new Error('請先登入'))
    const fetchFn = vi.fn()
    vi.stubGlobal('fetch', fetchFn)
    await expect(edgeRepo().softDeleteHistoryBatch('b')).rejects.toThrow('請先登入')
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('連線失敗時包裝固定中文訊息', async () => {
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as never)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    await expect(edgeRepo().softDeleteHistoryBatch('b')).rejects.toThrow('無法連線至後端，請檢查網路或 Supabase 設定。')
  })
})
