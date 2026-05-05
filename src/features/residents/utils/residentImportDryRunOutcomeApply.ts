import type { ResidentImportValidationResult } from '../../../repositories/residentImportRepository'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import type {
  ResidentDryRunParseBlocked,
  ResidentDryRunValidateOk,
  ResidentImportCommitOutcome,
} from './residentImportDryRunFlow'

type ThrowOutcome = { kind: 'throw'; error: unknown }

/** `runResidentCsvDryRun` 回傳聯集（僅供狀態映射）。 */
export type ResidentCsvDryRunOutcome =
  | ResidentDryRunParseBlocked
  | ResidentDryRunValidateOk
  | ThrowOutcome

/** 將預檢結果寫入 setter（無 React）。 */
export type ApplyResidentCsvDryRunOutcome = {
  setParseErrors: (errors: Array<{ rowIndex: number; message: string }>) => void
  setErrorMessage: (message: string) => void
  setResult: (result: ResidentImportValidationResult | null) => void
  setLastRunSummary: (summary: ImportRunSummary | null) => void
  pushHistory: (summary: ImportRunSummary) => void
}

export function applyResidentCsvDryRunOutcome(
  outcome: ResidentCsvDryRunOutcome,
  apply: ApplyResidentCsvDryRunOutcome,
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
    apply.setErrorMessage(outcome.error instanceof Error ? outcome.error.message : '匯入預檢失敗')
    return
  }
  apply.setResult(outcome.result)
  apply.setLastRunSummary(outcome.summary)
  apply.pushHistory(outcome.summary)
}

/** 將確認匯入結果寫入狀態。 */
export type ApplyResidentCsvCommitOutcome = {
  setCommitMessage: (message: string) => void
  setErrorMessage: (message: string) => void
  setResult: (result: ResidentImportValidationResult | null) => void
  setLastRunSummary: (summary: ImportRunSummary | null) => void
  pushHistory: (summary: ImportRunSummary) => void
}

export function applyResidentCsvCommitOutcome(
  outcome: ResidentImportCommitOutcome,
  apply: ApplyResidentCsvCommitOutcome,
): void {
  apply.setLastRunSummary(outcome.summary)
  apply.pushHistory(outcome.summary)
  if (outcome.kind === 'success') {
    apply.setCommitMessage(`已成功匯入 ${outcome.summary.success} 筆院友資料。`)
    apply.setResult(null)
    return
  }
  apply.setErrorMessage(outcome.userMessage)
}
