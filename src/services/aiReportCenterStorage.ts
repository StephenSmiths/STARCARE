import type { AiReportRecord } from '../features/aiReportCenter/types/aiReportCenter'

const STORAGE_KEY = 'starcare-ai-report-center-v1'

/** PDF 02【11】報告列表（localStorage）；正式版應 PostgreSQL + RLS */
export const loadAiReports = (): AiReportRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AiReportRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveAiReports = (rows: AiReportRecord[]): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}
