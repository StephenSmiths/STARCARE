import { describe, expect, it } from 'vitest'
import { evalSessionCoreForPick } from './schedulingCoreSessionGates'
import type { SchedulingConstraints, SchedulingResident, SchedulingSession } from './schedulingService'

const constraints: SchedulingConstraints = {
  dailySameServiceLimit: 1,
  minGapDaysSameService: 1,
  groupCapacityLimit: 99,
}

describe('schedulingCoreSessionGates（PDF 01 §3 服務類型隔離）', () => {
  it('認知軌時段於資助復康門檢為 skip（不更新容量／不指派）', () => {
    const resident: SchedulingResident = {
      id: 'r1',
      name: '院友',
      fundingType: 'GradeA_Subsidized',
      isSpecialCareCase: false,
      weeklyCompletedCount: 0,
      assignedDates: [],
    }
    const session: SchedulingSession = {
      id: 'cog-1',
      staffId: 's1',
      staffName: 'OT',
      date: '2026-05-04',
      timeSlot: '10:00',
      serviceType: 'Dementia_Service',
      capacity: 1,
      staffRoleType: 'OT',
    }
    const usage = new Map<string, number>()
    const slots = new Set<string>()
    expect(evalSessionCoreForPick(resident, session, usage, slots, constraints).tag).toBe('skip')
  })
})
