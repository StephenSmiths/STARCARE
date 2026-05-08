import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  StaffImportPreviewRow,
  StaffImportValidationResult,
} from '../../../repositories/staffImportRepository'
import { IMPORT_RUN_HISTORY_CAP } from '../../shared/csvImportRunSummary'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import { parseStaffImportFileToCsvText } from '../utils/parseStaffImportFile'
import {
  applyStaffCsvCommitOutcome,
  applyStaffCsvDryRunOutcome,
} from '../utils/staffImportDryRunOutcomeApply'
import { commitStaffCsvPreview, runStaffCsvDryRun } from '../utils/staffImportDryRunFlow'

type ParseError = { rowIndex: number; message: string }

export type UseStaffImportDryRunOptions = {
  onCommitSuccess?: () => void
}

export const useStaffImportDryRun = (options?: UseStaffImportDryRunOptions) => {
  const onCommitSuccessRef = useRef(options?.onCommitSuccess)
  useEffect(() => {
    onCommitSuccessRef.current = options?.onCommitSuccess
  }, [options?.onCommitSuccess])

  /** 防止確認匯入連點（對齊業務 PDF 防重覆提交） */
  const commitLockRef = useRef(false)
  const [isLoading, setIsLoading] = useState(false)
  const [parseErrors, setParseErrors] = useState<ParseError[]>([])
  const [result, setResult] = useState<StaffImportValidationResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [commitMessage, setCommitMessage] = useState('')
  const [lastRunSummary, setLastRunSummary] = useState<ImportRunSummary | null>(null)
  const [runHistory, setRunHistory] = useState<ImportRunSummary[]>([])

  const pushHistory = useCallback((summary: ImportRunSummary) => {
    setRunHistory((prev) => [summary, ...prev].slice(0, IMPORT_RUN_HISTORY_CAP))
  }, [])

  const validateCsv = useCallback(
    async (file: File): Promise<void> => {
      setErrorMessage('')
      setCommitMessage('')
      setResult(null)
      setParseErrors([])
      setIsLoading(true)
      try {
        const csvText = await parseStaffImportFileToCsvText(file)
        const outcome = await runStaffCsvDryRun(csvText)
        applyStaffCsvDryRunOutcome(outcome, {
          setParseErrors,
          setErrorMessage,
          setResult,
          setLastRunSummary,
          pushHistory,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [pushHistory],
  )

  const commitValidatedRows = useCallback(
    async (actorId: string): Promise<void> => {
      if (!result || result.preview.length === 0) {
        setErrorMessage('沒有可匯入資料，請先完成預檢。')
        return
      }
      if (commitLockRef.current) return
      commitLockRef.current = true
      setErrorMessage('')
      setCommitMessage('')
      setIsLoading(true)
      try {
        const outcome = await commitStaffCsvPreview(actorId, result.preview as StaffImportPreviewRow[])
        applyStaffCsvCommitOutcome(outcome, {
          setCommitMessage,
          setErrorMessage,
          setResult,
          setLastRunSummary,
          pushHistory,
        })
        if (outcome.kind === 'success') onCommitSuccessRef.current?.()
      } finally {
        commitLockRef.current = false
        setIsLoading(false)
      }
    },
    [result, pushHistory],
  )

  return {
    isLoading,
    parseErrors,
    result,
    errorMessage,
    commitMessage,
    lastRunSummary,
    runHistory,
    validateCsv,
    commitValidatedRows,
  }
}
