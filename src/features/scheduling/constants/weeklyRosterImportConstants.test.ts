import { describe, expect, it } from 'vitest'
import {
  WEEKLY_ROSTER_DEFAULT_CAPACITY,
  WEEKLY_ROSTER_REQUIRED_HEADERS,
  WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID,
  WEEKLY_ROSTER_VALID_SERVICE_LABELS,
} from './weeklyRosterImportConstants'

describe('weeklyRosterImportConstants（週更表 CSV 契約）', () => {
  it('必填欄位七列且不重覆', () => {
    expect(WEEKLY_ROSTER_REQUIRED_HEADERS).toHaveLength(7)
    expect(new Set(WEEKLY_ROSTER_REQUIRED_HEADERS).size).toBe(7)
  })

  it('服務字面對應預設活動主檔（種子 id）', () => {
    expect(WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID['資助復康服務']).toBe('activity-rehab-01')
    expect(WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID['認知障礙症服務']).toBe('activity-dementia-01')
    expect(WEEKLY_ROSTER_VALID_SERVICE_LABELS).toEqual(['資助復康服務', '認知障礙症服務'])
  })

  it('未填容量預設值', () => {
    expect(WEEKLY_ROSTER_DEFAULT_CAPACITY).toBe(6)
  })
})
