import { describe, expect, it } from 'vitest'
import { buildSchedulingKpiTrendCsv } from './schedulingKpiTrendCsvService'
import type { SchedulingKpiRunRecord } from './schedulingKpiService'

describe('schedulingKpiTrendCsvService', () => {
  it('buildSchedulingKpiTrendCsv includes BOM and header', () => {
    const rows: SchedulingKpiRunRecord[] = [
      {
        ranAt: '2026-04-30T12:00:00.000Z',
        kpis: {
          coverageRate: 50,
          conflictRatePer100: 10,
          averageAssignmentsPerResident: 1.25,
          underTargetRate: 40,
        },
        residentCount: 100,
        assignmentCount: 125,
        conflictCount: 10,
      },
    ]
    const csv = buildSchedulingKpiTrendCsv('facility-main', rows)
    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv).toContain('facilityId')
    expect(csv).toContain('facility-main')
    expect(csv).toContain('2026-04-30T12:00:00.000Z')
    expect(csv).toContain('50')
  })
})
