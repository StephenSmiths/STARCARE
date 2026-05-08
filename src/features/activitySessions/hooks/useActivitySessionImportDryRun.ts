import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { ActivitySessionImportPreviewRow } from '../../../repositories/activitySessionImportRepository'
import {
  applyActivitySessionCsvCommitOutcome,
  applyActivitySessionCsvDryRunOutcome,
} from '../utils/activitySessionImportDryRunOutcomeApply'
import {
  commitActivitySessionCsvPreview,
  runActivitySessionCsvDryRun,
} from '../utils/activitySessionImportDryRunFlow'
import { runWeeklyRosterActivityImportDryRun } from '../../scheduling/utils/runWeeklyRosterActivityImportDryRun'
import { ACTIVITY_SESSIONS_WORKSPACE_FACILITY_ID } from '../constants/activitySessionsWorkspaceDefaults'
import { useActivitySessionImportDryRunState } from './useActivitySessionImportDryRunState'

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

  const {
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
  } = useActivitySessionImportDryRunState()

  const validateCsvText = useCallback(
    async (csvText: string) => {
      setIsBusy(true)
      reset()
      try {
        const outcome = await runActivitySessionCsvDryRun(csvText)
        applyActivitySessionCsvDryRunOutcome(outcome, {
          setParseErrors,
          setErrorMessage,
          setResult,
          setLastRunSummary,
          pushHistory,
        })
      } finally {
        setIsBusy(false)
      }
    },
    [pushHistory, reset, setErrorMessage, setIsBusy, setLastRunSummary, setParseErrors, setResult],
  )

  /** PDF 02【3】週更表：Excel／CSV 首頁欄位（中文表頭）→ 活動時段預檢。 */
  const validateWeeklyRosterSheetText = useCallback(
    async (sheetCsvText: string) => {
      setIsBusy(true)
      reset()
      try {
        const outcome = await runWeeklyRosterActivityImportDryRun(sheetCsvText, ACTIVITY_SESSIONS_WORKSPACE_FACILITY_ID)
        applyActivitySessionCsvDryRunOutcome(outcome, {
          setParseErrors,
          setErrorMessage,
          setResult,
          setLastRunSummary,
          pushHistory,
        })
      } finally {
        setIsBusy(false)
      }
    },
    [pushHistory, reset, setErrorMessage, setIsBusy, setLastRunSummary, setParseErrors, setResult],
  )

  const commitValidatedRows = useCallback(
    async (actorId: string) => {
      if (!result || result.preview.length === 0) return
      if (commitLockRef.current) return
      commitLockRef.current = true
      setIsBusy(true)
      setErrorMessage('')
      setCommitMessage('')
      try {
        const outcome = await commitActivitySessionCsvPreview(
          actorId,
          result.preview as ActivitySessionImportPreviewRow[],
        )
        applyActivitySessionCsvCommitOutcome(outcome, {
          setCommitMessage,
          setErrorMessage,
          setResult,
          setLastRunSummary,
          pushHistory,
          onCommitSuccess: () => onCommitSuccessRef.current?.(),
        })
      } finally {
        commitLockRef.current = false
        setIsBusy(false)
      }
    },
    [
      pushHistory,
      result,
      setCommitMessage,
      setErrorMessage,
      setIsBusy,
      setLastRunSummary,
      setResult,
    ],
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
      validateWeeklyRosterSheetText,
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
      validateWeeklyRosterSheetText,
      commitValidatedRows,
      reset,
    ],
  )
}
