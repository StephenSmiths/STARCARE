import type { Resident } from '../types/resident'

export interface AssessmentDueTask {
  residentId: string
  residentName: string
  bedNumber: string
  dueDate: string
  dueInDays: number
}

const DAY_MS = 24 * 60 * 60 * 1000
/** Seq 9／22：評估週期（天）；正式版應由 assessment 母資料驅動 */
export const ASSESSMENT_CYCLE_DAYS = 180

const toUtcDate = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const parsed = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10)

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * DAY_MS)

/**
 * Seq 9 骨架：先以「入住日起每 180 天」估算下一次評估到期日。
 * 待評估模組上線後，改由正式 assessment_due_date 欄位取代。
 */
export const buildAssessmentDueTasks = (
  residents: Resident[],
  options: { now?: Date; leadDays?: number } = {},
): AssessmentDueTask[] => {
  const now = options.now ?? new Date()
  const leadDays = options.leadDays ?? 14
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const endDate = addDays(todayUtc, leadDays)

  return residents
    .map((resident) => {
      const admission = toUtcDate(resident.admissionDate)
      if (!admission) return null
      let nextDue = admission
      while (nextDue < todayUtc) {
        nextDue = addDays(nextDue, ASSESSMENT_CYCLE_DAYS)
      }
      if (nextDue > endDate) return null
      return {
        residentId: resident.id,
        residentName: resident.name,
        bedNumber: resident.bedNumber,
        dueDate: toDateOnly(nextDue),
        dueInDays: Math.round((nextDue.getTime() - todayUtc.getTime()) / DAY_MS),
      }
    })
    .filter((task): task is AssessmentDueTask => Boolean(task))
    .sort((a, b) => a.dueInDays - b.dueInDays || a.residentName.localeCompare(b.residentName))
}
