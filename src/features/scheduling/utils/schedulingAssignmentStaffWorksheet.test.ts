import { describe, expect, it } from 'vitest'
import type { SchedulingAssignment, SchedulingSession } from '../../../services/schedulingService'
import {
  buildStaffAssignmentWorksheetRows,
  formatSchedulingWorksheetDateLabel,
} from './schedulingAssignmentStaffWorksheet'

const session = (over: Partial<SchedulingSession>): SchedulingSession => ({
  id: 's1',
  staffId: 'st-a',
  staffName: '員工甲',
  date: '2026-05-11',
  timeSlot: '08:30-09:30',
  serviceType: 'Subsidized_Rehab',
  capacity: 2,
  activityName: '平衡訓練',
  ...over,
})

const assignment = (over: Partial<SchedulingAssignment>): SchedulingAssignment => ({
  residentId: 'r1',
  residentName: '院友一',
  sessionId: 's1',
  staffId: 'st-a',
  pass: 1,
  ...over,
})

describe('formatSchedulingWorksheetDateLabel', () => {
  it('轉為 d/m/yyyy', () => {
    expect(formatSchedulingWorksheetDateLabel('2026-05-11')).toBe('11/5/2026')
  })
})

describe('buildStaffAssignmentWorksheetRows', () => {
  it('空指派回傳空列', () => {
    expect(buildStaffAssignmentWorksheetRows([], [])).toEqual([])
  })

  it('同一 session 聚合參與院友與小組標籤', () => {
    const rows = buildStaffAssignmentWorksheetRows(
      [
        assignment({ residentId: 'r1', residentName: '乙' }),
        assignment({ residentId: 'r2', residentName: '甲' }),
      ],
      [session({ capacity: 3 })],
    )
    expect(rows).toHaveLength(1)
    expect(rows[0]?.staffName).toBe('員工甲')
    expect(rows[0]?.dateLabel).toBe('11/5/2026')
    expect(rows[0]?.deliveryModeLabel).toBe('小組活動')
    expect(rows[0]?.activityContentLabel).toBe('平衡訓練')
    expect(rows[0]?.residentNames).toContain('甲')
    expect(rows[0]?.residentNames).toContain('乙')
  })

  it('依員工、日期、時段排序', () => {
    const rows = buildStaffAssignmentWorksheetRows(
      [
        assignment({ sessionId: 's2', residentName: 'X' }),
        assignment({ sessionId: 's1', residentName: 'Y' }),
      ],
      [
        session({ id: 's2', date: '2026-05-12', timeSlot: '09:00-10:00' }),
        session({ id: 's1', date: '2026-05-11', timeSlot: '14:00-15:00' }),
      ],
    )
    expect(rows.map((r) => r.rowKey)).toEqual(['s1', 's2'])
  })
})
