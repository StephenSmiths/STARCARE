import { describe, expect, it } from 'vitest'
import {
  getStaffGroupSessionCount,
  noteStaffGroupSessionAssignment,
} from './schedulingStaffGroupDailyCache'
import type { SchedulingSession } from './schedulingService'

const groupSession = (id: string): SchedulingSession => ({
  id,
  staffId: 'st-1',
  staffName: 'PT',
  date: '2026-05-04',
  timeSlot: '10:00',
  serviceType: 'Subsidized_Rehab',
  capacity: 4,
  staffRoleType: 'PT',
})

describe('schedulingStaffGroupDailyCache', () => {
  it('增量記錄互異小組時段數', () => {
    const cache = new Map()
    noteStaffGroupSessionAssignment(cache, groupSession('g1'))
    noteStaffGroupSessionAssignment(cache, groupSession('g1'))
    noteStaffGroupSessionAssignment(cache, groupSession('g2'))
    expect(getStaffGroupSessionCount(cache, 'st-1', '2026-05-04')).toBe(2)
  })
})
