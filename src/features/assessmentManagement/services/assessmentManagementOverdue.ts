import type { Resident } from '../../residents/types/resident'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import {
  ASSESSMENT_OVERDUE_GRACE_DAYS,
  computeLastPassedCycleAnchor,
  daysSinceAssessmentAnchor,
} from './assessmentCycleAnchor'
import { hasAssessmentDisciplineForAnchor } from './assessmentCompletionAnchorHelpers'

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
      const days = daysSinceAssessmentAnchor(anchor, now)
      if (days <= ASSESSMENT_OVERDUE_GRACE_DAYS) return null
      const pt = hasAssessmentDisciplineForAnchor(completions, r.id, anchor, 'PT')
      const ot = hasAssessmentDisciplineForAnchor(completions, r.id, anchor, 'OT')
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
