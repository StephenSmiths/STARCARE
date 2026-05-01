import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { activitySessionImportService } from '../../../services/activitySessionImportService'
import type {
  ActivitySessionImportPreviewRow,
  ActivitySessionImportValidationResult,
} from '../../../repositories/activitySessionImportRepository'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import { parseActivitySessionCsv } from '../utils/activitySessionCsvParser'

export type ActivitySessionImportDryRunOptions = {
  /** 匯入成功後回呼（例如排班頁重新載入時段） */
  onCommitSuccess?: () => void
}

export const useActivitySessionImportDryRun = (options?: ActivitySessionImportDryRunOptions) => {
  /** 防止確認匯入連點（對齊業務 PDF 防重覆提交） */
  const commitLockRef = useRef(false)
  const onCommitSuccessRef = useRef(options?.onCommitSuccess)
  useEffect(() => {
    onCommitSuccessRef.current = options?.onCommitSuccess
  }, [options?.onCommitSuccess])
  const [isBusy, setIsBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [parseErrors, setParseErrors] = useState<Array<{ rowIndex: number; message: string }>>([])
  const [result, setResult] = useState<ActivitySessionImportValidationResult | null>(null)
  const [commitMessage, setCommitMessage] = useState('')
  const [lastRunSummary, setLastRunSummary] = useState<ImportRunSummary | null>(null)
  const [runHistory, setRunHistory] = useState<ImportRunSummary[]>([])

  const pushHistory = useCallback((summary: ImportRunSummary) => {
    setRunHistory((prev) => [summary, ...prev].slice(0, 10))
  }, [])

  const reset = useCallback(() => {
    setErrorMessage('')
    setParseErrors([])
    setResult(null)
    setCommitMessage('')
  }, [])

  const validateCsvText = useCallback(async (csvText: string) => {
    setIsBusy(true)
    reset()
    const startedAt = Date.now()
    try {
      const parsed = parseActivitySessionCsv(csvText)
      setParseErrors(parsed.errors)
      if (parsed.errors.length > 0) {
        setErrorMessage('CSV 內容有格式錯誤，請先修正後再進行預檢')
        return
      }
      if (parsed.rows.length === 0) {
        setErrorMessage('CSV 沒有可用資料列')
        return
      }
      const response = await activitySessionImportService.validateRows(parsed.rows)
      setResult(response)
      const summary: ImportRunSummary = {
        stage: 'dry-run',
        total: response.summary.total,
        success: response.summary.valid,
        failed: response.summary.invalid,
        durationMs: Date.now() - startedAt,
        ranAt: new Date().toISOString(),
      }
      setLastRunSummary(summary)
      pushHistory(summary)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '預檢失敗')
    } finally {
      setIsBusy(false)
    }
  }, [reset, pushHistory])

  const commitValidatedRows = useCallback(
    async (actorId: string) => {
      if (!result || result.preview.length === 0) return
      if (commitLockRef.current) return
      commitLockRef.current = true
      setIsBusy(true)
      setErrorMessage('')
      setCommitMessage('')
      const startedAt = Date.now()
      const total = result.preview.length
      try {
        const committed = await activitySessionImportService.commitRows(
          actorId,
          result.preview as ActivitySessionImportPreviewRow[],
        )
        setCommitMessage(`已成功匯入 ${committed.inserted} 筆活動時段資料`)
        setResult(null)
        const summary: ImportRunSummary = {
          stage: 'commit',
          total,
          success: committed.inserted,
          failed: Math.max(0, total - committed.inserted),
          durationMs: Date.now() - startedAt,
          ranAt: new Date().toISOString(),
        }
        setLastRunSummary(summary)
        pushHistory(summary)
        onCommitSuccessRef.current?.()
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '匯入失敗')
        const summary: ImportRunSummary = {
          stage: 'commit',
          total,
          success: 0,
          failed: total,
          durationMs: Date.now() - startedAt,
          ranAt: new Date().toISOString(),
        }
        setLastRunSummary(summary)
        pushHistory(summary)
      } finally {
        commitLockRef.current = false
        setIsBusy(false)
      }
    },
    [result, pushHistory],
  )

  return useMemo(
    () => ({
      isBusy,
      errorMessage,
      parseErrors,
      result,
      commitMessage,
      lastRunSummary,
      runHistory,
      validateCsvText,
      commitValidatedRows,
      reset,
    }),
    [
      isBusy,
      errorMessage,
      parseErrors,
      result,
      commitMessage,
      lastRunSummary,
      runHistory,
      validateCsvText,
      commitValidatedRows,
      reset,
    ],
  )
}
