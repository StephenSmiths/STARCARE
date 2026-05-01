import { describe, expect, it } from 'vitest'
import { buildMidweekSubsidizedZeroAlerts } from './schedulingComplianceAlertService'
import type { SchedulingResident } from './schedulingService'

const resident = (
  overrides: Partial<SchedulingResident> = {},
): SchedulingResident => ({
  id: 'resident-1',
  name: '測試院友',
  fundingType: 'GradeA_Subsidized',
  isSpecialCareCase: false,
  weeklyCompletedCount: 0,
  assignedDates: [],
  ...overrides,
})

describe('schedulingComplianceAlertService', () => {
  it('週三會對甲一／院舍券且 0 次者產生高優先提醒', () => {
    const alerts = buildMidweekSubsidizedZeroAlerts(
      [
        resident({ id: 'a', name: '甲一-零次', fundingType: 'GradeA_Subsidized', weeklyCompletedCount: 0 }),
        resident({ id: 'b', name: '院舍券-零次', fundingType: 'Voucher', weeklyCompletedCount: 0 }),
        resident({ id: 'c', name: '私位-零次', fundingType: 'Private', weeklyCompletedCount: 0 }),
        resident({ id: 'd', name: '甲一-非零', fundingType: 'GradeA_Subsidized', weeklyCompletedCount: 1 }),
      ],
      new Date('2026-05-06T09:00:00.000Z'),
    )
    expect(alerts.map((item) => item.residentId)).toEqual(['a', 'b'])
    expect(alerts.every((item) => item.level === 'high')).toBe(true)
  })

  it('非週三不產生該提醒', () => {
    const alerts = buildMidweekSubsidizedZeroAlerts(
      [resident({ id: 'a', fundingType: 'GradeA_Subsidized', weeklyCompletedCount: 0 })],
      new Date('2026-05-05T09:00:00.000Z'),
    )
    expect(alerts).toHaveLength(0)
  })
})
