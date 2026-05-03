import { describe, expect, it } from 'vitest'
import { AuditTrailService } from './auditTrailService'
import { SchedulingService, type SchedulingResident, type SchedulingSession } from './schedulingService'

/** PDF 01 §3.1／`schedulingCore.pickSession`：同日、間隔與「無其他可用時段」二階段選時段 */
describe('schedulingService 01 §3.1 基礎約束', () => {
  it('同日僅能安排一次同類資助復康', () => {
    const service = new SchedulingService(new AuditTrailService())
    const residents: SchedulingResident[] = [
      {
        id: 'r-ea1',
        name: 'EA1 院友',
        fundingType: 'GradeA_Subsidized',
        isSpecialCareCase: false,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
    ]
    const sessions: SchedulingSession[] = [
      {
        id: 's-same-1',
        staffId: 'st-a',
        staffName: 'OT A',
        date: '2026-05-06',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
      {
        id: 's-same-2',
        staffId: 'st-b',
        staffName: 'OT B',
        date: '2026-05-06',
        timeSlot: '10:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
    ]
    const result = service.runSubsidizedRehabScheduling('TeamLead_test', residents, sessions)
    expect(result.assignments.filter((a) => a.residentId === 'r-ea1')).toHaveLength(1)
    expect(result.underTargetResidents.some((u) => u.residentId === 'r-ea1')).toBe(true)
  })

  it('「無其他可用時段」—僅相鄰兩日有時段時第二日仍排入以滿週目標', () => {
    const service = new SchedulingService(new AuditTrailService())
    const residents: SchedulingResident[] = [
      {
        id: 'r-ea1',
        name: 'EA1 院友',
        fundingType: 'GradeA_Subsidized',
        isSpecialCareCase: false,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
    ]
    const sessions: SchedulingSession[] = [
      {
        id: 's-mon',
        staffId: 'st-a',
        staffName: 'OT A',
        date: '2026-05-04',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
      {
        id: 's-tue',
        staffId: 'st-b',
        staffName: 'OT B',
        date: '2026-05-05',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
    ]
    const result = service.runSubsidizedRehabScheduling('TeamLead_test', residents, sessions)
    const ea1 = result.assignments.filter((a) => a.residentId === 'r-ea1')
    expect(ea1).toHaveLength(2)
    expect(new Set(ea1.map((a) => a.sessionId))).toEqual(new Set(['s-mon', 's-tue']))
    expect(result.underTargetResidents.some((u) => u.residentId === 'r-ea1')).toBe(false)
  })

  it('尚有非相鄰時段時優先選之（不啟用相鄰日例外）', () => {
    const service = new SchedulingService(new AuditTrailService())
    const residents: SchedulingResident[] = [
      {
        id: 'r-ea1',
        name: 'EA1 院友',
        fundingType: 'GradeA_Subsidized',
        isSpecialCareCase: false,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
    ]
    const sessions: SchedulingSession[] = [
      {
        id: 's-mon',
        staffId: 'st-a',
        staffName: 'OT A',
        date: '2026-05-04',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
      {
        id: 's-tue',
        staffId: 'st-b',
        staffName: 'OT B',
        date: '2026-05-05',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
      {
        id: 's-wed',
        staffId: 'st-c',
        staffName: 'OT C',
        date: '2026-05-06',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
    ]
    const result = service.runSubsidizedRehabScheduling('TeamLead_test', residents, sessions)
    const ea1 = result.assignments.filter((a) => a.residentId === 'r-ea1')
    expect(ea1).toHaveLength(2)
    expect(new Set(ea1.map((a) => a.sessionId))).toEqual(new Set(['s-mon', 's-wed']))
    expect(result.underTargetResidents.some((u) => u.residentId === 'r-ea1')).toBe(false)
  })
})
