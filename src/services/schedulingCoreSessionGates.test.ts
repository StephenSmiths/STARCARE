import { describe, expect, it } from 'vitest'
import {
  countStaffGroupSessionsOnDate,
  evalSessionCoreForPick,
} from './schedulingCoreSessionGates'
import type {
  SchedulingAssignment,
  SchedulingConstraints,
  SchedulingResident,
  SchedulingSession,
} from './schedulingService'

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
    expect(evalSessionCoreForPick(resident, session, usage, slots, constraints, [], [session]).tag).toBe('skip')
  })

  it('PDF 02【16】P1：小組活動場次達職類每日上限時拒絕新小組時段', () => {
    const resident: SchedulingResident = {
      id: 'r1',
      name: '院友',
      fundingType: 'GradeA_Subsidized',
      isSpecialCareCase: false,
      weeklyCompletedCount: 0,
      assignedDates: [],
    }
    const groupA: SchedulingSession = {
      id: 'g-a',
      staffId: 'st-ot',
      staffName: 'OT',
      date: '2026-05-20',
      timeSlot: '09:00',
      serviceType: 'Subsidized_Rehab',
      capacity: 4,
      staffRoleType: 'OT',
    }
    const groupB: SchedulingSession = {
      id: 'g-b',
      staffId: 'st-ot',
      staffName: 'OT',
      date: '2026-05-20',
      timeSlot: '10:00',
      serviceType: 'Subsidized_Rehab',
      capacity: 3,
      staffRoleType: 'OT',
    }
    const catalog = [groupA, groupB]
    const byId = new Map(catalog.map((s) => [s.id, s]))
    const committed: SchedulingAssignment[] = [
      { residentId: 'rx', residentName: 'X', sessionId: 'g-a', staffId: 'st-ot', pass: 1 },
    ]
    expect(countStaffGroupSessionsOnDate(committed, byId, 'st-ot', '2026-05-20', 'Subsidized_Rehab')).toBe(1)
    const usage = new Map<string, number>([['g-a', 0]])
    const slots = new Set<string>()
    const capConstraints: SchedulingConstraints = {
      dailySameServiceLimit: 1,
      minGapDaysSameService: 0,
      groupCapacityLimit: 99,
      therapistGroupSessionsDailyCap: 1,
    }
    const fail = evalSessionCoreForPick(resident, groupB, usage, slots, capConstraints, committed, catalog)
    expect(fail.tag).toBe('fail')
    if (fail.tag === 'fail') {
      expect(fail.conflictType).toBe('STAFF_GROUP_DAILY_CAP')
    }
    const okSecondResident = evalSessionCoreForPick(
      resident,
      groupA,
      new Map([['g-a', 1]]),
      slots,
      capConstraints,
      committed,
      catalog,
    )
    expect(okSecondResident.tag).toBe('core-ok')
  })
})
