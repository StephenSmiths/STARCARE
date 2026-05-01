/**
 * PDF 02【3】智能排班五步：導入週更表→確認→排班→預覽→確認採用（Seq 15 UI 狀態模型）。
 * 對齊 01 §3：時段資料須先就緒並經人工確認後再觸發引擎。
 */
export type SchedulingWorkflowStepId = 1 | 2 | 3 | 4 | 5

export interface SchedulingWorkflowSignals {
  sessionCount: number
  rosterConfirmed: boolean
  assignmentCount: number
  conflictCount: number
  saveSuccess: boolean
}

export interface SchedulingWorkflowUiModel {
  activeStep: SchedulingWorkflowStepId
  step1Done: boolean
  step2Done: boolean
  step3Done: boolean
  step4Done: boolean
  step5Done: boolean
}

export const buildSchedulingWorkflowUiModel = (s: SchedulingWorkflowSignals): SchedulingWorkflowUiModel => {
  const step1Done = s.sessionCount > 0
  const step2Done = step1Done && s.rosterConfirmed
  const step3Done = step2Done && s.assignmentCount > 0
  const step4Done = step3Done && s.conflictCount === 0
  const step5Done = s.saveSuccess

  const activeStep: SchedulingWorkflowStepId = !step1Done
    ? 1
    : !step2Done
      ? 2
      : !step3Done
        ? 3
        : !step4Done
          ? 4
          : 5

  return { activeStep, step1Done, step2Done, step3Done, step4Done, step5Done }
}
