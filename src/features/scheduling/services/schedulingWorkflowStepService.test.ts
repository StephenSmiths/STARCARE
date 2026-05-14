import { describe, expect, it } from 'vitest'
import { buildSchedulingWorkflowUiModel } from './schedulingWorkflowStepService'

describe('schedulingWorkflowStepService (Seq 15)', () => {
  it('無時段時聚焦步驟 1', () => {
    const m = buildSchedulingWorkflowUiModel({
      sessionCount: 0,
      rosterConfirmed: false,
      assignmentCount: 0,
      conflictCount: 0,
      saveSuccess: false,
    })
    expect(m.activeStep).toBe(1)
    expect(m.step1Done).toBe(false)
  })

  it('有時段未確認時聚焦步驟 2', () => {
    const m = buildSchedulingWorkflowUiModel({
      sessionCount: 3,
      rosterConfirmed: false,
      assignmentCount: 0,
      conflictCount: 0,
      saveSuccess: false,
    })
    expect(m.activeStep).toBe(2)
    expect(m.step1Done).toBe(true)
  })

  it('已確認、尚未跑排班時聚焦步驟 3', () => {
    const m = buildSchedulingWorkflowUiModel({
      sessionCount: 2,
      rosterConfirmed: true,
      assignmentCount: 0,
      conflictCount: 0,
      saveSuccess: false,
    })
    expect(m.activeStep).toBe(3)
  })

  it('有指派但有衝突時聚焦步驟 4（預覽／調整）', () => {
    const m = buildSchedulingWorkflowUiModel({
      sessionCount: 1,
      rosterConfirmed: true,
      assignmentCount: 5,
      conflictCount: 2,
      saveSuccess: false,
    })
    expect(m.activeStep).toBe(4)
    expect(m.step4Done).toBe(false)
  })

  it('無衝突但未儲存時聚焦步驟 5', () => {
    const m = buildSchedulingWorkflowUiModel({
      sessionCount: 1,
      rosterConfirmed: true,
      assignmentCount: 4,
      conflictCount: 0,
      saveSuccess: false,
    })
    expect(m.activeStep).toBe(5)
    expect(m.step4Done).toBe(true)
    expect(m.step5Done).toBe(false)
  })

  it('儲存成功時 step5Done 為 true（activeStep 仍為 5）', () => {
    const m = buildSchedulingWorkflowUiModel({
      sessionCount: 1,
      rosterConfirmed: true,
      assignmentCount: 2,
      conflictCount: 0,
      saveSuccess: true,
    })
    expect(m.activeStep).toBe(5)
    expect(m.step5Done).toBe(true)
  })
})
