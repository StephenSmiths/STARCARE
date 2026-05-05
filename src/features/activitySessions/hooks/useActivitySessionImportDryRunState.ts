import { useCallback, useState } from 'react'
import type { ActivitySessionImportValidationResult } from '../../../repositories/activitySessionImportRepository'
import { IMPORT_RUN_HISTORY_CAP } from '../../shared/csvImportRunSummary'
import type { ImportRunSummary } from '../../shared/importRunSummary'

/** 活動時段 CSV 預檢／匯入：列表狀態與執行摘要歷史（不含 commit 鎖）。 */
export const useActivitySessionImportDryRunState = () => {
  const [isBusy, setIsBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [parseErrors, setParseErrors] = useState<Array<{ rowIndex: number; message: string }>>([])
  const [result, setResult] = useState<ActivitySessionImportValidationResult | null>(null)
  const [commitMessage, setCommitMessage] = useState('')
  const [lastRunSummary, setLastRunSummary] = useState<ImportRunSummary | null>(null)
  const [runHistory, setRunHistory] = useState<ImportRunSummary[]>([])

  const pushHistory = useCallback((summary: ImportRunSummary) => {
    setRunHistory((prev) => [summary, ...prev].slice(0, IMPORT_RUN_HISTORY_CAP))
  }, [])

  const reset = useCallback(() => {
    setErrorMessage('')
    setParseErrors([])
    setResult(null)
    setCommitMessage('')
  }, [])

  return {
    isBusy,
    setIsBusy,
    errorMessage,
    setErrorMessage,
    parseErrors,
    setParseErrors,
    result,
    setResult,
    commitMessage,
    setCommitMessage,
    lastRunSummary,
    setLastRunSummary,
    runHistory,
    pushHistory,
    reset,
  }
}
