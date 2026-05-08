import { activitySessionImportService } from '../../../services/activitySessionImportService'
import type {
  ActivitySessionImportPreviewRow,
  ActivitySessionImportRow,
  ActivitySessionImportValidationResult,
} from '../../../repositories/activitySessionImportRepository'
import {
  buildCsvImportCommitFailureSummary,
  buildCsvImportCommitSuccessSummary,
  buildCsvImportDryRunSummary,
} from '../../shared/csvImportRunSummary'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import { parseActivitySessionCsv } from './activitySessionCsvParser'

/** CSV 解析後無可用列（業務提示：請確認檔案內容）。 */
export type ActivitySessionDryRunParseBlocked =
  | { kind: 'parse_errors'; errors: Array<{ rowIndex: number; message: string }>; userMessage: string }
  | { kind: 'empty_rows'; userMessage: string }

export type ActivitySessionDryRunValidateOk = {
  kind: 'validated'
  result: ActivitySessionImportValidationResult
  summary: ImportRunSummary
}

/** 活動時段列預檢（已解析為 `ActivitySessionImportRow`；不含 React 狀態）。 */
export async function runActivitySessionRowsDryRun(
  rows: ActivitySessionImportRow[],
  startedAt: number,
): Promise<ActivitySessionDryRunParseBlocked | ActivitySessionDryRunValidateOk | { kind: 'throw'; error: unknown }> {
  if (rows.length === 0) {
    return { kind: 'empty_rows', userMessage: '沒有可用資料列' }
  }
  try {
    const response = await activitySessionImportService.validateRows(rows)
    const ranAt = new Date().toISOString()
    const summary = buildCsvImportDryRunSummary(response.summary, Date.now() - startedAt, ranAt)
    return { kind: 'validated', result: response, summary }
  } catch (error) {
    return { kind: 'throw', error }
  }
}

/** 活動時段 CSV 預檢（不含 React 狀態）；對齊 PDF 防重覆提交語意由呼叫端鎖控制。 */
export async function runActivitySessionCsvDryRun(
  csvText: string,
): Promise<ActivitySessionDryRunParseBlocked | ActivitySessionDryRunValidateOk | { kind: 'throw'; error: unknown }> {
  const startedAt = Date.now()
  const parsed = parseActivitySessionCsv(csvText)
  if (parsed.errors.length > 0) {
    return {
      kind: 'parse_errors',
      errors: parsed.errors,
      userMessage: 'CSV 內容有格式錯誤，請先修正後再進行預檢',
    }
  }
  if (parsed.rows.length === 0) {
    return { kind: 'empty_rows', userMessage: 'CSV 沒有可用資料列' }
  }
  return runActivitySessionRowsDryRun(parsed.rows, startedAt)
}

export type ActivitySessionDryRunCommitOutcome =
  | { kind: 'success'; summary: ImportRunSummary }
  | { kind: 'failure'; summary: ImportRunSummary; userMessage: string }

/** 將預檢通過之列落庫；錯誤時回傳摘要供歷史記錄，不拋出（由 outcome.userMessage 呈現）。 */
export async function commitActivitySessionCsvPreview(
  actorId: string,
  preview: ActivitySessionImportPreviewRow[],
): Promise<ActivitySessionDryRunCommitOutcome> {
  const startedAt = Date.now()
  const total = preview.length
  const ranAt = new Date().toISOString()
  try {
    const committed = await activitySessionImportService.commitRows(actorId, preview)
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
      userMessage: error instanceof Error ? error.message : '匯入失敗',
    }
  }
}
