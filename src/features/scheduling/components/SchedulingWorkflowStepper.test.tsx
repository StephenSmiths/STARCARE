/** @vitest-environment happy-dom */
/** PDF 02【3】：五步進度列呈現（Seq 15）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { SchedulingWorkflowUiModel } from '../services/schedulingWorkflowStepService'
import { SchedulingWorkflowStepper } from './SchedulingWorkflowStepper'

afterEach(() => {
  cleanup()
})

const baseModel: SchedulingWorkflowUiModel = {
  activeStep: 3,
  step1Done: true,
  step2Done: true,
  step3Done: false,
  step4Done: false,
  step5Done: false,
}

describe('SchedulingWorkflowStepper', () => {
  it('顯示已載入時段節數徽章', () => {
    render(<SchedulingWorkflowStepper model={baseModel} sessionCount={12} />)
    expect(screen.getByText('已載入時段：12 節')).toBeInstanceOf(HTMLElement)
  })

  it('五步提示與區塊 aria-label 可見', () => {
    render(<SchedulingWorkflowStepper model={baseModel} sessionCount={1} />)
    expect(screen.getByRole('region', { name: '智能排班五步流程' })).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('Excel 範本與活動時段主檔一致')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('核對本週更表／時段')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('執行 3-Pass 與約束')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('指派與衝突檢視')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('無衝突後儲存')).toBeInstanceOf(HTMLElement)
  })

  it('步驟一完成時顯示勾選前綴', () => {
    const model: SchedulingWorkflowUiModel = {
      activeStep: 2,
      step1Done: true,
      step2Done: false,
      step3Done: false,
      step4Done: false,
      step5Done: false,
    }
    render(<SchedulingWorkflowStepper model={model} sessionCount={3} />)
    expect(screen.getByText(/✓\s*1\.\s*導入週更表/)).toBeInstanceOf(HTMLElement)
  })
})
