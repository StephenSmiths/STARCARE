import type { Resident } from '../../residents/types/resident'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import { computeLastPassedCycleAnchor } from './assessmentCycleAnchor'
import { hasAssessmentDisciplineForAnchor } from './assessmentCompletionAnchorHelpers'

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
  const needPt = !hasAssessmentDisciplineForAnchor(existing, resident.id, anchor, 'PT')
  const needOt = !hasAssessmentDisciplineForAnchor(existing, resident.id, anchor, 'OT')
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
