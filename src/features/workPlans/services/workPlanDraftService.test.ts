import { describe, expect, it } from 'vitest'
import type { Activity } from '../../../repositories/activityRepository'
import {
  buildActivitySessionImportRows,
  pickDefaultActivityId,
  validateWorkPlanDraftLine,
  type WorkPlanDraftLine,
} from './workPlanDraftService'

const sampleActivities: Activity[] = [
  {
    id: 'act-r',
    facilityId: 'facility-main',
    name: '復康課',
    serviceType: 'Subsidized_Rehab',
    activityKind: 'Training',
    deliveryMode: 'Group',
    minDurationMinutes: 30,
  },
  {
    id: 'act-d',
    facilityId: 'facility-main',
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
      timeSlot: '',
      capacity: 0,
      serviceType: 'Subsidized_Rehab',
    }
    expect(validateWorkPlanDraftLine(bad)).toBeTruthy()
  })

  it('pickDefaultActivityId：依服務類型挑選', () => {
    expect(pickDefaultActivityId(sampleActivities, 'Subsidized_Rehab')).toBe('act-r')
    expect(pickDefaultActivityId(sampleActivities, 'Dementia_Care')).toBe('act-d')
  })

  it('buildActivitySessionImportRows：輸出匯入列', () => {
    const lines: WorkPlanDraftLine[] = [
      {
        sessionDate: '2026-05-10',
        staffProfileId: 'st-1',
        staffDisplayName: '張 PT',
        timeSlot: '09:00',
        capacity: 2,
        serviceType: 'Subsidized_Rehab',
      },
    ]
    const out = buildActivitySessionImportRows(lines, sampleActivities, 'facility-main')
    expect(out.ok).toBe(true)
    if (!out.ok) return
    expect(out.rows[0]).toMatchObject({
      facilityId: 'facility-main',
      activityId: 'act-r',
      staffProfileId: 'st-1',
      sessionDate: '2026-05-10',
    })
    expect(out.rows[0]?.sessionDate).toBe('2026-05-10')
  })
})
