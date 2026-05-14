/** @vitest-environment happy-dom */
/** PDF 02【3】：排班 KPI 趨勢面板（Seq 15；過濾列、同步訊息、工具列、清單區塊）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { SchedulingKpiTrendPanel } from './SchedulingKpiTrendPanel'

afterEach(() => {
  cleanup()
})

const oneRow: SchedulingKpiRunRecord = {
  ranAt: '2026-05-09T08:00:00.000Z',
  kpis: { coverageRate: 8, conflictRatePer100: 1, averageAssignmentsPerResident: 0.4, underTargetRate: 6 },
  residentCount: 2,
  assignmentCount: 1,
  conflictCount: 0,
}

describe('SchedulingKpiTrendPanel', () => {
  it('工具列按鈕會呼叫對應 handler', () => {
    const onDownloadCsv = vi.fn()
    const onClearHistory = vi.fn()
    const onRetrySync = vi.fn()
    render(
      <SchedulingKpiTrendPanel
        history={[]}
        onDownloadCsv={onDownloadCsv}
        onClearHistory={onClearHistory}
        onRetrySync={onRetrySync}
        isRetryingSync={false}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: '重試同步' }))
    fireEvent.click(screen.getByRole('button', { name: '下載 KPI 趨勢 CSV' }))
    fireEvent.click(screen.getByRole('button', { name: '清除歷史' }))
    expect(onRetrySync).toHaveBeenCalledTimes(1)
    expect(onDownloadCsv).toHaveBeenCalledTimes(1)
    expect(onClearHistory).toHaveBeenCalledTimes(1)
  })

  it('syncError 與 hasPendingSync 顯示待同步說明', () => {
    render(
      <SchedulingKpiTrendPanel
        history={[]}
        syncError="同步失敗"
        hasPendingSync
      />,
    )
    expect(screen.getByText('同步失敗')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/待同步項目/)).toBeInstanceOf(HTMLElement)
  })

  it('syncNotice 顯示成功區塊', () => {
    render(<SchedulingKpiTrendPanel history={[]} syncNotice="已同步" />)
    expect(screen.getByText('已同步')).toBeInstanceOf(HTMLElement)
  })

  it('isRetryingSync 時重試按鈕 disabled', () => {
    render(
      <SchedulingKpiTrendPanel history={[]} onRetrySync={vi.fn()} isRetryingSync />,
    )
    expect((screen.getByRole('button', { name: '同步重試中...' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('展開清單後空歷史顯示提示', () => {
    render(<SchedulingKpiTrendPanel history={[]} />)
    fireEvent.click(screen.getByRole('button', { name: '展開' }))
    expect(screen.getByText('目前沒有符合條件的趨勢資料。')).toBeInstanceOf(HTMLElement)
  })

  it('展開清單後有資料顯示表格表頭', () => {
    render(<SchedulingKpiTrendPanel history={[oneRow]} />)
    fireEvent.click(screen.getByRole('button', { name: '展開' }))
    expect(screen.getByRole('columnheader', { name: '時間' })).toBeInstanceOf(HTMLElement)
  })
})
