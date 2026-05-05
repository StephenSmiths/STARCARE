import type { Resident } from '../../residents/types/resident'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import { computeLastPassedCycleAnchor } from './assessmentCycleAnchor'
import { hasAssessmentDisciplineForAnchor } from './assessmentCompletionAnchorHelpers'

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
      hasAssessmentDisciplineForAnchor(completions, r.id, anchor, 'PT') &&
      hasAssessmentDisciplineForAnchor(completions, r.id, anchor, 'OT')
    ) {
      ok += 1
    }
  }
  return Math.round((100 * ok) / eligible.length)
}
