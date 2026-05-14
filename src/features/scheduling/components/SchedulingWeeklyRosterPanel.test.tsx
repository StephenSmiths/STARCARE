/** @vitest-environment happy-dom */
/** PDF 02【3】：週更表匯入面板（Seq 15；`useActivitySessionImportDryRun` 窄 mock）。 */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../auth', () => ({
  useAuthActorId: vi.fn(() => 'actor-roster'),
}))

vi.mock('../../activitySessions/hooks/useActivitySessionImportDryRun', () => ({
  useActivitySessionImportDryRun: vi.fn(),
}))

vi.mock('../../staff/utils/parseStaffImportFile', () => ({
  parseStaffImportFileToCsvText: vi.fn(),
}))

import { useActivitySessionImportDryRun } from '../../activitySessions/hooks/useActivitySessionImportDryRun'
import { parseStaffImportFileToCsvText } from '../../staff/utils/parseStaffImportFile'
import { SchedulingWeeklyRosterPanel } from './SchedulingWeeklyRosterPanel'

const dryRunDefaults = () => ({
  isBusy: false,
  errorMessage: '',
  parseErrors: [] as { rowIndex: number; message: string }[],
  result: null as {
    summary: { total: number; valid: number; invalid: number }
    errors: { rowIndex: number; field: string; message: string }[]
    preview: unknown[]
  } | null,
  commitMessage: '',
  lastRunSummary: null,
  runHistory: [],
  validateCsvText: vi.fn(),
  validateWeeklyRosterSheetText: vi.fn(),
  commitValidatedRows: vi.fn(),
  reset: vi.fn(),
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('SchedulingWeeklyRosterPanel', () => {
  beforeEach(() => {
    vi.mocked(useActivitySessionImportDryRun).mockReturnValue(dryRunDefaults() as ReturnType<
      typeof useActivitySessionImportDryRun
    >)
  })

  it('標題與範本下載連結', () => {
    render(<SchedulingWeeklyRosterPanel />)
    expect(screen.getByRole('heading', { name: /導入週更表/ })).toBeInstanceOf(HTMLElement)
    const link = screen.getByRole('link', { name: '下載 Excel 範本' }) as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('/scheduling-weekly-roster-import-template.xlsx')
  })

  it('isBusy 時顯示處理中且檔案欄 disabled', () => {
    vi.mocked(useActivitySessionImportDryRun).mockReturnValue({
      ...dryRunDefaults(),
      isBusy: true,
    } as ReturnType<typeof useActivitySessionImportDryRun>)
    render(<SchedulingWeeklyRosterPanel />)
    expect(screen.getByText('處理中…')).toBeInstanceOf(HTMLElement)
    expect((document.querySelector('input[type="file"]') as HTMLInputElement).disabled).toBe(true)
  })

  it('errorMessage 與 parseErrors 可見', () => {
    vi.mocked(useActivitySessionImportDryRun).mockReturnValue({
      ...dryRunDefaults(),
      errorMessage: '讀檔失敗',
      parseErrors: [{ rowIndex: 2, message: '缺欄位' }],
    } as ReturnType<typeof useActivitySessionImportDryRun>)
    render(<SchedulingWeeklyRosterPanel />)
    expect(screen.getByText('讀檔失敗')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/第 2 行：缺欄位/)).toBeInstanceOf(HTMLElement)
  })

  it('預檢錯誤超過 15 筆可展開／收合', () => {
    const errors = Array.from({ length: 16 }, (_, i) => ({
      rowIndex: i + 1,
      field: 'f',
      message: `錯${i}`,
    }))
    vi.mocked(useActivitySessionImportDryRun).mockReturnValue({
      ...dryRunDefaults(),
      result: {
        summary: { total: 16, valid: 0, invalid: 16 },
        errors,
        preview: [],
      },
    } as ReturnType<typeof useActivitySessionImportDryRun>)
    render(<SchedulingWeeklyRosterPanel />)
    expect(screen.getByText(/顯示全部錯誤（16）/)).toBeInstanceOf(HTMLElement)
    fireEvent.click(screen.getByRole('button', { name: /顯示全部錯誤/ }))
    expect(screen.getByRole('button', { name: '收合' })).toBeInstanceOf(HTMLElement)
  })

  it('預檢無錯誤且有 preview 時可確認匯入', () => {
    const commitValidatedRows = vi.fn()
    vi.mocked(useActivitySessionImportDryRun).mockReturnValue({
      ...dryRunDefaults(),
      result: {
        summary: { total: 1, valid: 1, invalid: 0 },
        errors: [],
        preview: [{ stub: true }],
      },
      commitValidatedRows,
    } as ReturnType<typeof useActivitySessionImportDryRun>)
    render(<SchedulingWeeklyRosterPanel />)
    fireEvent.click(screen.getByRole('button', { name: '確認匯入（寫入時段）' }))
    expect(commitValidatedRows).toHaveBeenCalledWith('actor-roster')
  })

  it('commitMessage 顯示成功句', () => {
    vi.mocked(useActivitySessionImportDryRun).mockReturnValue({
      ...dryRunDefaults(),
      commitMessage: '匯入完成',
    } as ReturnType<typeof useActivitySessionImportDryRun>)
    render(<SchedulingWeeklyRosterPanel />)
    expect(screen.getByText('匯入完成')).toBeInstanceOf(HTMLElement)
  })

  it('選檔後以 CSV 文字觸發 validateWeeklyRosterSheetText', async () => {
    const validateWeeklyRosterSheetText = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useActivitySessionImportDryRun).mockReturnValue({
      ...dryRunDefaults(),
      validateWeeklyRosterSheetText,
    } as ReturnType<typeof useActivitySessionImportDryRun>)
    vi.mocked(parseStaffImportFileToCsvText).mockResolvedValue('sheet-csv')
    render(<SchedulingWeeklyRosterPanel />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'week.csv', { type: 'text/csv' })
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => {
      expect(parseStaffImportFileToCsvText).toHaveBeenCalled()
      expect(validateWeeklyRosterSheetText).toHaveBeenCalledWith('sheet-csv')
    })
  })
})
