import { describe, expect, it, beforeEach } from 'vitest'
import type { SchedulingSession } from '../../../services/schedulingService'
import { workSessionResponseStore } from '../../../services/workSessionResponseStore'
import {
  acceptWorkSession,
  filterWorkPlanRows,
  mergeSessionsWithResponses,
  rejectWorkSession,
  resolveLifecycleStatus,
} from './workSessionPlanService'

const sampleSession = (overrides: Partial<SchedulingSession> = {}): SchedulingSession => ({
  id: 'sess-1',
  staffId: 'staff-a',
  staffName: '張 PT',
  date: '2026-05-10',
  timeSlot: '09:00',
  serviceType: 'Subsidized_Rehab',
  capacity: 2,
  ...overrides,
})

describe('workSessionPlanService (Seq 16)', () => {
  beforeEach(() => {
    workSessionResponseStore.clearAll()
  })

  it('mergeSessionsWithResponses：預設 PENDING', () => {
    const rows = mergeSessionsWithResponses([sampleSession()])
    expect(rows[0]?.responseStatus).toBe('PENDING')
  })

  it('acceptWorkSession／rejectWorkSession：僅限 PENDING', () => {
    acceptWorkSession('actor-1', 'sess-1')
    expect(resolveLifecycleStatus('sess-1')).toBe('ACCEPTED')
    expect(() => acceptWorkSession('actor-1', 'sess-1')).toThrow(/待接收/)
  })

  it('rejectWorkSession', () => {
    rejectWorkSession('actor-1', 'sess-2')
    expect(resolveLifecycleStatus('sess-2')).toBe('REJECTED')
  })

  it('filterWorkPlanRows：日期與狀態', () => {
    acceptWorkSession('a', 'x1')
    const rows = mergeSessionsWithResponses([
      sampleSession({ id: 'x1', date: '2026-05-10' }),
      sampleSession({ id: 'x2', date: '2026-05-11' }),
    ])
    const day = filterWorkPlanRows(rows, '2026-05-10', 'all')
    expect(day).toHaveLength(1)
    const acc = filterWorkPlanRows(rows, '2026-05-10', 'ACCEPTED')
    expect(acc).toHaveLength(1)
  })
})
