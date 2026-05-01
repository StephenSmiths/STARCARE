import { describe, expect, it } from 'vitest'
import type { SchedulingSession } from '../../../services/schedulingService'
import {
  buildDashboardSummary,
  countSessionsOnLocalDate,
  inferRehabDisciplineFamily,
} from './dashboardSummaryService'
import type { StaffOverviewRow } from '../../staff/services/staffManagementService'

describe('dashboardSummaryService (Seq 13)', () => {
  it('inferRehabDisciplineFamily：PTA/OTA 優先於 PT/OT 字樣', () => {
    expect(inferRehabDisciplineFamily('李先生 PTA')).toBe('PT')
    expect(inferRehabDisciplineFamily('陳姑娘 OTA')).toBe('OT')
    expect(inferRehabDisciplineFamily('王 PT')).toBe('PT')
    expect(inferRehabDisciplineFamily('張 OT')).toBe('OT')
    expect(inferRehabDisciplineFamily('後勤')).toBe('Other')
  })

  it('countSessionsOnLocalDate：僅計入指定日期', () => {
    const sessions: SchedulingSession[] = [
      {
        id: 'a',
        staffId: 's1',
        staffName: 'X',
        date: '2026-05-01',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
      },
      {
        id: 'b',
        staffId: 's2',
        staffName: 'Y',
        date: '2026-05-02',
        timeSlot: '10:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
      },
    ]
    expect(countSessionsOnLocalDate(sessions, '2026-05-01')).toBe(1)
  })

  it('buildDashboardSummary：彙總欄位', () => {
    const staff: StaffOverviewRow[] = [
      { staffId: '1', staffName: 'A PTA', sessionCount: 1, skillCount: 1 },
      { staffId: '2', staffName: 'B OT', sessionCount: 0, skillCount: 0 },
    ]
    const summary = buildDashboardSummary({
      residentTotal: 10,
      staffRows: staff,
      schedulingSessions: [],
      todayLocalYmd: '2026-05-01',
      kpiHistoryNewestFirst: [
        {
          ranAt: '2026-05-01T08:00:00.000Z',
          kpis: {
            coverageRate: 88,
            conflictRatePer100: 2,
            averageAssignmentsPerResident: 1.5,
            underTargetRate: 12,
          },
          residentCount: 10,
          assignmentCount: 15,
          conflictCount: 1,
        },
      ],
      assessmentDueWithin14Count: 3,
    })
    expect(summary.residentTotal).toBe(10)
    expect(summary.staffTotal).toBe(2)
    expect(summary.teamPtFamilyCount).toBe(1)
    expect(summary.teamOtFamilyCount).toBe(1)
    expect(summary.lastWeeklyCoveragePercent).toBe(88)
    expect(summary.assessmentDueWithin14Count).toBe(3)
  })
})
