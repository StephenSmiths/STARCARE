import type { ImportRunSummary } from './importRunSummary'

/** CSV 批量匯入：最近執行紀錄上限（PDF 03 可追溯／簡報） */
export const IMPORT_RUN_HISTORY_CAP = 10

export type CsvImportValidationSummary = { total: number; valid: number; invalid: number }

/** 預檢完成後摘要（對齊 repository summary.total／valid／invalid） */
export const buildCsvImportDryRunSummary = (
  summary: CsvImportValidationSummary,
  durationMs: number,
  ranAtIso: string,
): ImportRunSummary => ({
  stage: 'dry-run',
  total: summary.total,
  success: summary.valid,
  failed: summary.invalid,
  durationMs,
  ranAt: ranAtIso,
})

/** 提交成功：success = 寫入筆數 */
export const buildCsvImportCommitSuccessSummary = (
  total: number,
  inserted: number,
  durationMs: number,
  ranAtIso: string,
): ImportRunSummary => ({
  stage: 'commit',
  total,
  success: inserted,
  failed: Math.max(0, total - inserted),
  durationMs,
  ranAt: ranAtIso,
})

/** 提交失敗：視為全部未成功 */
export const buildCsvImportCommitFailureSummary = (
  total: number,
  durationMs: number,
  ranAtIso: string,
): ImportRunSummary => ({
  stage: 'commit',
  total,
  success: 0,
  failed: total,
  durationMs,
  ranAt: ranAtIso,
})
