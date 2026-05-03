import type { Resident } from '../types/resident'
import {
  dueInDaysFrom,
  resolveNextAssessmentDueUtc,
  toDateOnly,
} from './assessmentDueDateResolve'

export { ASSESSMENT_CYCLE_DAYS } from './assessmentDueDateResolve'

export interface AssessmentDueTask {
  residentId: string
  residentName: string
  bedNumber: string
  dueDate: string
  dueInDays: number
}

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)

/**
 * Seq 9：`residents.assessment_next_due_date`（對應 **`assessmentNextDueDate`**）有值且落在視窗內則採用；否則以入住日起每 180 天估算。
 * 呼叫端宜經 **`assessmentDueTaskRepository`**（`src/repositories/assessmentDueTaskRepository.ts`；有 Supabase 時走 **`assessment-due-list`**）。
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
      const nextDue = resolveNextAssessmentDueUtc(
        {
          admissionDate: resident.admissionDate,
          assessmentNextDueDate: resident.assessmentNextDueDate,
        },
        todayUtc,
        endDate,
      )
      if (!nextDue) return null
      return {
        residentId: resident.id,
        residentName: resident.name,
        bedNumber: resident.bedNumber,
        dueDate: toDateOnly(nextDue),
        dueInDays: dueInDaysFrom(nextDue, todayUtc),
      }
    })
    .filter((task): task is AssessmentDueTask => Boolean(task))
    .sort((a, b) => a.dueInDays - b.dueInDays || a.residentName.localeCompare(b.residentName))
}
