import { uiTokens } from '../../shared/ui/uiTokens'
import type { SchedulingWorkflowUiModel } from '../services/schedulingWorkflowStepService'

const STEPS: Array<{ id: 1 | 2 | 3 | 4 | 5; label: string; hint: string }> = [
  { id: 1, label: '導入週更表', hint: 'Excel 範本與活動時段主檔一致' },
  { id: 2, label: '確認', hint: '核對本週更表／時段' },
  { id: 3, label: '智能排班', hint: '執行 3-Pass 與約束' },
  { id: 4, label: '預覽', hint: '指派與衝突檢視' },
  { id: 5, label: '確認採用', hint: '無衝突後儲存' },
]

export interface SchedulingWorkflowStepperProps {
  model: SchedulingWorkflowUiModel
  sessionCount: number
}

/** PDF 02【3】五步進度列（Seq 15） */
export const SchedulingWorkflowStepper = ({ model, sessionCount }: SchedulingWorkflowStepperProps) => {
  const doneFlags: Record<number, boolean> = {
    1: model.step1Done,
    2: model.step2Done,
    3: model.step3Done,
    4: model.step4Done,
    5: model.step5Done,
  }

  return (
    <section className={uiTokens.schedulingWorkflowStepperSection} aria-label="智能排班五步流程">
      <div className={uiTokens.stepperHeaderRow}>
        <h2 className={uiTokens.schedulingWorkflowStepperTitle}>智能排班流程（五步）</h2>
        <span className={uiTokens.schedulingWorkflowSessionCountBadge}>
          已載入時段：{sessionCount} 節
        </span>
      </div>
      <ol className={uiTokens.stepperStepsOlGrid}>
        {STEPS.map((step, index) => {
          const done = doneFlags[step.id]
          const active = model.activeStep === step.id
          const cardClass = active
            ? uiTokens.schedulingWorkflowStepCardActive
            : done
              ? uiTokens.schedulingWorkflowStepCardDone
              : uiTokens.schedulingWorkflowStepCardPending
          const hintClass = active
            ? uiTokens.schedulingWorkflowStepHintActive
            : uiTokens.schedulingWorkflowStepHintIdle
          return (
            <li key={step.id}>
              <div className={cardClass}>
                <span className={uiTokens.textWeightSemibold}>
                  {done ? '✓ ' : ''}
                  {index + 1}. {step.label}
                </span>
                <span className={hintClass}>{step.hint}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
