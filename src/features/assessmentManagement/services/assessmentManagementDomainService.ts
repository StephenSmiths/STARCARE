import type { Resident } from '../../residents/types/resident'
import { ASSESSMENT_CYCLE_DAYS, type AssessmentDueTask } from '../../residents/services/assessmentDueTaskService'
import { assessmentDueTaskRepository } from '../../../repositories/assessmentDueTaskRepository'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'

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

const daysSinceAnchor = (anchorYmd: string, ref: Date): number => {
  const a = toUtcDate(anchorYmd)
  if (!a) return 0
  const refUtc = startOfUtcDay(ref)
  return Math.round((refUtc.getTime() - a.getTime()) / DAY_MS)
}

const hasDiscipline = (
  completions: AssessmentCompletionRecord[],
  residentId: string,
  anchor: string,
  discipline: AssessmentCompletionRecord['discipline'],
): boolean =>
  completions.some(
    (row) =>
      row.residentId === residentId &&
      row.cycleAnchorDate === anchor &&
      row.discipline === discipline,
  )

/** 逾期：錨點後超過寬限且缺 PT 或 OT 紀錄 */
export type AssessmentOverdueRow = {
  residentId: string
  residentName: string
  bedNumber: string
  cycleAnchorDate: string
  daysSinceAnchor: number
  missingPt: boolean
  missingOt: boolean
}

export const buildAssessmentOverdueRows = (
  residents: Resident[],
  completions: AssessmentCompletionRecord[],
  now: Date,
): AssessmentOverdueRow[] =>
  residents
    .map((r) => {
      const anchor = computeLastPassedCycleAnchor(r.admissionDate, now)
      if (!anchor) return null
      const days = daysSinceAnchor(anchor, now)
      if (days <= ASSESSMENT_OVERDUE_GRACE_DAYS) return null
      const pt = hasDiscipline(completions, r.id, anchor, 'PT')
      const ot = hasDiscipline(completions, r.id, anchor, 'OT')
      if (pt && ot) return null
      return {
        residentId: r.id,
        residentName: r.name,
        bedNumber: r.bedNumber,
        cycleAnchorDate: anchor,
        daysSinceAnchor: days,
        missingPt: !pt,
        missingOt: !ot,
      }
    })
    .filter((row): row is AssessmentOverdueRow => Boolean(row))
    .sort((a, b) => b.daysSinceAnchor - a.daysSinceAnchor || a.residentName.localeCompare(b.residentName))

/** 本週期 PT+OT 皆登錄之完成率（%） */
export const computeAssessmentCompletionRatePercent = (
  residents: Resident[],
  completions: AssessmentCompletionRecord[],
  now: Date,
): number => {
  const eligible = residents.filter((r) => computeLastPassedCycleAnchor(r.admissionDate, now))
  if (eligible.length === 0) return 100
  let ok = 0
  for (const r of eligible) {
    const anchor = computeLastPassedCycleAnchor(r.admissionDate, now)!
    if (
      hasDiscipline(completions, r.id, anchor, 'PT') &&
      hasDiscipline(completions, r.id, anchor, 'OT')
    ) {
      ok += 1
    }
  }
  return Math.round((100 * ok) / eligible.length)
}

export const buildAssessmentDueSoonTasks = async (
  residents: Resident[],
  now: Date,
  leadDays: number = 14,
): Promise<AssessmentDueTask[]> =>
  assessmentDueTaskRepository.listDueWithinLeadDays(residents, { now, leadDays })

/** 補登目前錨點尚缺之 PT／OT（可單獨補一科） */
export const appendAssessmentCompletionsForCurrentAnchor = (
  actorId: string,
  resident: Resident,
  ptVersion: string,
  otVersion: string,
  existing: AssessmentCompletionRecord[],
  now: Date = new Date(),
): AssessmentCompletionRecord[] => {
  const anchor = computeLastPassedCycleAnchor(resident.admissionDate, now)
  if (!anchor) throw new Error('入院日格式無效，無法對齊週期錨點')
  const pt = ptVersion.trim()
  const ot = otVersion.trim()
  const needPt = !hasDiscipline(existing, resident.id, anchor, 'PT')
  const needOt = !hasDiscipline(existing, resident.id, anchor, 'OT')
  if (!needPt && !needOt) throw new Error('此週期 PT／OT 皆已紀錄')
  if (needPt && !pt) throw new Error('請填寫 PT 版本標籤')
  if (needOt && !ot) throw new Error('請填寫 OT 版本標籤')
  const ts = now.toISOString()
  const adds: AssessmentCompletionRecord[] = []
  if (needPt && pt) {
    adds.push({
      id: crypto.randomUUID(),
      residentId: resident.id,
      residentName: resident.name,
      cycleAnchorDate: anchor,
      discipline: 'PT',
      versionLabel: pt,
      recordedByActorId: actorId,
      completedAt: ts,
    })
  }
  if (needOt && ot) {
    adds.push({
      id: crypto.randomUUID(),
      residentId: resident.id,
      residentName: resident.name,
      cycleAnchorDate: anchor,
      discipline: 'OT',
      versionLabel: ot,
      recordedByActorId: actorId,
      completedAt: ts,
    })
  }
  return [...adds, ...existing]
}
