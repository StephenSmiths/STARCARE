import { useRef, useState } from 'react'
import type { StaffImportValidationResult } from '../../../repositories/staffImportRepository'
import { staffImportService } from '../../../services/staffImportService'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import { parseStaffCsv } from '../utils/staffCsvParser'

type ParseError = { rowIndex: number; message: string }

export const useStaffImportDryRun = () => {
  /** 防止確認匯入連點（對齊業務 PDF 防重覆提交） */
  const commitLockRef = useRef(false)
  const [isLoading, setIsLoading] = useState(false)
  const [parseErrors, setParseErrors] = useState<ParseError[]>([])
  const [result, setResult] = useState<StaffImportValidationResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [commitMessage, setCommitMessage] = useState('')
  const [lastRunSummary, setLastRunSummary] = useState<ImportRunSummary | null>(null)
  const [runHistory, setRunHistory] = useState<ImportRunSummary[]>([])

  const pushHistory = (summary: ImportRunSummary) => {
    setRunHistory((prev) => [summary, ...prev].slice(0, 10))
  }

  const validateCsv = async (file: File): Promise<void> => {
    setErrorMessage('')
    setCommitMessage('')
    setResult(null)
    setParseErrors([])
    setIsLoading(true)
    const startedAt = Date.now()
    try {
      const parsed = parseStaffCsv(await file.text())
      if (parsed.errors.length > 0) {
        setParseErrors(parsed.errors)
        setErrorMessage('CSV 內容有格式錯誤，請先修正後再進行預檢')
        return
      }
      if (parsed.rows.length === 0) {
        setErrorMessage('CSV 沒有可預檢資料列')
        return
      }
      const validated = await staffImportService.validateRows(parsed.rows)
      setResult(validated)
      const summary: ImportRunSummary = {
        stage: 'dry-run',
        total: validated.summary.total,
        success: validated.summary.valid,
        failed: validated.summary.invalid,
        durationMs: Date.now() - startedAt,
        ranAt: new Date().toISOString(),
      }
      setLastRunSummary(summary)
      pushHistory(summary)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '員工匯入預檢失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const commitValidatedRows = async (actorId: string): Promise<void> => {
    if (!result || result.preview.length === 0) {
      setErrorMessage('沒有可匯入資料，請先完成預檢。')
      return
    }
    if (commitLockRef.current) return
    commitLockRef.current = true
    setErrorMessage('')
    setCommitMessage('')
    setIsLoading(true)
    const startedAt = Date.now()
    const total = result.preview.length
    try {
      const committed = await staffImportService.commitRows(actorId, result.preview)
      setCommitMessage(`已成功匯入 ${committed.inserted} 筆員工資料。`)
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
      setResult(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '員工批量匯入失敗')
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
      setIsLoading(false)
    }
  }

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
