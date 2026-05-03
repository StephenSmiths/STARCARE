import { describe, expect, it } from 'vitest'
import { AuditTrailService } from './auditTrailService'
import { SchedulingService, type SchedulingResident, type SchedulingSession } from './schedulingService'

/** PDF 01 §3：資助復康引擎與認知時段隔離（與 `filterToSubsidizedRehabServiceOnly` 乾跑入口呼應） */
describe('schedulingService 雙軌隔離', () => {
  it('僅有認知時段時資助復康引擎不產生指派', () => {
    const service = new SchedulingService(new AuditTrailService())
    const residents: SchedulingResident[] = [
      {
        id: 'r-ea1',
        name: '甲一',
        fundingType: 'GradeA_Subsidized',
        isSpecialCareCase: false,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
    ]
    const sessions: SchedulingSession[] = [
      {
        id: 'only-cog',
        staffId: 'st1',
        staffName: 'OT',
        date: '2026-05-04',
        timeSlot: '10:00',
        serviceType: 'Dementia_Service',
        capacity: 1,
        staffRoleType: 'OT',
      },
    ]
    const result = service.runSubsidizedRehabScheduling('TeamLead_test', residents, sessions)
    expect(result.assignments).toHaveLength(0)
    expect(result.conflicts.some((c) => c.residentId === 'r-ea1')).toBe(true)
  })

  it('同時存在資助與認知時段時僅使用資助時段指派', () => {
    const service = new SchedulingService(new AuditTrailService())
    const residents: SchedulingResident[] = [
      {
        id: 'r-ea1',
        name: '甲一',
        fundingType: 'GradeA_Subsidized',
        isSpecialCareCase: false,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
    ]
    const sessions: SchedulingSession[] = [
      {
        id: 'cog',
        staffId: 'st-c',
        staffName: 'OT C',
        date: '2026-05-04',
        timeSlot: '09:00',
        serviceType: 'Dementia_Service',
        capacity: 1,
        staffRoleType: 'OT',
      },
      {
        id: 'rehab',
        staffId: 'st-r',
        staffName: 'OT R',
        date: '2026-05-06',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
    ]
    const result = service.runSubsidizedRehabScheduling('TeamLead_test', residents, sessions)
    const ea1 = result.assignments.filter((a) => a.residentId === 'r-ea1')
    expect(ea1.every((a) => a.sessionId === 'rehab')).toBe(true)
    expect(ea1.some((a) => a.sessionId === 'cog')).toBe(false)
  })
})
