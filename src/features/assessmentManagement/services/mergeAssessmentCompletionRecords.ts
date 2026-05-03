import type { AssessmentCompletionRecord } from '../types/assessmentManagement'

const tupleKey = (r: AssessmentCompletionRecord): string =>
  `${r.residentId}\t${r.cycleAnchorDate}\t${r.discipline}`

/** 同院友／錨點／科別以遠端（DB）為準；其餘保留本機列 */
export const mergeAssessmentCompletionRecordsRemotePrimary = (
  remote: AssessmentCompletionRecord[],
  local: AssessmentCompletionRecord[],
): AssessmentCompletionRecord[] => {
  const map = new Map<string, AssessmentCompletionRecord>()
  for (const r of local) map.set(tupleKey(r), r)
  for (const r of remote) map.set(tupleKey(r), r)
  return [...map.values()].sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1))
}
