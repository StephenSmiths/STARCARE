import { beforeEach, describe, expect, it, vi } from 'vitest'
import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import type { SchedulingKpiRunRecord } from '../services/schedulingKpiService'
import {
  createSchedulingKpiHistoryRepository,
  EdgeSchedulingKpiHistoryRepository,
  InMemorySchedulingKpiHistoryRepository,
} from './schedulingKpiHistoryRepository'

vi.mock('../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('createSchedulingKpiHistoryRepository', () => {
  it('無憑證時回傳 InMemorySchedulingKpiHistoryRepository', () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue(null)
    expect(createSchedulingKpiHistoryRepository()).toBeInstanceOf(InMemorySchedulingKpiHistoryRepository)
  })

  it('有憑證時回傳 EdgeSchedulingKpiHistoryRepository', () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon',
    })
    expect(createSchedulingKpiHistoryRepository()).toBeInstanceOf(EdgeSchedulingKpiHistoryRepository)
  })
})

const makeRecord = (index: number): SchedulingKpiRunRecord => ({
  ranAt: `2026-05-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
  kpis: {
    coverageRate: 80 + index,
    conflictRatePer100: index,
    averageAssignmentsPerResident: 1.2,
    underTargetRate: 20 - index,
  },
  residentCount: 10 + index,
  assignmentCount: 12 + index,
  conflictCount: index,
})

describe('InMemorySchedulingKpiHistoryRepository', () => {
  it('append keeps latest 10 records in descending order', async () => {
    const repo = new InMemorySchedulingKpiHistoryRepository()
    for (let i = 0; i < 12; i += 1) {
      await repo.appendRecord(STARCARE_DEFAULT_FACILITY_ID, makeRecord(i))
    }
    const rows = await repo.listHistory(STARCARE_DEFAULT_FACILITY_ID)
    expect(rows).toHaveLength(10)
    expect(rows[0].ranAt).toBe(makeRecord(11).ranAt)
    expect(rows[9].ranAt).toBe(makeRecord(2).ranAt)
  })

  it('clear removes all records', async () => {
    const repo = new InMemorySchedulingKpiHistoryRepository()
    await repo.appendRecord(STARCARE_DEFAULT_FACILITY_ID, makeRecord(0))
    await repo.clearHistory(STARCARE_DEFAULT_FACILITY_ID)
    expect(await repo.listHistory(STARCARE_DEFAULT_FACILITY_ID)).toEqual([])
  })

  it('supports from/to query filter', async () => {
    const repo = new InMemorySchedulingKpiHistoryRepository()
    for (let i = 0; i < 5; i += 1) {
      await repo.appendRecord(STARCARE_DEFAULT_FACILITY_ID, makeRecord(i))
    }
    const rows = await repo.listHistory(STARCARE_DEFAULT_FACILITY_ID, {
      from: '2026-05-03T00:00:00.000Z',
      to: '2026-05-04T23:59:59.999Z',
      limit: 10,
    })
    expect(rows).toHaveLength(2)
    expect(rows[0].ranAt).toBe('2026-05-04T10:00:00.000Z')
    expect(rows[1].ranAt).toBe('2026-05-03T10:00:00.000Z')
  })

  it('listHistory 將 limit 夾在 1～50（預設 10）', async () => {
    const repo = new InMemorySchedulingKpiHistoryRepository()
    for (let i = 0; i < 10; i += 1) {
      await repo.appendRecord(STARCARE_DEFAULT_FACILITY_ID, makeRecord(i))
    }
    expect(await repo.listHistory(STARCARE_DEFAULT_FACILITY_ID, { limit: 3 })).toHaveLength(3)
    expect(await repo.listHistory(STARCARE_DEFAULT_FACILITY_ID, { limit: 0 })).toHaveLength(1)
    expect(await repo.listHistory(STARCARE_DEFAULT_FACILITY_ID, { limit: 999 })).toHaveLength(10)
  })
})
