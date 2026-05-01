import { useMemo } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import { SchedulingWorkflowStepper } from './SchedulingWorkflowStepper'
import { SchedulingWeeklyRosterPanel } from './SchedulingWeeklyRosterPanel'
import { buildSchedulingWorkflowUiModel } from '../services/schedulingWorkflowStepService'

export interface SchedulingWorkflowSectionProps {
  sessionCount: number
  rosterConfirmed: boolean
  onRosterConfirmedChange: (value: boolean) => void
  assignmentCount: number
  conflictCount: number
  saveSuccess: boolean
  /** 匯入週更表後重新載入後端時段並清空預覽結果 */
  onRosterImportCommitted: () => void | Promise<void>
}

/** PDF 02【3】五步 UI：進度列、週更表匯入、人工確認勾選（Seq 15） */
export const SchedulingWorkflowSection = ({
  sessionCount,
  rosterConfirmed,
  onRosterConfirmedChange,
  assignmentCount,
  conflictCount,
  saveSuccess,
  onRosterImportCommitted,
}: SchedulingWorkflowSectionProps) => {
  const workflowModel = useMemo(
    () =>
      buildSchedulingWorkflowUiModel({
        sessionCount,
        rosterConfirmed,
        assignmentCount,
        conflictCount,
        saveSuccess,
      }),
    [sessionCount, rosterConfirmed, assignmentCount, conflictCount, saveSuccess],
  )

  return (
    <div className="space-y-4">
      <SchedulingWorkflowStepper model={workflowModel} sessionCount={sessionCount} />
      <SchedulingWeeklyRosterPanel onCommitSuccess={() => void onRosterImportCommitted()} />
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 ${sessionCount === 0 ? 'opacity-60' : ''}`}
      >
        <input
          type="checkbox"
          className="mt-1"
          checked={rosterConfirmed}
          disabled={sessionCount === 0}
          onChange={(event) => onRosterConfirmedChange(event.target.checked)}
        />
        <span>
          <span className="font-medium text-slate-900">② 我已確認本週更表／已載入時段資料無誤</span>
          <span className={`mt-1 block ${uiTokens.blockHelp}`}>
            對齊 01 §3：資助復康與認知軌時段不可混用；確認後才可啟動智能排班。
          </span>
        </span>
      </label>
      {sessionCount > 0 && !rosterConfirmed ? (
        <p className="text-xs text-amber-800">請勾選確認後，方可執行「啟動智能排班」。</p>
      ) : null}
    </div>
  )
}
