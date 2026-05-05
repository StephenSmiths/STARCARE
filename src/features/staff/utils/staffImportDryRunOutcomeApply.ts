import type { StaffImportValidationResult } from '../../../repositories/staffImportRepository'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import type {
  StaffDryRunParseBlocked,
  StaffDryRunValidateOk,
  StaffImportCommitOutcome,
} from './staffImportDryRunFlow'

type ThrowOutcome = { kind: 'throw'; error: unknown }

/** `runStaffCsvDryRun` 回傳聯集（僅供狀態映射）。 */
export type StaffCsvDryRunOutcome = StaffDryRunParseBlocked | StaffDryRunValidateOk | ThrowOutcome

/** 將預檢結果寫入 setter（無 React）。 */
export type ApplyStaffCsvDryRunOutcome = {
  setParseErrors: (errors: Array<{ rowIndex: number; message: string }>) => void
  setErrorMessage: (message: string) => void
  setResult: (result: StaffImportValidationResult | null) => void
  setLastRunSummary: (summary: ImportRunSummary | null) => void
  pushHistory: (summary: ImportRunSummary) => void
}

export function applyStaffCsvDryRunOutcome(
  outcome: StaffCsvDryRunOutcome,
  apply: ApplyStaffCsvDryRunOutcome,
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
      outcome.error instanceof Error ? outcome.error.message : '員工匯入預檢失敗',
    )
    return
  }
  apply.setResult(outcome.result)
  apply.setLastRunSummary(outcome.summary)
  apply.pushHistory(outcome.summary)
}

/** 將確認匯入結果寫入狀態。 */
export type ApplyStaffCsvCommitOutcome = {
  setCommitMessage: (message: string) => void
  setErrorMessage: (message: string) => void
  setResult: (result: StaffImportValidationResult | null) => void
  setLastRunSummary: (summary: ImportRunSummary | null) => void
  pushHistory: (summary: ImportRunSummary) => void
}

export function applyStaffCsvCommitOutcome(
  outcome: StaffImportCommitOutcome,
  apply: ApplyStaffCsvCommitOutcome,
): void {
  apply.setLastRunSummary(outcome.summary)
  apply.pushHistory(outcome.summary)
  if (outcome.kind === 'success') {
    apply.setCommitMessage(`已成功匯入 ${outcome.summary.success} 筆員工資料。`)
    apply.setResult(null)
    return
  }
  apply.setErrorMessage(outcome.userMessage)
}
