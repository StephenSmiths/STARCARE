import { describe, expect, it } from 'vitest'
import { STARCARE_DEFAULT_FACILITY_ID } from '../../../constants/starcareDefaultFacilityId'
import type { Activity } from '../../../repositories/activityRepository'
import {
  buildActivitySessionImportRows,
  computeEndTime,
  formatRangeLabel,
  pickDefaultActivityId,
  validateWorkPlanDraftLine,
  type WorkPlanDraftLine,
} from './workPlanDraftService'

const sampleActivities: Activity[] = [
  {
    id: 'act-r',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '復康課',
    serviceType: 'Subsidized_Rehab',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 30,
  },
  {
    id: 'act-d',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    name: '認知小組',
    serviceType: 'Dementia_Care',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 45,
  },
]

describe('workPlanDraftService (Seq 14)', () => {
  it('validateWorkPlanDraftLine：拒絕無效資料', () => {
    const bad: WorkPlanDraftLine = {
      sessionDate: 'bad',
      staffProfileId: '',
      staffDisplayName: '',
      staffRoleType: 'PT',
      startTime: '',
      durationMinutes: 0,
      endTime: '',
      timeSlot: '',
      activityType: 'Individual',
      residentIds: [],
      activityContent: '',
      capacity: 0,
      serviceType: 'Subsidized_Rehab',
    }
    expect(validateWorkPlanDraftLine(bad)).toBeTruthy()
  })

  it('個別訓練強制容量與院友數量皆為 1', () => {
    const line: WorkPlanDraftLine = {
      sessionDate: '2026-05-10',
      staffProfileId: 'st-1',
      staffDisplayName: '張 PT',
      staffRoleType: 'PT',
      startTime: '09:00',
      durationMinutes: 30,
      endTime: '09:30',
      timeSlot: '09:00 - 09:30',
      activityType: 'Individual',
      residentIds: ['r-1', 'r-2'],
      activityContent: '肌力訓練',
      capacity: 2,
      serviceType: 'Subsidized_Rehab',
    }
    expect(validateWorkPlanDraftLine(line)).toContain('個別訓練')
  })

  it('pickDefaultActivityId：依服務類型挑選', () => {
    expect(pickDefaultActivityId(sampleActivities, 'Subsidized_Rehab', 'Group')).toBe('act-r')
    expect(pickDefaultActivityId(sampleActivities, 'Dementia_Care', 'Group')).toBe('act-d')
  })

  it('buildActivitySessionImportRows：輸出匯入列', () => {
    const lines: WorkPlanDraftLine[] = [
      {
        sessionDate: '2026-05-10',
        staffProfileId: 'st-1',
        staffDisplayName: '張 PT',
        staffRoleType: 'PT',
        startTime: '09:00',
        durationMinutes: 60,
        endTime: '10:00',
        timeSlot: '09:00 - 10:00',
        activityType: 'Group',
        residentIds: ['r-1', 'r-2'],
        activityContent: '主動伸展',
        capacity: 2,
        serviceType: 'Subsidized_Rehab',
      },
    ]
    const out = buildActivitySessionImportRows(lines, sampleActivities, STARCARE_DEFAULT_FACILITY_ID)
    expect(out.ok).toBe(true)
    if (!out.ok) return
    expect(out.rows[0]).toMatchObject({
      facilityId: STARCARE_DEFAULT_FACILITY_ID,
      activityId: 'act-r',
      staffProfileId: 'st-1',
      sessionDate: '2026-05-10',
    })
    expect(out.rows[0]?.sessionDate).toBe('2026-05-10')
  })

  it('computeEndTime：計算結束時間與區間字串', () => {
    expect(computeEndTime('09:00', 90)).toBe('10:30')
    expect(formatRangeLabel('09:00', '10:30')).toBe('09:00 - 10:30')
  })
})
