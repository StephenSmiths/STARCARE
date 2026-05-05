import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import type { Resident } from '../../residents/types/resident'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'

/** PDF 02【9】評估完成紀錄：`skipRemotePersist` 對齊 Edge 已成功 append 時避免重複 audit-trail-append */
export const recordAssessmentCompletionAudit = (
  actorId: string,
  resident: Resident,
  added: AssessmentCompletionRecord[],
  skipRemotePersist: boolean,
): void => {
  recordAuditTrailThenHydrate(
    {
      action: 'ASSESSMENT_COMPLETION_RECORD',
      entityType: 'Resident',
      entityId: resident.id,
      actorId,
      beforeState: null,
      afterState: JSON.stringify(
        added.map((row) => ({
          discipline: row.discipline,
          versionLabel: row.versionLabel,
          cycleAnchorDate: row.cycleAnchorDate,
        })),
      ),
      detail: `評估完成紀錄：${resident.name}（${added.map((r) => `${r.discipline} ${r.versionLabel}`).join('、')}）`,
      occurredAt: new Date().toISOString(),
    },
    skipRemotePersist,
  )
}
