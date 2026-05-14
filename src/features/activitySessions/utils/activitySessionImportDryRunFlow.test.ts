/** PDF 02【3】：活動時段預檢／提交編排（與週更表預檢共用 **`runActivitySessionRowsDryRun`**；Seq 15 關聯鏈）。 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  ActivitySessionImportPreviewRow,
  ActivitySessionImportRow,
} from '../../../repositories/activitySessionImportRepository'

vi.mock('../../../services/activitySessionImportService', () => ({
  activitySessionImportService: {
    validateRows: vi.fn(),
    commitRows: vi.fn(),
  },
}))

vi.mock('./activitySessionCsvParser', () => ({
  parseActivitySessionCsv: vi.fn(),
}))

import { activitySessionImportService } from '../../../services/activitySessionImportService'
import { parseActivitySessionCsv } from './activitySessionCsvParser'
import {
  commitActivitySessionCsvPreview,
  runActivitySessionCsvDryRun,
  runActivitySessionRowsDryRun,
} from './activitySessionImportDryRunFlow'

const importRow = (): ActivitySessionImportRow => ({
  activityId: 'activity-rehab-01',
  staffProfileId: 'sp-1',
  sessionDate: '2026-05-10',
  timeSlot: '09:00-10:00',
  capacity: 6,
  startTime: '09:00',
  endTime: '10:00',
  activityDetail: '全院',
})

const validationOk = () => ({
  ok: true,
  summary: { total: 1, valid: 1, invalid: 0 },
  errors: [] as Array<{ rowIndex: number; field: string; message: string }>,
  preview: [] as ActivitySessionImportPreviewRow[],
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('runActivitySessionRowsDryRun', () => {
  it('rows 為空時回 empty_rows', async () => {
    const r = await runActivitySessionRowsDryRun([], Date.now())
    expect(r).toEqual({ kind: 'empty_rows', userMessage: '沒有可用資料列' })
    expect(activitySessionImportService.validateRows).not.toHaveBeenCalled()
  })

  it('validateRows 成功時回 validated 與摘要', async () => {
    vi.mocked(activitySessionImportService.validateRows).mockResolvedValue(validationOk())
    const r = await runActivitySessionRowsDryRun([importRow()], Date.now())
    expect(r).toMatchObject({
      kind: 'validated',
      result: validationOk(),
      summary: { stage: 'dry-run', total: 1, success: 1, failed: 0 },
    })
  })

  it('validateRows 拋錯時回 throw', async () => {
    vi.mocked(activitySessionImportService.validateRows).mockRejectedValue(new Error('edge 失敗'))
    const r = await runActivitySessionRowsDryRun([importRow()], Date.now())
    expect(r).toEqual({ kind: 'throw', error: expect.any(Error) })
    expect((r as { kind: 'throw'; error: Error }).error.message).toBe('edge 失敗')
  })
})

describe('runActivitySessionCsvDryRun', () => {
  it('parse 有錯誤時回 parse_errors 固定 userMessage', async () => {
    vi.mocked(parseActivitySessionCsv).mockReturnValue({
      rows: [],
      errors: [{ rowIndex: 2, message: '缺欄位' }],
    })
    const r = await runActivitySessionCsvDryRun('x')
    expect(r).toEqual({
      kind: 'parse_errors',
      errors: [{ rowIndex: 2, message: '缺欄位' }],
      userMessage: 'CSV 內容有格式錯誤，請先修正後再進行預檢',
    })
    expect(activitySessionImportService.validateRows).not.toHaveBeenCalled()
  })

  it('parse 無錯誤但無列時回 empty_rows', async () => {
    vi.mocked(parseActivitySessionCsv).mockReturnValue({ rows: [], errors: [] })
    const r = await runActivitySessionCsvDryRun('h\n')
    expect(r).toEqual({ kind: 'empty_rows', userMessage: 'CSV 沒有可用資料列' })
  })

  it('有列時委派 runActivitySessionRowsDryRun', async () => {
    const rows = [importRow()]
    vi.mocked(parseActivitySessionCsv).mockReturnValue({ rows, errors: [] })
    vi.mocked(activitySessionImportService.validateRows).mockResolvedValue(validationOk())
    const r = await runActivitySessionCsvDryRun('csv')
    expect(r).toMatchObject({ kind: 'validated' })
    expect(activitySessionImportService.validateRows).toHaveBeenCalledWith(rows)
  })
})

describe('commitActivitySessionCsvPreview', () => {
  const preview: ActivitySessionImportPreviewRow[] = [
    {
      facility_id: 'fac-1',
      activity_id: 'a1',
      staff_profile_id: 's1',
      session_date: '2026-05-10',
      time_slot: '09:00-10:00',
      capacity: 6,
    },
  ]

  it('commitRows 成功時回 success 與摘要', async () => {
    vi.mocked(activitySessionImportService.commitRows).mockResolvedValue({
      ok: true,
      inserted: 1,
      actorId: 'actor-1',
      sessionIds: ['sess-1'],
    })
    const r = await commitActivitySessionCsvPreview('actor-1', preview)
    expect(r.kind).toBe('success')
    if (r.kind === 'success') {
      expect(r.summary).toMatchObject({ stage: 'commit', total: 1, success: 1, failed: 0 })
    }
    expect(activitySessionImportService.commitRows).toHaveBeenCalledWith('actor-1', preview)
  })

  it('commitRows 非 Error 失敗時 userMessage 為固定句', async () => {
    vi.mocked(activitySessionImportService.commitRows).mockRejectedValue('offline')
    const r = await commitActivitySessionCsvPreview('actor-1', preview)
    expect(r.kind).toBe('failure')
    if (r.kind === 'failure') {
      expect(r.userMessage).toBe('匯入失敗')
      expect(r.summary).toMatchObject({ stage: 'commit', total: 1, success: 0, failed: 1 })
    }
  })

  it('commitRows 拋出 Error 時 userMessage 為錯誤訊息', async () => {
    vi.mocked(activitySessionImportService.commitRows).mockRejectedValue(new Error('RLS 阻擋'))
    const r = await commitActivitySessionCsvPreview('actor-1', preview)
    expect(r.kind).toBe('failure')
    if (r.kind === 'failure') {
      expect(r.userMessage).toBe('RLS 阻擋')
      expect(r.summary).toMatchObject({ stage: 'commit', total: 1, success: 0, failed: 1 })
    }
  })
})
