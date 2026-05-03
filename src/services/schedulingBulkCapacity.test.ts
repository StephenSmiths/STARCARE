import { describe, expect, it } from 'vitest'
import { AuditTrailService } from './auditTrailService'
import { SchedulingService, type SchedulingResident, type SchedulingSession } from './schedulingService'

/** 大批量：10 位院友、僅 1 個可排時段 → 人手不足時應產生大量衝突紀錄 */
describe('智能排班大批量（容量不足）', () => {
  it('僅一節容量時，多數院友應得到容量或無時段類衝突', () => {
    const service = new SchedulingService(new AuditTrailService())

    const residents: SchedulingResident[] = [
      ...[0, 1, 2, 3].map((i) => ({
        id: `ea1-${i}`,
        name: `甲一院友${i + 1}`,
        fundingType: 'GradeA_Subsidized' as const,
        isSpecialCareCase: i === 0,
        weeklyCompletedCount: 0,
        assignedDates: [] as string[],
      })),
      ...[0, 1].map((i) => ({
        id: `voucher-${i}`,
        name: `院舍券院友${i + 1}`,
        fundingType: 'Voucher' as const,
        isSpecialCareCase: false,
        weeklyCompletedCount: 0,
        assignedDates: [] as string[],
      })),
      ...[0, 1, 2, 3].map((i) => ({
        id: `private-${i}`,
        name: `私位院友${i + 1}`,
        fundingType: 'Private' as const,
        isSpecialCareCase: false,
        weeklyCompletedCount: 0,
        assignedDates: [] as string[],
      })),
    ]

    const sessions: SchedulingSession[] = [
      {
        id: 'only-slot',
        staffId: 'staff-1',
        staffName: '唯一治療師',
        date: '2026-06-02',
        timeSlot: '09:00-10:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
    ]

    const result = service.runSubsidizedRehabScheduling('TeamLead_bulk', residents, sessions)

    expect(result.conflicts.length).toBeGreaterThanOrEqual(9)
    const capacityOrNoSlot = result.conflicts.filter(
      (c) => c.type === 'NO_CAPACITY' || c.type === 'NO_ELIGIBLE_SESSION',
    )
    expect(capacityOrNoSlot.length).toBeGreaterThanOrEqual(9)
    expect(result.assignments.length).toBeGreaterThanOrEqual(1)
    expect(result.assignments.length).toBeLessThan(residents.length)
  })
})
