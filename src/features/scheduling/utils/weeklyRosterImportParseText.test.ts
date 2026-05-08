import { describe, expect, it } from 'vitest'
import { normalizeWeeklyRosterHm, parseWeeklyRosterSheetText } from './weeklyRosterImportParseText'

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
