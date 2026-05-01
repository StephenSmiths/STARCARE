import { useRef, useState } from 'react'
import { residentImportService } from '../../../services/residentImportService'
import type { ResidentImportValidationResult } from '../../../repositories/residentImportRepository'
import type { ImportRunSummary } from '../../shared/importRunSummary'
import { parseResidentCsv } from '../utils/residentCsvParser'

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

  const pushHistory = (summary: ImportRunSummary) => {
    setRunHistory((prev) => [summary, ...prev].slice(0, 10))
  }

  const validateCsv = async (file: File): Promise<void> => {
    setErrorMessage('')
    setCommitMessage('')
    setParseErrors([])
    setResult(null)
    setIsValidating(true)
    const startedAt = Date.now()
    try {
      const text = await file.text()
      const parsed = parseResidentCsv(text)
      if (parsed.errors.length > 0) {
        setParseErrors(parsed.errors)
        setErrorMessage('CSV 內容有格式錯誤，請先修正後再進行預檢')
        return
      }
      if (parsed.rows.length === 0) {
        setErrorMessage('CSV 沒有可預檢資料列')
        return
      }
      const validated = await residentImportService.validateRows(parsed.rows)
      setResult(validated)
      setLastRunSummary({
        stage: 'dry-run',
        total: validated.summary.total,
        success: validated.summary.valid,
        failed: validated.summary.invalid,
        durationMs: Date.now() - startedAt,
        ranAt: new Date().toISOString(),
      })
      pushHistory({
        stage: 'dry-run',
        total: validated.summary.total,
        success: validated.summary.valid,
        failed: validated.summary.invalid,
        durationMs: Date.now() - startedAt,
        ranAt: new Date().toISOString(),
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '匯入預檢失敗')
    } finally {
      setIsValidating(false)
    }
  }

  const commitValidatedRows = async (actorId: string): Promise<void> => {
    if (!result || result.preview.length === 0) {
      setErrorMessage('沒有可匯入資料，請先完成預檢。')
      return
    }
    setErrorMessage('')
    setCommitMessage('')
    setIsValidating(true)
    const startedAt = Date.now()
    const total = result.preview.length
    try {
      const committed = await residentImportService.commitRows(actorId, result.preview)
      setCommitMessage(`已成功匯入 ${committed.inserted} 筆院友資料。`)
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
      setErrorMessage(error instanceof Error ? error.message : '批量匯入失敗')
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
      setIsValidating(false)
    }
  }

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
