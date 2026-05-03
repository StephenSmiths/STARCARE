/**
 * PDF 01 §4.3：解析「下次評估到期」UTC 日（Seq 9）。
 * 須與 **`supabase/functions/_shared/assessmentDueFromAdmission.ts`** 內同一演算同步維護。
 */
export const ASSESSMENT_CYCLE_DAYS = 180

const DAY_MS = 24 * 60 * 60 * 1000

export const normalizeYmd = (value: string): string =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : (value.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? '')

export const toUtcDate = (value: string): Date | null => {
  const ymd = normalizeYmd(value)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null
  const parsed = new Date(`${ymd}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * DAY_MS)

export type AssessmentDueSource = {
  admissionDate: string
  assessmentNextDueDate?: string | null
}

/** 有 **`assessmentNextDueDate`** 且落在 [today, today+lead] 內則採用；否則由入院日起每 180 天推算下一個未來錨點 */
export const resolveNextAssessmentDueUtc = (
  source: AssessmentDueSource,
  todayUtc: Date,
  endDate: Date,
): Date | null => {
  const explicit = source.assessmentNextDueDate
    ? toUtcDate(source.assessmentNextDueDate)
    : null
  if (explicit) {
    if (explicit < todayUtc || explicit > endDate) return null
    return explicit
  }
  const admission = toUtcDate(source.admissionDate)
  if (!admission) return null
  let nextDue = admission
  while (nextDue < todayUtc) {
    nextDue = addDays(nextDue, ASSESSMENT_CYCLE_DAYS)
  }
  if (nextDue > endDate) return null
  return nextDue
}

export const dueInDaysFrom = (nextDue: Date, todayUtc: Date): number =>
  Math.round((nextDue.getTime() - todayUtc.getTime()) / DAY_MS)

export const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10)
