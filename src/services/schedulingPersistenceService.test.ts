import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ScheduleAssignmentRepository } from '../repositories/scheduleAssignmentRepository'
import { hydrateAuditTrailFromRemote, recordAuditTrailThenHydrate } from './auditTrailHydrationService'
import { SchedulingPersistenceService } from './schedulingPersistenceService'
import { isSupabaseBrowserConfigured } from './supabaseBrowserEnv'
import { writeLastSchedulingBatchId } from './schedulingLastBatchStorage'
import type { SchedulingAssignment, SchedulingConflict } from './schedulingService'

vi.mock('./schedulingLastBatchStorage', () => ({
  writeLastSchedulingBatchId: vi.fn(),
}))

vi.mock('./auditTrailHydrationService', () => ({
  hydrateAuditTrailFromRemote: vi.fn(),
  recordAuditTrailThenHydrate: vi.fn(),
}))

vi.mock('./supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(() => null),
  isSupabaseBrowserConfigured: vi.fn(),
}))

const oneAssignment: SchedulingAssignment = {
  residentId: 'r1',
  residentName: 'A',
  sessionId: 's1',
  staffId: 'st1',
  pass: 1,
}

describe('SchedulingPersistenceService', () => {
  let saveBatch: ReturnType<typeof vi.fn>
  let svc: SchedulingPersistenceService

  beforeEach(() => {
    vi.clearAllMocks()
    saveBatch = vi.fn().mockResolvedValue(undefined)
    const repo = { saveBatch } as unknown as ScheduleAssignmentRepository
    svc = new SchedulingPersistenceService(repo)
    vi.mocked(isSupabaseBrowserConfigured).mockReturnValue(false)
  })

  it('無指派時拒絕儲存', async () => {
    await expect(svc.saveScheduleAssignments('actor', [], [])).rejects.toThrow('沒有可儲存的排班結果')
  })

  it('仍有衝突時拒絕儲存', async () => {
    await expect(
      svc.saveScheduleAssignments('actor', [oneAssignment], [
        { residentId: 'r1', residentName: 'A', type: 'NO_CAPACITY', reason: 'x' } as SchedulingConflict,
      ]),
    ).rejects.toThrow('仍有排班衝突')
    expect(saveBatch).not.toHaveBeenCalled()
  })

  it('同一操作者併發儲存時防重覆提交', async () => {
    saveBatch.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 40)
        }),
    )
    const p1 = svc.saveScheduleAssignments('actor', [oneAssignment], [])
    await expect(svc.saveScheduleAssignments('actor', [oneAssignment], [])).rejects.toThrow('請勿重覆提交')
    await p1
    await expect(svc.saveScheduleAssignments('actor', [oneAssignment], [])).resolves.toBeUndefined()
  })

  it('成功儲存後寫入本機 batch_id 並走本機審計（未連 Supabase）', async () => {
    await svc.saveScheduleAssignments('actor', [oneAssignment], [])
    expect(saveBatch).toHaveBeenCalledTimes(1)
    const rows = saveBatch.mock.calls[0][0]
    expect(rows).toHaveLength(1)
    expect(rows[0].resident_id).toBe('r1')
    expect(rows[0].service_type).toBe('Subsidized_Rehab')
    expect(rows[0].actor_id).toBe('actor')
    expect(rows[0].batch_id).toMatch(/^batch-/)
    expect(writeLastSchedulingBatchId).toHaveBeenCalledWith(rows[0].batch_id)
    expect(recordAuditTrailThenHydrate).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'SCHEDULE_BATCH_SAVE', actorId: 'actor' }),
    )
    expect(hydrateAuditTrailFromRemote).not.toHaveBeenCalled()
  })

  it('已連 Supabase 時改拉遠端審計 hydrate', async () => {
    vi.mocked(isSupabaseBrowserConfigured).mockReturnValue(true)
    await svc.saveScheduleAssignments('actor', [oneAssignment], [])
    expect(hydrateAuditTrailFromRemote).toHaveBeenCalledTimes(1)
    expect(recordAuditTrailThenHydrate).not.toHaveBeenCalled()
  })
})
