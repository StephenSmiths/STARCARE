import { useMemo } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { buildAssessmentDueTasks } from '../services/assessmentDueTaskService'
import { downloadAssessmentDueTasksCsv } from '../services/assessmentDueTaskCsvService'
import type { Resident } from '../types/resident'

interface ResidentsAssessmentDuePanelProps {
  actorId: string
  residents: Resident[]
}

export const ResidentsAssessmentDuePanel = ({ actorId, residents }: ResidentsAssessmentDuePanelProps) => {
  const assessmentDueTasks = useMemo(() => buildAssessmentDueTasks(residents), [residents])

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
      <div className="flex items-center justify-between gap-2">
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
        Seq 9 骨架：暫以入住日 180 天週期估算，待評估模組上線後改為正式到期欄位。
      </p>
      {assessmentDueTasks.length === 0 ? (
        <p className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          目前沒有 14 天內到期評估。
        </p>
      ) : (
        <ul className="mt-2 space-y-1 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
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
