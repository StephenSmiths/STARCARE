/** @vitest-environment happy-dom */
/** PDF 02【3】：KPI 趨勢歷史過濾列（Seq 15）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingKpiHistoryFilter } from '../types/schedulingKpiHistoryFilter'
import { SchedulingKpiTrendFilterBar } from './SchedulingKpiTrendFilterBar'

afterEach(() => {
  cleanup()
})

const rowWithActor: SchedulingKpiRunRecord = {
  ranAt: '2026-05-09T10:00:00.000Z',
  kpis: { coverageRate: 0, conflictRatePer100: 0, averageAssignmentsPerResident: 0, underTargetRate: 0 },
  residentCount: 0,
  assignmentCount: 0,
  conflictCount: 0,
  actorId: 'actor-kpi-1',
}

describe('SchedulingKpiTrendFilterBar', () => {
  it('無過濾時摘要為未套用', () => {
    render(<SchedulingKpiTrendFilterBar history={[]} />)
    expect(screen.getByText('目前：未套用過濾條件')).toBeInstanceOf(HTMLElement)
  })

  it('currentFilter 有值時摘要列出條件', () => {
    const f: SchedulingKpiHistoryFilter = { from: '2026-05-01', to: '2026-05-08', actorId: 'u1' }
    render(<SchedulingKpiTrendFilterBar history={[]} currentFilter={f} />)
    expect(screen.getByText(/目前：起：2026-05-01/)).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/迄：2026-05-08/)).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/操作者：u1/)).toBeInstanceOf(HTMLElement)
  })

  it('套用過濾會呼叫 onApplyFilter；重置會呼叫 onResetFilter', () => {
    const onApply = vi.fn()
    const onReset = vi.fn()
    render(
      <SchedulingKpiTrendFilterBar
        history={[rowWithActor]}
        onApplyFilter={onApply}
        onResetFilter={onReset}
        isApplyingFilter={false}
      />,
    )
    fireEvent.change(screen.getAllByDisplayValue('')[0], { target: { value: '2026-05-02' } })
    fireEvent.click(screen.getByRole('button', { name: '套用過濾' }))
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ from: '2026-05-02', to: '', actorId: '' }),
    )

    fireEvent.click(screen.getByRole('button', { name: '重置' }))
    expect(onReset).toHaveBeenCalled()
  })

  it('查詢中時按鈕 disabled', () => {
    render(
      <SchedulingKpiTrendFilterBar history={[]} onApplyFilter={vi.fn()} onResetFilter={vi.fn()} isApplyingFilter />,
    )
    expect((screen.getByRole('button', { name: '查詢中...' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: '重置' }) as HTMLButtonElement).disabled).toBe(true)
  })
})
