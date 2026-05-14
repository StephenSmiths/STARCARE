/** PDF 01 §5／Seq 15：`scheduling_history` 本機倉與 Repository 工廠（**Edge** 見 **`scheduleAssignmentRepository.edge.test.ts`**）。 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(),
}))

import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
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
