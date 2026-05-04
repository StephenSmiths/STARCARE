import { useEffect, useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { assessmentDueTaskRepository } from '../../../repositories/assessmentDueTaskRepository'
import { downloadAssessmentDueTasksCsv } from '../services/assessmentDueTaskCsvService'
import type { Resident } from '../types/resident'
import type { AssessmentDueTask } from '../services/assessmentDueTaskService'

interface ResidentsAssessmentDuePanelProps {
  actorId: string
  residents: Resident[]
}

export const ResidentsAssessmentDuePanel = ({ actorId, residents }: ResidentsAssessmentDuePanelProps) => {
  const [assessmentDueTasks, setAssessmentDueTasks] = useState<AssessmentDueTask[]>([])

  useEffect(() => {
    let cancelled = false
    void assessmentDueTaskRepository.listDueWithinLeadDays(residents).then((rows) => {
      if (!cancelled) setAssessmentDueTasks(rows)
    })
    return () => {
      cancelled = true
    }
  }, [residents])

  const exportDueTasksCsv = () => {
    if (assessmentDueTasks.length === 0) return
    downloadAssessmentDueTasksCsv(assessmentDueTasks)
    globalAuditTrailService.record({
      action: 'ASSESSMENT_DUE_EXPORT',
      entityType: 'Reporting',
      entityId: `assessment-due-${Date.now()}`,
      actorId,
      beforeState: null,
      afterState: JSON.stringify({ taskCount: assessmentDueTasks.length }),
      detail: '匯出評估到期待辦清單（CSV）',
      occurredAt: new Date().toISOString(),
    })
  }

  return (
    <section aria-labelledby="residents-assessment-due-heading">
      <div className={uiTokens.layoutFlexBetweenGap2}>
        <h3 id="residents-assessment-due-heading" className={uiTokens.blockHeading}>
          評估到期待辦（14 天）
        </h3>
        <button
          type="button"
          disabled={assessmentDueTasks.length === 0}
          onClick={exportDueTasksCsv}
          className={uiTokens.linkDownload}
        >
          匯出待辦清單
        </button>
      </div>
      <p className={uiTokens.blockHelp}>
        Seq 9：院友編輯表單可填「下次評估到期日」寫入 **`assessment_next_due_date`**；未填則以入住日 180 天週期估算。
      </p>
      {assessmentDueTasks.length === 0 ? (
        <p className={uiTokens.inlineNoticeSuccess}>目前沒有 14 天內到期評估。</p>
      ) : (
        <ul className={uiTokens.listCalloutAmber}>
          {assessmentDueTasks.slice(0, 5).map((task) => (
            <li key={task.residentId}>
              {task.residentName}（{task.bedNumber}）於 {task.dueDate} 到期（{task.dueInDays} 天內）
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
