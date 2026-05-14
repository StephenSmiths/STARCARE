/** PDF 02【3】：週更表→活動時段預檢編排（Seq 15；歧義、主檔對照、委派預檢與 catch）。 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { StaffProfileListRow } from '../../../repositories/staffProfilesListRepository'
import type { WeeklyRosterDraftRow } from './weeklyRosterImportParseText'
import type { ActivitySessionDryRunValidateOk } from '../../activitySessions/utils/activitySessionImportDryRunFlow'
import { runWeeklyRosterActivityImportDryRun } from './runWeeklyRosterActivityImportDryRun'

vi.mock('./weeklyRosterImportParseText', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./weeklyRosterImportParseText')>()
  return { ...actual, parseWeeklyRosterSheetText: vi.fn() }
})

vi.mock('../../../repositories/staffProfilesListRepository', () => ({
  createStaffProfilesListRepository: vi.fn(),
}))

vi.mock('../../activitySessions/utils/activitySessionImportDryRunFlow', () => ({
  runActivitySessionRowsDryRun: vi.fn(),
}))

import { createStaffProfilesListRepository } from '../../../repositories/staffProfilesListRepository'
import { parseWeeklyRosterSheetText } from './weeklyRosterImportParseText'
import { runActivitySessionRowsDryRun } from '../../activitySessions/utils/activitySessionImportDryRunFlow'

const FAC = 'fac-1'
const baseDraft = (o: Partial<WeeklyRosterDraftRow>): WeeklyRosterDraftRow => ({
  rowIndex: 1,
  serviceLabel: '資助復康服務',
  role: 'PT',
  displayName: '王小明',
  sessionDate: '2026-05-10',
  startHm: '09:00',
  endHm: '10:00',
  residentScope: '全院',
  ...o,
})
const staffPt = (id: string, displayName = '王小明'): StaffProfileListRow => ({
  id,
  facilityId: FAC,
  displayName,
  roleType: 'PT',
  serviceScope: 'Subsidized_Rehab',
})

describe('runWeeklyRosterActivityImportDryRun', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('parse 有錯誤時回 parse_errors 固定 userMessage', async () => {
    vi.mocked(parseWeeklyRosterSheetText).mockReturnValue({
      drafts: [],
      errors: [{ rowIndex: 3, message: '表頭錯誤' }],
    })
    const r = await runWeeklyRosterActivityImportDryRun('csv', FAC)
    expect(r).toEqual({
      kind: 'parse_errors',
      errors: [{ rowIndex: 3, message: '表頭錯誤' }],
      userMessage: '週更表內容有格式錯誤，請先修正後再進行預檢',
    })
    expect(createStaffProfilesListRepository).not.toHaveBeenCalled()
  })

  it('parse 無錯誤但無草稿時回 empty_rows', async () => {
    vi.mocked(parseWeeklyRosterSheetText).mockReturnValue({ drafts: [], errors: [] })
    const r = await runWeeklyRosterActivityImportDryRun('csv', FAC)
    expect(r).toEqual({ kind: 'empty_rows', userMessage: '週更表沒有可用資料列' })
  })

  it('載入員工主檔失敗時回 throw', async () => {
    vi.mocked(parseWeeklyRosterSheetText).mockReturnValue({
      drafts: [baseDraft({ rowIndex: 2 })],
      errors: [],
    })
    vi.mocked(createStaffProfilesListRepository).mockReturnValue({
      listStaffProfiles: vi.fn().mockRejectedValue(new Error('主檔載入失敗')),
    })
    const r = await runWeeklyRosterActivityImportDryRun('csv', FAC)
    expect(r).toEqual({ kind: 'throw', error: expect.any(Error) })
    expect((r as { kind: 'throw'; error: Error }).error.message).toBe('主檔載入失敗')
  })

  it('同姓名同職位主檔多筆時回 parse_errors（歧義）', async () => {
    vi.mocked(parseWeeklyRosterSheetText).mockReturnValue({
      drafts: [baseDraft({ rowIndex: 5 })],
      errors: [],
    })
    vi.mocked(createStaffProfilesListRepository).mockReturnValue({
      listStaffProfiles: vi.fn().mockResolvedValue([staffPt('sp-a'), staffPt('sp-b')]),
    })
    const r = await runWeeklyRosterActivityImportDryRun('csv', FAC)
    expect(r).toEqual({
      kind: 'parse_errors',
      errors: [
        {
          rowIndex: 5,
          message: '員工主檔重覆：同姓名與職位在系統中有多筆，請先整理主檔',
        },
      ],
      userMessage: '員工主檔資料有歧義，無法匯入週更表',
    })
    expect(runActivitySessionRowsDryRun).not.toHaveBeenCalled()
  })

  it('草稿與主檔對照失敗時回 parse_errors（weeklyRosterDraftsToImportRows）', async () => {
    vi.mocked(parseWeeklyRosterSheetText).mockReturnValue({
      drafts: [baseDraft({ rowIndex: 7, displayName: '查無此人' })],
      errors: [],
    })
    vi.mocked(createStaffProfilesListRepository).mockReturnValue({
      listStaffProfiles: vi.fn().mockResolvedValue([staffPt('sp-1')]),
    })
    const r = await runWeeklyRosterActivityImportDryRun('csv', FAC)
    expect(r).toMatchObject({
      kind: 'parse_errors',
      userMessage: '週更表與員工主檔對照有誤，請修正後再預檢',
    })
    expect((r as { kind: 'parse_errors'; errors: { rowIndex: number; message: string }[] }).errors[0]).toMatchObject({
      rowIndex: 7,
      message: expect.stringContaining('查無此人'),
    })
    expect(runActivitySessionRowsDryRun).not.toHaveBeenCalled()
  })

  it('對照成功時委派 runActivitySessionRowsDryRun', async () => {
    vi.mocked(parseWeeklyRosterSheetText).mockReturnValue({ drafts: [baseDraft({})], errors: [] })
    vi.mocked(createStaffProfilesListRepository).mockReturnValue({
      listStaffProfiles: vi.fn().mockResolvedValue([staffPt('sp-1')]),
    })
    const validated: ActivitySessionDryRunValidateOk = {
      kind: 'validated',
      result: { ok: true, summary: { total: 1, valid: 1, invalid: 0 }, errors: [], preview: [] },
      summary: {
        stage: 'dry-run',
        total: 1,
        success: 1,
        failed: 0,
        durationMs: 12,
        ranAt: '2026-05-09T12:00:00.000Z',
      },
    }
    vi.mocked(runActivitySessionRowsDryRun).mockResolvedValue(validated)
    const r = await runWeeklyRosterActivityImportDryRun('csv', FAC)
    expect(r).toEqual(validated)
    expect(runActivitySessionRowsDryRun).toHaveBeenCalledTimes(1)
    const [rows, startedAt] = vi.mocked(runActivitySessionRowsDryRun).mock.calls[0]!
    expect(startedAt).toEqual(expect.any(Number))
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      staffProfileId: 'sp-1',
      activityId: 'activity-rehab-01',
      sessionDate: '2026-05-10',
      timeSlot: '09:00-10:00',
    })
  })
})
