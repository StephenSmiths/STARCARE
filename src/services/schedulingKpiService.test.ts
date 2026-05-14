import { describe, expect, it } from 'vitest'
import type { SchedulingAssignment, SchedulingConflict, SchedulingResident } from './schedulingService'
import { calculateSchedulingKpis } from './schedulingKpiService'

/** PDF 01 §4.1：分母為資助復康合規族群；與 `getWeeklyTargetByFundingType` 對齊 */
const resident = (overrides: Partial<SchedulingResident>): SchedulingResident => ({
  id: 'r1',
  name: 'A',
  fundingType: 'GradeA_Subsidized',
  isSpecialCareCase: false,
  weeklyCompletedCount: 0,
  assignedDates: [],
  ...overrides,
})

const assignment = (overrides: Partial<SchedulingAssignment>): SchedulingAssignment => ({
  residentId: 'r1',
  residentName: 'A',
  sessionId: 's1',
  staffId: 'st1',
  pass: 1,
  ...overrides,
})

const conflict = (overrides: Partial<SchedulingConflict>): SchedulingConflict => ({
  residentId: 'r1',
  residentName: 'A',
  type: 'NO_CAPACITY',
  reason: 'x',
  ...overrides,
})

describe('calculateSchedulingKpis', () => {
  it('零院友時各率為 0', () => {
    expect(calculateSchedulingKpis([], [assignment({})], [conflict({})])).toEqual({
      coverageRate: 0,
      conflictRatePer100: 0,
      averageAssignmentsPerResident: 0,
      underTargetRate: 0,
    })
  })

  it('覆蓋率／待補位率／衝突率／人均指派（甲一每週 2、私位 1）', () => {
    const residents: SchedulingResident[] = [
      resident({ id: 'a', weeklyCompletedCount: 2 }),
      resident({ id: 'b', fundingType: 'Private', weeklyCompletedCount: 0 }),
      resident({ id: 'c', weeklyCompletedCount: 1 }),
    ]
    const assignments: SchedulingAssignment[] = [
      assignment({ residentId: 'a' }),
      assignment({ residentId: 'b' }),
      assignment({ residentId: 'c' }),
      assignment({ residentId: 'c', sessionId: 's2' }),
    ]
    const conflicts: SchedulingConflict[] = [conflict({ residentId: 'a' }), conflict({ residentId: 'c' })]
    const k = calculateSchedulingKpis(residents, assignments, conflicts)
    expect(k.coverageRate).toBeCloseTo((1 / 3) * 100, 5)
    expect(k.underTargetRate).toBeCloseTo((2 / 3) * 100, 5)
    expect(k.conflictRatePer100).toBeCloseTo((2 / 3) * 100, 5)
    expect(k.averageAssignmentsPerResident).toBeCloseTo(4 / 3, 5)
  })
})
