import { describe, expect, it } from 'vitest'
import type { SchedulingSession } from '../../../services/schedulingService'
import {
  buildDashboardSummary,
  countSessionsOnLocalDate,
  countSessionsOnLocalDateByTrack,
  rehabDisciplineFamilyFromStaff,
} from './dashboardSummaryService'
import type { StaffOverviewRow } from '../../staff/services/staffManagementService'

describe('dashboardSummaryService (Seq 13)', () => {
  it('rehabDisciplineFamilyFromStaff：僅 role_type，不依顯示名', () => {
    expect(
      rehabDisciplineFamilyFromStaff({
        staffId: 'x',
        staffName: '王 PT',
        sessionCount: 0,
        skillCount: 0,
      }),
    ).toBe('Other')
    expect(
      rehabDisciplineFamilyFromStaff({
        staffId: 'x',
        staffName: '無 PT 字樣',
        roleType: 'PT',
        sessionCount: 0,
        skillCount: 0,
      }),
    ).toBe('PT')
    expect(
      rehabDisciplineFamilyFromStaff({
        staffId: 'y',
        staffName: '王 PT',
        roleType: 'TeamLead',
        sessionCount: 0,
        skillCount: 0,
      }),
    ).toBe('Other')
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

  it('countSessionsOnLocalDateByTrack：同日分軌計數（01 §4.2）', () => {
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
        date: '2026-05-01',
        timeSlot: '10:00',
        serviceType: 'Dementia_Service',
        capacity: 1,
      },
    ]
    expect(countSessionsOnLocalDateByTrack(sessions, '2026-05-01')).toEqual({
      subsidizedRehab: 1,
      dementiaService: 1,
    })
  })

  it('buildDashboardSummary：彙總欄位', () => {
    const staff: StaffOverviewRow[] = [
      { staffId: '1', staffName: 'A PTA', roleType: 'PTA', sessionCount: 1, skillCount: 1 },
      { staffId: '2', staffName: 'B OT', roleType: 'OT', sessionCount: 0, skillCount: 0 },
      { staffId: '3', staffName: '名稱無職類', roleType: 'OTA', sessionCount: 0, skillCount: 0 },
    ]
    const summary = buildDashboardSummary({
      residentTotal: 10,
      subsidizedRehabCohortCount: 7,
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
    expect(summary.subsidizedRehabCohortCount).toBe(7)
    expect(summary.staffTotal).toBe(3)
    expect(summary.teamPtFamilyCount).toBe(1)
    expect(summary.teamOtFamilyCount).toBe(2)
    expect(summary.lastWeeklyCoveragePercent).toBe(88)
    expect(summary.assessmentDueWithin14Count).toBe(3)
    expect(summary.todaySubsidizedRehabSessionCount).toBe(0)
    expect(summary.todayDementiaServiceSessionCount).toBe(0)
  })
})
