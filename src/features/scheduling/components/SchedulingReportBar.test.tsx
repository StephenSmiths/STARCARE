/** @vitest-environment happy-dom */
/** PDF 02【3】：合規與週三提醒 CSV 下載列（Seq 15）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SchedulingReportBar } from './SchedulingReportBar'

afterEach(() => {
  cleanup()
})

describe('SchedulingReportBar', () => {
  it('兩顆下載鈕可點時委派對應 handler', () => {
    const onCsv = vi.fn()
    const onAlerts = vi.fn()
    render(
      <SchedulingReportBar
        onDownloadCsv={onCsv}
        onDownloadAlertsCsv={onAlerts}
        disabled={false}
        alertDisabled={false}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: '下載本週合規報表' }))
    fireEvent.click(screen.getByRole('button', { name: '下載週三提醒清單' }))
    expect(onCsv).toHaveBeenCalledTimes(1)
    expect(onAlerts).toHaveBeenCalledTimes(1)
  })

  it('disabled／alertDisabled 時對應按鈕不可點', () => {
    render(
      <SchedulingReportBar
        onDownloadCsv={vi.fn()}
        onDownloadAlertsCsv={vi.fn()}
        disabled
        alertDisabled={false}
      />,
    )
    const csvBtn = screen.getByRole('button', { name: '下載本週合規報表' }) as HTMLButtonElement
    const alertBtn = screen.getByRole('button', { name: '下載週三提醒清單' }) as HTMLButtonElement
    expect(csvBtn.disabled).toBe(true)
    expect(alertBtn.disabled).toBe(false)
  })
})
