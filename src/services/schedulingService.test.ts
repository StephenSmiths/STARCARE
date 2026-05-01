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
      { id: 's1', staffId: 'st1', staffName: 'OT A', date: '2026-05-01', timeSlot: '09:00', serviceType: 'Subsidized_Rehab', capacity: 1 },
      { id: 's2', staffId: 'st2', staffName: 'OT B', date: '2026-05-03', timeSlot: '09:00', serviceType: 'Subsidized_Rehab', capacity: 1 },
    ]

    const result = service.runSubsidizedRehabScheduling('TeamLead_test', residents, sessions)
    const ea1Assigned = result.assignments.filter((item) => item.residentId === 'r-ea1').length
    const privateAssigned = result.assignments.filter((item) => item.residentId === 'r-private').length

    expect(ea1Assigned).toBeGreaterThanOrEqual(2)
    expect(privateAssigned).toBe(0)
    expect(result.underTargetResidents.some((item) => item.residentId === 'r-ea1')).toBe(false)
  })
})
