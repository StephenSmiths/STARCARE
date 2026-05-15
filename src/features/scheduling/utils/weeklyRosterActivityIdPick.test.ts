import { describe, expect, it } from 'vitest'
import type { Activity } from '../../../repositories/activityRepository'
import { pickWeeklyRosterActivityId, weeklyRosterActivityPickHash } from './weeklyRosterActivityIdPick'

const fac = 'facility-main'
const ptGroup = (id: string, name: string): Activity => ({
  id,
  facilityId: fac,
  name,
  serviceType: 'Subsidized_Rehab',
  activityKind: 'Training',
  deliveryMode: 'Group',
  minDurationMinutes: 30,
})

describe('weeklyRosterActivityPickHash', () => {
  it('同 key 同 modulo 結果穩定', () => {
    expect(weeklyRosterActivityPickHash('a|b|1', 3)).toBe(weeklyRosterActivityPickHash('a|b|1', 3))
  })
})

describe('pickWeeklyRosterActivityId', () => {
  const acts: Activity[] = [
    ptGroup('activity-rehab-01', '下肢肌力訓練'),
    ptGroup('activity-rehab-02', '平衡訓練'),
    ptGroup('activity-rehab-03', '主動伸展'),
    {
      id: 'activity-rehab-pt-ind-1',
      facilityId: fac,
      name: '肌力訓練',
      serviceType: 'Subsidized_Rehab',
      activityKind: 'Training',
      deliveryMode: 'Individual',
      minDurationMinutes: 15,
    },
  ]

  it('PT＋資助復康：自目錄候選（含個別／小組）擇一 id', () => {
    const id = pickWeeklyRosterActivityId('資助復康服務', 'PT', 'sp-1', '2026-05-10', 2, acts)
    expect(['activity-rehab-01', 'activity-rehab-02', 'activity-rehab-03', 'activity-rehab-pt-ind-1']).toContain(id)
  })

  it('無候選時回落 WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID', () => {
    const id = pickWeeklyRosterActivityId('資助復康服務', 'PT', 'sp-1', '2026-05-10', 2, [])
    expect(id).toBe('activity-rehab-01')
  })
})
