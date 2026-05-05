import type { ActivitySessionImportValidationResult } from '../../../repositories/activitySessionImportRepository'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import type {
  ActivitySessionDryRunCommitOutcome,
  ActivitySessionDryRunParseBlocked,
  ActivitySessionDryRunValidateOk,
} from './activitySessionImportDryRunFlow'

type ThrowOutcome = { kind: 'throw'; error: unknown }

/** `runActivitySessionCsvDryRun` 回傳之聯集（供狀態映射，非匯出 API）。 */
export type ActivitySessionCsvDryRunOutcome =
  | ActivitySessionDryRunParseBlocked
  | ActivitySessionDryRunValidateOk
  | ThrowOutcome

/** 將預檢 API 結果寫入 React 狀態（無副作用邏輯，僅 setter 呼叫）。 */
export type ApplyActivitySessionCsvDryRunOutcome = {
  setParseErrors: (errors: Array<{ rowIndex: number; message: string }>) => void
  setErrorMessage: (message: string) => void
  setResult: (result: ActivitySessionImportValidationResult | null) => void
  setLastRunSummary: (summary: ImportRunSummary | null) => void
  pushHistory: (summary: ImportRunSummary) => void
}

export function applyActivitySessionCsvDryRunOutcome(
  outcome: ActivitySessionCsvDryRunOutcome,
  apply: ApplyActivitySessionCsvDryRunOutcome,
): void {
  if (outcome.kind === 'parse_errors') {
    apply.setParseErrors(outcome.errors)
    apply.setErrorMessage(outcome.userMessage)
    return
  }
  if (outcome.kind === 'empty_rows') {
    apply.setErrorMessage(outcome.userMessage)
    return
  }
  if (outcome.kind === 'throw') {
    apply.setErrorMessage(
      outcome.error instanceof Error ? outcome.error.message : '預檢失敗',
    )
    return
  }
  apply.setResult(outcome.result)
  apply.setLastRunSummary(outcome.summary)
  apply.pushHistory(outcome.summary)
}

/** 將確認匯入結果寫入狀態（成功時清空預檢結果並觸發 onCommitSuccess）。 */
export type ApplyActivitySessionCsvCommitOutcome = {
  setCommitMessage: (message: string) => void
  setErrorMessage: (message: string) => void
  setResult: (result: ActivitySessionImportValidationResult | null) => void
  setLastRunSummary: (summary: ImportRunSummary | null) => void
  pushHistory: (summary: ImportRunSummary) => void
  onCommitSuccess?: () => void
}

export function applyActivitySessionCsvCommitOutcome(
  outcome: ActivitySessionDryRunCommitOutcome,
  apply: ApplyActivitySessionCsvCommitOutcome,
): void {
  apply.setLastRunSummary(outcome.summary)
  apply.pushHistory(outcome.summary)
  if (outcome.kind === 'success') {
    apply.setCommitMessage(`已成功匯入 ${outcome.summary.success} 筆活動時段資料`)
    apply.setResult(null)
    apply.onCommitSuccess?.()
    return
  }
  apply.setErrorMessage(outcome.userMessage)
}
