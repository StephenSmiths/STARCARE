import type {
  ResidentImportPreviewRow,
  ResidentImportValidationResult,
} from '../../../repositories/residentImportRepository'
import { residentImportService } from '../../../services/residentImportService'
import {
  buildCsvImportCommitFailureSummary,
  buildCsvImportCommitSuccessSummary,
  buildCsvImportDryRunSummary,
} from '../../shared/csvImportRunSummary'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import { parseResidentCsv } from './residentCsvParser'

/** CSV 解析後無可用列（業務提示：請確認檔案內容）。 */
export type ResidentDryRunParseBlocked =
  | { kind: 'parse_errors'; errors: Array<{ rowIndex: number; message: string }>; userMessage: string }
  | { kind: 'empty_rows'; userMessage: string }

export type ResidentDryRunValidateOk = {
  kind: 'validated'
  result: ResidentImportValidationResult
  summary: ImportRunSummary
}

/** 院友 CSV 預檢（不含 React）；防重覆提交由呼叫端鎖控制。 */
export async function runResidentCsvDryRun(
  csvText: string,
): Promise<ResidentDryRunParseBlocked | ResidentDryRunValidateOk | { kind: 'throw'; error: unknown }> {
  const startedAt = Date.now()
  const parsed = parseResidentCsv(csvText)
  if (parsed.errors.length > 0) {
    return {
      kind: 'parse_errors',
      errors: parsed.errors,
      userMessage: 'CSV 內容有格式錯誤，請先修正後再進行預檢',
    }
  }
  if (parsed.rows.length === 0) {
    return { kind: 'empty_rows', userMessage: 'CSV 沒有可預檢資料列' }
  }
  try {
    const validated = await residentImportService.validateRows(parsed.rows)
    const ranAt = new Date().toISOString()
    const summary = buildCsvImportDryRunSummary(validated.summary, Date.now() - startedAt, ranAt)
    return { kind: 'validated', result: validated, summary }
  } catch (error) {
    return { kind: 'throw', error }
  }
}

export type ResidentImportCommitOutcome =
  | { kind: 'success'; summary: ImportRunSummary }
  | { kind: 'failure'; summary: ImportRunSummary; userMessage: string }

/** 將預檢通過之列落庫；失敗時仍回傳摘要供歷史記錄。 */
export async function commitResidentCsvPreview(
  actorId: string,
  preview: ResidentImportPreviewRow[],
): Promise<ResidentImportCommitOutcome> {
  const startedAt = Date.now()
  const total = preview.length
  const ranAt = new Date().toISOString()
  try {
    const committed = await residentImportService.commitRows(actorId, preview)
    const summary = buildCsvImportCommitSuccessSummary(
      total,
      committed.inserted,
      Date.now() - startedAt,
      ranAt,
    )
    return { kind: 'success', summary }
  } catch (error) {
    const summary = buildCsvImportCommitFailureSummary(total, Date.now() - startedAt, ranAt)
    return {
      kind: 'failure',
      summary,
      userMessage: error instanceof Error ? error.message : '批量匯入失敗',
    }
  }
}
