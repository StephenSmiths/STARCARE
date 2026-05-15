import { describe, expect, it } from 'vitest'
import { getStarcareDemoActivities } from '../../../repositories/activityRepository'
import { ACTIVITY_SESSIONS_WORKSPACE_FACILITY_ID } from '../../activitySessions/constants/activitySessionsWorkspaceDefaults'
import { WEEKLY_ROSTER_DEFAULT_CAPACITY } from '../constants/weeklyRosterImportConstants'
import {
  normalizeWeeklyRosterHm,
  parseWeeklyRosterSheetText,
  weeklyRosterDraftsToImportRows,
  type WeeklyRosterDraftRow,
} from './weeklyRosterImportParseText'

describe('normalizeWeeklyRosterHm', () => {
  it('正規化為兩位小時', () => {
    expect(normalizeWeeklyRosterHm('9:05')).toBe('09:05')
    expect(normalizeWeeklyRosterHm('23:59')).toBe('23:59')
  })
  it('無效則 null', () => {
    expect(normalizeWeeklyRosterHm('25:00')).toBe(null)
    expect(normalizeWeeklyRosterHm('9-00')).toBe(null)
  })
})

describe('parseWeeklyRosterSheetText', () => {
  const header =
    '服務類型,職位,姓名,計劃日期,計劃開始時間,計劃結束時間,負責院友範圍\n' +
    '資助復康服務,PT,王小明,2026-05-10,9:00,10:00,全院'

  it('解析有效列', () => {
    const { drafts, errors } = parseWeeklyRosterSheetText(header)
    expect(errors).toHaveLength(0)
    expect(drafts).toHaveLength(1)
    expect(drafts[0]?.displayName).toBe('王小明')
    expect(drafts[0]?.startHm).toBe('09:00')
    expect(drafts[0]?.endHm).toBe('10:00')
  })

  it('服務類型錯誤', () => {
    const bad =
      '服務類型,職位,姓名,計劃日期,計劃開始時間,計劃結束時間,負責院友範圍\n' + '未知服務,PT,王小明,2026-05-10,9:00,10:00,全院'
    const { drafts, errors } = parseWeeklyRosterSheetText(bad)
    expect(drafts).toHaveLength(0)
    expect(errors.some((e) => e.message.includes('服務類型'))).toBe(true)
  })
})

const rosterDraft = (over: Partial<WeeklyRosterDraftRow>): WeeklyRosterDraftRow => ({
  rowIndex: 2,
  serviceLabel: '資助復康服務',
  role: 'PT',
  displayName: '王小明',
  sessionDate: '2026-05-10',
  startHm: '09:00',
  endHm: '10:00',
  residentScope: '全院',
  ...over,
})

describe('weeklyRosterDraftsToImportRows（草稿＋主檔 Map→匯入列）', () => {
  it('空草稿回傳空列', () => {
    const { rows, errors } = weeklyRosterDraftsToImportRows([], new Map())
    expect(rows).toEqual([])
    expect(errors).toEqual([])
  })

  it('主檔鍵為 trim(姓名)+Tab+職位；寫入 activityId／facilityId／預設容量（有活動主檔時依目錄擇一）', async () => {
    const staffMap = new Map<string, string>([['王小明\tPT', 'staff-profile-1']])
    const activities = getStarcareDemoActivities()
    const { rows, errors } = weeklyRosterDraftsToImportRows([rosterDraft({ displayName: '  王小明  ' })], staffMap, activities)
    expect(errors).toHaveLength(0)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      facilityId: ACTIVITY_SESSIONS_WORKSPACE_FACILITY_ID,
      staffProfileId: 'staff-profile-1',
      sessionDate: '2026-05-10',
      timeSlot: '09:00-10:00',
      capacity: WEEKLY_ROSTER_DEFAULT_CAPACITY,
      startTime: '09:00',
      endTime: '10:00',
      activityDetail: '全院',
    })
    expect([
      'activity-rehab-01',
      'activity-rehab-02',
      'activity-rehab-03',
      'activity-rehab-pt-ind-1',
    ]).toContain(rows[0]?.activityId)
  })

  it('主檔無對應列時回錯誤且不產生該列', () => {
    const { rows, errors } = weeklyRosterDraftsToImportRows([rosterDraft({})], new Map())
    expect(rows).toHaveLength(0)
    expect(errors).toHaveLength(1)
    expect(errors[0]?.rowIndex).toBe(2)
    expect(errors[0]?.message).toContain('找不到')
  })
})
