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
    <div className={uiTokens.layoutSpaceY4}>
      <SchedulingWorkflowStepper model={workflowModel} sessionCount={sessionCount} />
      <SchedulingWeeklyRosterPanel onCommitSuccess={() => void onRosterImportCommitted()} />
      <label
        className={sessionCount === 0 ? uiTokens.rosterConfirmChoiceCardMuted : uiTokens.rosterConfirmChoiceCard}
      >
        <input
          type="checkbox"
          className={uiTokens.layoutSpacerMt1}
          checked={rosterConfirmed}
          disabled={sessionCount === 0}
          onChange={(event) => onRosterConfirmedChange(event.target.checked)}
        />
        <span>
          <span className={uiTokens.textWeightMediumSlate900}>② 我已確認本週更表／已載入時段資料無誤</span>
          <span className={uiTokens.blockHelpBlockMt1}>
            對齊 01 §3：資助復康與認知軌時段不可混用；確認後才可啟動智能排班。
          </span>
        </span>
      </label>
      {sessionCount > 0 && !rosterConfirmed ? (
        <p className={uiTokens.textUrgentHint}>請勾選確認後，方可執行「啟動智能排班」。</p>
      ) : null}
    </div>
  )
}
