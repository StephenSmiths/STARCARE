/** @vitest-environment happy-dom */
/** PDF 02【3】：排班儀表板標題列與啟動排班按鈕（Seq 15）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SchedulingToolbar } from './SchedulingToolbar'

afterEach(() => {
  cleanup()
})

describe('SchedulingToolbar', () => {
  it('點擊啟動智能排班會呼叫 onRunScheduling', () => {
    const onRun = vi.fn()
    render(<SchedulingToolbar onRunScheduling={onRun} isRunning={false} />)
    fireEvent.click(screen.getByRole('button', { name: '啟動智能排班' }))
    expect(onRun).toHaveBeenCalledTimes(1)
  })

  it('disableRun 時按鈕 disabled 並帶 title', () => {
    render(
      <SchedulingToolbar
        onRunScheduling={vi.fn()}
        isRunning={false}
        disableRun
        disableRunReason="請先確認週更表"
      />,
    )
    const btn = screen.getByRole('button', { name: '啟動智能排班' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    expect(btn.getAttribute('title')).toBe('請先確認週更表')
  })

  it('isRunning 時顯示執行中且按鈕 disabled', () => {
    render(<SchedulingToolbar onRunScheduling={vi.fn()} isRunning />)
    const btn = screen.getByRole('button', { name: '排班執行中…' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })
})
