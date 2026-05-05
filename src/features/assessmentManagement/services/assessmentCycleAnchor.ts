import { ASSESSMENT_CYCLE_DAYS } from '../../residents/services/assessmentDueTaskService'

const DAY_MS = 24 * 60 * 60 * 1000

/** 錨點後仍未完成 PT／OT 即視為逾期（Seq 22 骨架） */
export const ASSESSMENT_OVERDUE_GRACE_DAYS = 14

const toUtcDate = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const parsed = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10)

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * DAY_MS)

const startOfUtcDay = (now: Date): Date =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

/** 截至 ref 日之最後已經過週期錨點（含入住當日） */
export const computeLastPassedCycleAnchor = (admissionYmd: string, ref: Date): string | null => {
  const admission = toUtcDate(admissionYmd)
  if (!admission) return null
  const refUtc = startOfUtcDay(ref)
  let anchor = admission
  while (addDays(anchor, ASSESSMENT_CYCLE_DAYS) <= refUtc) {
    anchor = addDays(anchor, ASSESSMENT_CYCLE_DAYS)
  }
  return toDateOnly(anchor)
}

/** 錨點日至 ref 日曆日差（無效錨點回傳 0） */
export const daysSinceAssessmentAnchor = (anchorYmd: string, ref: Date): number => {
  const a = toUtcDate(anchorYmd)
  if (!a) return 0
  const refUtc = startOfUtcDay(ref)
  return Math.round((refUtc.getTime() - a.getTime()) / DAY_MS)
}
