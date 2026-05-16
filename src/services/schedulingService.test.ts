import { describe, expect, it } from 'vitest'
import { AuditTrailService } from './auditTrailService'
import { SchedulingService, type SchedulingResident, type SchedulingSession } from './schedulingService'

describe('schedulingService 補齊邏輯', () => {
  it('Pass 3 會優先補齊未達標院友', () => {
    const service = new SchedulingService(new AuditTrailService())
    const residents: SchedulingResident[] = [
      {
        id: 'r-ea1',
        name: 'EA1 院友',
        fundingType: 'GradeA_Subsidized',
        isSpecialCareCase: true,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
      {
        id: 'r-private',
        name: '私位院友',
        fundingType: 'Private',
        isSpecialCareCase: false,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
    ]
    const sessions: SchedulingSession[] = [
      {
        id: 's1',
        staffId: 'st1',
        staffName: 'OT A',
        date: '2026-05-01',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
      {
        id: 's2',
        staffId: 'st2',
        staffName: 'OT B',
        date: '2026-05-03',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
    ]

    const result = service.runSubsidizedRehabScheduling('TeamLead_test', residents, sessions)
    const ea1Assigned = result.assignments.filter((item) => item.residentId === 'r-ea1').length
    const privateAssigned = result.assignments.filter((item) => item.residentId === 'r-private').length

    expect(ea1Assigned).toBeGreaterThanOrEqual(2)
    expect(privateAssigned).toBe(0)
    expect(result.underTargetResidents.some((item) => item.residentId === 'r-ea1')).toBe(false)
  })

  it('Pass 3 僅對未達標私位指派，且不超過週目標 1 次', () => {
    const service = new SchedulingService(new AuditTrailService())
    const residents: SchedulingResident[] = [
      {
        id: 'r-private',
        name: '私位院友',
        fundingType: 'Private',
        isSpecialCareCase: false,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
    ]
    const sessions: SchedulingSession[] = [
      {
        id: 's1',
        staffId: 'st1',
        staffName: 'OT A',
        date: '2026-05-01',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
      {
        id: 's2',
        staffId: 'st2',
        staffName: 'OT B',
        date: '2026-05-03',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
    ]

    const result = service.runSubsidizedRehabScheduling('TeamLead_test', residents, sessions)
    const privateAssigned = result.assignments.filter((item) => item.residentId === 'r-private').length

    expect(privateAssigned).toBe(1)
    expect(result.assignments.every((item) => item.pass === 3)).toBe(true)
  })

  it('SC＋allowScTherapistOnly：僅 PTA 時段時不指派（PDF 02【16】）', () => {
    const service = new SchedulingService(new AuditTrailService())
    const residents: SchedulingResident[] = [
      {
        id: 'r-sc',
        name: 'SC 院友',
        fundingType: 'GradeA_Subsidized',
        isSpecialCareCase: true,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
    ]
    const sessions: SchedulingSession[] = [
      {
        id: 'pta-only',
        staffId: 'st-pta',
        staffName: '助理',
        date: '2026-05-10',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        skillMatched: true,
        staffRoleType: 'PTA',
      },
    ]
    const result = service.runSubsidizedRehabScheduling('TeamLead_test', residents, sessions, {
      dailySameServiceLimit: 1,
      minGapDaysSameService: 1,
      groupCapacityLimit: Number.POSITIVE_INFINITY,
      allowScTherapistOnly: true,
    })
    expect(result.assignments).toHaveLength(0)
    expect(result.conflicts.some((c) => c.residentId === 'r-sc' && c.type === 'SKILL_MISMATCH')).toBe(true)
  })
})
