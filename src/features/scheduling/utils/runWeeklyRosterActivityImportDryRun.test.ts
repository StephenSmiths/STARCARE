/** PDF 02【3】：週更表→活動時段預檢編排（Seq 15；parse 早退與 catch）。 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { WeeklyRosterDraftRow } from './weeklyRosterImportParseText'
import { runWeeklyRosterActivityImportDryRun } from './runWeeklyRosterActivityImportDryRun'

vi.mock('./weeklyRosterImportParseText', () => ({
  parseWeeklyRosterSheetText: vi.fn(),
}))

vi.mock('../../../repositories/staffProfilesListRepository', () => ({
  createStaffProfilesListRepository: vi.fn(),
}))

import { createStaffProfilesListRepository } from '../../../repositories/staffProfilesListRepository'
import { parseWeeklyRosterSheetText } from './weeklyRosterImportParseText'

describe('runWeeklyRosterActivityImportDryRun', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('parse 有錯誤時回 parse_errors 固定 userMessage', async () => {
    vi.mocked(parseWeeklyRosterSheetText).mockReturnValue({
      drafts: [],
      errors: [{ rowIndex: 3, message: '表頭錯誤' }],
    })
    const r = await runWeeklyRosterActivityImportDryRun('csv', 'fac-1')
    expect(r).toEqual({
      kind: 'parse_errors',
      errors: [{ rowIndex: 3, message: '表頭錯誤' }],
      userMessage: '週更表內容有格式錯誤，請先修正後再進行預檢',
    })
    expect(createStaffProfilesListRepository).not.toHaveBeenCalled()
  })

  it('parse 無錯誤但無草稿時回 empty_rows', async () => {
    vi.mocked(parseWeeklyRosterSheetText).mockReturnValue({ drafts: [], errors: [] })
    const r = await runWeeklyRosterActivityImportDryRun('csv', 'fac-1')
    expect(r).toEqual({ kind: 'empty_rows', userMessage: '週更表沒有可用資料列' })
  })

  it('載入員工主檔失敗時回 throw', async () => {
    const draft: WeeklyRosterDraftRow = {
      rowIndex: 2,
      serviceLabel: '資助復康服務',
      role: 'PT',
      displayName: '王小明',
      sessionDate: '2026-05-10',
      startHm: '09:00',
      endHm: '10:00',
      residentScope: '全院',
    }
    vi.mocked(parseWeeklyRosterSheetText).mockReturnValue({ drafts: [draft], errors: [] })
    vi.mocked(createStaffProfilesListRepository).mockReturnValue({
      listStaffProfiles: vi.fn().mockRejectedValue(new Error('主檔載入失敗')),
    })
    const r = await runWeeklyRosterActivityImportDryRun('csv', 'fac-1')
    expect(r).toEqual({ kind: 'throw', error: expect.any(Error) })
    expect((r as { kind: 'throw'; error: Error }).error.message).toBe('主檔載入失敗')
  })
})
