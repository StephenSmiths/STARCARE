/** @vitest-environment happy-dom */
/** PDF 02【3】：五步區塊與週更表確認勾選、匯入成功回呼（Seq 15）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('./SchedulingWorkflowStepper', () => ({
  SchedulingWorkflowStepper: () => <div data-testid="workflow-stepper" />,
}))

vi.mock('./SchedulingWeeklyRosterPanel', () => ({
  SchedulingWeeklyRosterPanel: ({ onCommitSuccess }: { onCommitSuccess: () => void }) => (
    <button type="button" data-testid="roster-sim-commit" onClick={() => onCommitSuccess()}>
      sim roster commit
    </button>
  ),
}))

import { SchedulingWorkflowSection } from './SchedulingWorkflowSection'

afterEach(() => {
  cleanup()
})

const baseProps = {
  rosterConfirmed: false,
  onRosterConfirmedChange: vi.fn(),
  assignmentCount: 0,
  conflictCount: 0,
  saveSuccess: false,
  onRosterImportCommitted: vi.fn(),
}

describe('SchedulingWorkflowSection', () => {
  it('有時段未確認時顯示提示且勾選委派 onRosterConfirmedChange', () => {
    const onRosterConfirmedChange = vi.fn()
    render(
      <SchedulingWorkflowSection
        {...baseProps}
        sessionCount={3}
        onRosterConfirmedChange={onRosterConfirmedChange}
      />,
    )
    expect(screen.getByText(/請勾選確認後/)).toBeInstanceOf(HTMLElement)
    const box = screen.getByRole('checkbox', { name: /我已確認本週更表/ }) as HTMLInputElement
    expect(box.disabled).toBe(false)
    fireEvent.click(box)
    expect(onRosterConfirmedChange).toHaveBeenCalledWith(true)
  })

  it('無時段時確認勾選為 disabled', () => {
    render(<SchedulingWorkflowSection {...baseProps} sessionCount={0} />)
    const box = screen.getByRole('checkbox', { name: /我已確認本週更表/ }) as HTMLInputElement
    expect(box.disabled).toBe(true)
  })

  it('週更表 onCommitSuccess 時委派 onRosterImportCommitted', () => {
    const onRosterImportCommitted = vi.fn()
    render(
      <SchedulingWorkflowSection {...baseProps} sessionCount={1} onRosterImportCommitted={onRosterImportCommitted} />,
    )
    fireEvent.click(screen.getByTestId('roster-sim-commit'))
    expect(onRosterImportCommitted).toHaveBeenCalledTimes(1)
  })
})
