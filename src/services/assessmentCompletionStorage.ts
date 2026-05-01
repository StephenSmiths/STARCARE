import type { AssessmentCompletionRecord } from '../features/assessmentManagement/types/assessmentManagement'

const STORAGE_KEY = 'starcare-assessment-completions-v1'

/** 評估完成紀錄（localStorage）；01 §5 正式環境應軟刪除／DB */
export const loadAssessmentCompletions = (): AssessmentCompletionRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AssessmentCompletionRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveAssessmentCompletions = (rows: AssessmentCompletionRecord[]): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}
