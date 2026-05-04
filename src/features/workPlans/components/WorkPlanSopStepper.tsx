import { uiTokens } from '../../shared/ui/uiTokens'

const STEPS: Array<{ id: 1 | 2 | 3 | 4 | 5; label: string; hint: string }> = [
  { id: 1, label: '選定計劃日期', hint: '對齊工作節所屬日' },
  { id: 2, label: '選定承接員工', hint: '含職類（role_type）辨識' },
  { id: 3, label: '設定工作節', hint: '時段、名額、服務軌道（01 §3）' },
  { id: 4, label: '預覽並核對', hint: '列表可移除後再調整' },
  { id: 5, label: '儲存並發布', hint: '寫入活動時段主檔（指派）' },
]

export type WorkPlanSopStepperProps = {
  sessionDate: string
  staffProfileId: string
  timeSlot: string
  capacity: number
  draftsCount: number
  commitSuccess: string | null
  isCommitting: boolean
}

/** PDF 02【2】創建工作計劃：五步進度對照（Seq 14；細節仍以母本逐屏簽核為準） */
export const WorkPlanSopStepper = ({
  sessionDate,
  staffProfileId,
  timeSlot,
  capacity,
  draftsCount,
  commitSuccess,
  isCommitting,
}: WorkPlanSopStepperProps) => {
  const done1 = sessionDate.trim() !== ''
  const done2 = staffProfileId.trim() !== ''
  const done3 = timeSlot.trim() !== '' && Number.isFinite(capacity) && capacity >= 1
  const done4 = draftsCount > 0
  const done5 = commitSuccess != null && commitSuccess.trim() !== ''
  const doneFlags: Record<number, boolean> = {
    1: done1,
    2: done2,
    3: done3,
    4: done4,
    5: done5,
  }

  let activeStep: 1 | 2 | 3 | 4 | 5 = 1
  if (!done1) activeStep = 1
  else if (!done2) activeStep = 2
  else if (!done3) activeStep = 3
  else if (!done4) activeStep = 4
  else activeStep = 5

  const stepIsActive = (id: 1 | 2 | 3 | 4 | 5) =>
    !done5 && (activeStep === id || (id === 5 && isCommitting && done4))

  return (
    <section className={uiTokens.workPlanStepperSection} aria-label="創建工作計劃五步流程">
      <div className={uiTokens.stepperHeaderRow}>
        <h2 className={uiTokens.workPlanStepperTitle}>創建工作計劃（五步）</h2>
        {isCommitting ? (
          <span className={uiTokens.workPlanStepperBadge}>
            發布中…
          </span>
        ) : null}
      </div>
      <ol className={uiTokens.stepperStepsOlGrid}>
        {STEPS.map((step, index) => {
          const done = doneFlags[step.id]
          const active = stepIsActive(step.id)
          const cardClass = done5
            ? uiTokens.workPlanStepCardDone
            : active
              ? uiTokens.workPlanStepCardActive
              : done
                ? uiTokens.workPlanStepCardDone
                : uiTokens.workPlanStepCardPending
          const hintClass = done5
            ? uiTokens.workPlanStepHintComplete
            : active
              ? uiTokens.workPlanStepHintActive
              : uiTokens.workPlanStepHintIdle
          return (
            <li key={step.id}>
              <div className={cardClass}>
                <span className={uiTokens.textWeightSemibold}>
                  {done || done5 ? '✓ ' : ''}
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
