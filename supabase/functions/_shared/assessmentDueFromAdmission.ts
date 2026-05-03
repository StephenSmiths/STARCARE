/**
 * PDF 01 §4.3／Seq 9：評估到期視窗內之列舉。
 * 演算須與 `src/features/residents/services/assessmentDueDateResolve.ts` 同步維護。
 */
export const ASSESSMENT_CYCLE_DAYS = 180
const DAY_MS = 24 * 60 * 60 * 1000

export type ResidentDueSourceRow = {
  id: string
  name: string
  bed_number: string
  admission_date: string
  assessment_next_due_date?: string | null
}

export type AssessmentDueTaskRow = {
  residentId: string
  residentName: string
  bedNumber: string
  dueDate: string
  dueInDays: number
}

const normalizeYmd = (value: string): string =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : (value.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? '')

const toUtcDate = (value: string): Date | null => {
  const ymd = normalizeYmd(value)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null
  const parsed = new Date(`${ymd}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10)

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * DAY_MS)

const resolveNextDueUtc = (row: ResidentDueSourceRow, todayUtc: Date, endDate: Date): Date | null => {
  const explicit = row.assessment_next_due_date
    ? toUtcDate(row.assessment_next_due_date)
    : null
  if (explicit) {
    if (explicit < todayUtc || explicit > endDate) return null
    return explicit
  }
  const admission = toUtcDate(row.admission_date)
  if (!admission) return null
  let nextDue = admission
  while (nextDue < todayUtc) {
    nextDue = addDays(nextDue, ASSESSMENT_CYCLE_DAYS)
  }
  if (nextDue > endDate) return null
  return nextDue
}

export const buildAssessmentDueTasksFromAdmissionRows = (
  rows: ResidentDueSourceRow[],
  now: Date,
  leadDays: number,
): AssessmentDueTaskRow[] => {
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const endDate = addDays(todayUtc, leadDays)

  return rows
    .map((row) => {
      const nextDue = resolveNextDueUtc(row, todayUtc, endDate)
      if (!nextDue) return null
      return {
        residentId: row.id,
        residentName: row.name,
        bedNumber: row.bed_number,
        dueDate: toDateOnly(nextDue),
        dueInDays: Math.round((nextDue.getTime() - todayUtc.getTime()) / DAY_MS),
      }
    })
    .filter((task): task is AssessmentDueTaskRow => Boolean(task))
    .sort((a, b) => a.dueInDays - b.dueInDays || a.residentName.localeCompare(b.residentName))
}
