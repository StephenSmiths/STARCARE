/** PDF 02【3】：KPI 歷史 Edge list／upsert／clear（Seq 15；fetch mock）。 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./edgeFunctionHeaders', () => ({
  buildEdgeInvokeHeaders: vi.fn(),
}))

import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'
import type { SchedulingKpiRunRecord } from '../services/schedulingKpiService'
import { EdgeSchedulingKpiHistoryRepository } from './schedulingKpiHistoryRepository'

const edgeListRow = {
  ran_at: '2026-05-01T10:00:00.000Z',
  coverage_rate: 90,
  conflict_rate_per_100: 1,
  average_assignments_per_resident: 1.3,
  under_target_rate: 10,
  resident_count: 20,
  assignment_count: 26,
  conflict_count: 2,
  actor_id: 'a1',
}

const sampleRecord: SchedulingKpiRunRecord = {
  ranAt: '2026-05-02T10:00:00.000Z',
  kpis: {
    coverageRate: 88,
    conflictRatePer100: 0,
    averageAssignmentsPerResident: 1.1,
    underTargetRate: 12,
  },
  residentCount: 18,
  assignmentCount: 20,
  conflictCount: 0,
  actorId: 'a2',
}

const makeRepo = () =>
  new EdgeSchedulingKpiHistoryRepository({
    supabaseUrl: 'https://proj.supabase.co',
    anonKey: 'anon',
  })

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({ Authorization: 'Bearer t' } as never)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('EdgeSchedulingKpiHistoryRepository.listHistory', () => {
  it('GET 成功：snake_case 映射為 SchedulingKpiRunRecord', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ rows: [edgeListRow] }),
      }),
    )
    const rows = await makeRepo().listHistory('fac-1')
    expect(rows).toHaveLength(1)
    expect(rows[0]).toEqual({
      ranAt: '2026-05-01T10:00:00.000Z',
      kpis: {
        coverageRate: 90,
        conflictRatePer100: 1,
        averageAssignmentsPerResident: 1.3,
        underTargetRate: 10,
      },
      residentCount: 20,
      assignmentCount: 26,
      conflictCount: 2,
      actorId: 'a1',
    })
    const url = String(vi.mocked(fetch).mock.calls[0][0])
    expect(url).toContain('scheduling-kpi-history-list?')
    expect(url).toContain('facility_id=fac-1')
    expect(url).toContain('limit=10')
  })

  it('from／to／actorId／limit 寫入 query string', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue({ rows: [] }) }))
    await makeRepo().listHistory('f1', {
      from: '2026-01-01',
      to: '2026-01-31',
      actorId: 'act-9',
      limit: 7,
    })
    const url = String(vi.mocked(fetch).mock.calls[0][0])
    expect(url).toContain('from=2026-01-01')
    expect(url).toContain('to=2026-01-31')
    expect(url).toContain('actor_id=act-9')
    expect(url).toContain('limit=7')
  })

  it('rows 缺省時回空陣列', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue({}) }))
    expect(await makeRepo().listHistory('f')).toEqual([])
  })

  it('HTTP 非 2xx 時拋錯', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }))
    await expect(makeRepo().listHistory('f')).rejects.toThrow('無法讀取 KPI 歷史（HTTP 502）')
  })
})

describe('EdgeSchedulingKpiHistoryRepository.appendRecord', () => {
  it('POST 成功', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
    await expect(makeRepo().appendRecord('fac-x', sampleRecord)).resolves.toBeUndefined()
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'https://proj.supabase.co/functions/v1/scheduling-kpi-history-upsert',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"ranAt":"2026-05-02T10:00:00.000Z"'),
      }),
    )
  })

  it('HTTP 非 2xx 時拋錯', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400 }))
    await expect(makeRepo().appendRecord('fac', sampleRecord)).rejects.toThrow('無法儲存 KPI 歷史（HTTP 400）')
  })
})

describe('EdgeSchedulingKpiHistoryRepository.clearHistory', () => {
  it('POST 成功', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
    await makeRepo().clearHistory('fac-clear')
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'https://proj.supabase.co/functions/v1/scheduling-kpi-history-clear',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ facilityId: 'fac-clear' }),
      }),
    )
  })

  it('HTTP 非 2xx 時拋錯', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))
    await expect(makeRepo().clearHistory('f')).rejects.toThrow('無法清除 KPI 歷史（HTTP 503）')
  })
})
