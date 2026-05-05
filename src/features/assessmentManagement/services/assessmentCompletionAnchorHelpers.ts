import type { AssessmentCompletionRecord } from '../types/assessmentManagement'

/** 指定錨點週期是否已有該科別完成紀錄 */
export const hasAssessmentDisciplineForAnchor = (
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
