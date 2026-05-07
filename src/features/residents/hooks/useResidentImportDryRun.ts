import { useCallback, useRef, useState } from 'react'
import type {
  ResidentImportPreviewRow,
  ResidentImportValidationResult,
} from '../../../repositories/residentImportRepository'
import { IMPORT_RUN_HISTORY_CAP } from '../../shared/csvImportRunSummary'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import {
  applyResidentCsvCommitOutcome,
  applyResidentCsvDryRunOutcome,
} from '../utils/residentImportDryRunOutcomeApply'
import { parseResidentImportFileToCsvText } from '../utils/parseResidentImportFile'
import { commitResidentCsvPreview, runResidentCsvDryRun } from '../utils/residentImportDryRunFlow'

type ParseError = { rowIndex: number; message: string }

export const useResidentImportDryRun = () => {
  /** 防止確認匯入連點（對齊業務 PDF 防重覆提交） */
  const commitLockRef = useRef(false)
  const [isValidating, setIsValidating] = useState(false)
  const [parseErrors, setParseErrors] = useState<ParseError[]>([])
  const [result, setResult] = useState<ResidentImportValidationResult | null>(null)
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
      setParseErrors([])
      setResult(null)
      setIsValidating(true)
      try {
        const text = await parseResidentImportFileToCsvText(file)
        const outcome = await runResidentCsvDryRun(text)
        applyResidentCsvDryRunOutcome(outcome, {
          setParseErrors,
          setErrorMessage,
          setResult,
          setLastRunSummary,
          pushHistory,
        })
      } finally {
        setIsValidating(false)
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
      setIsValidating(true)
      try {
        const outcome = await commitResidentCsvPreview(
          actorId,
          result.preview as ResidentImportPreviewRow[],
        )
        applyResidentCsvCommitOutcome(outcome, {
          setCommitMessage,
          setErrorMessage,
          setResult,
          setLastRunSummary,
          pushHistory,
        })
      } finally {
        commitLockRef.current = false
        setIsValidating(false)
      }
    },
    [result, pushHistory],
  )

  return {
    isValidating,
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
