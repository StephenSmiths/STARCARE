/** @vitest-environment happy-dom */
/** PDF 02【3】：排班歷史批次軟刪（01 §5／Seq 10；僅 TeamLead／Admin）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SchedulingHistoryUndoPanel } from './SchedulingHistoryUndoPanel'

afterEach(() => {
  cleanup()
})

describe('SchedulingHistoryUndoPanel', () => {
  it('Staff 僅顯示說明、無撤銷按鈕', () => {
    render(<SchedulingHistoryUndoPanel role="Staff" lastBatchId={null} isUndoing={false} onUndo={vi.fn()} />)
    expect(screen.getByText(/排班歷史批次撤銷僅 TeamLead／Admin/)).toBeInstanceOf(HTMLElement)
    expect(screen.queryByRole('button', { name: '軟刪除上次儲存批次' })).toBeNull()
  })

  it('尚無 batch id 時撤銷按鈕 disabled', () => {
    render(<SchedulingHistoryUndoPanel role="Admin" lastBatchId={null} isUndoing={false} onUndo={vi.fn()} />)
    const btn = screen.getByRole('button', { name: '軟刪除上次儲存批次' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    expect(screen.getByText(/（尚無，請先成功儲存）/)).toBeInstanceOf(HTMLElement)
  })

  it('有 batch id 時點擊會呼叫 onUndo', () => {
    const onUndo = vi.fn()
    render(
      <SchedulingHistoryUndoPanel role="TeamLead" lastBatchId="batch-xyz" isUndoing={false} onUndo={onUndo} />,
    )
    const btn = screen.getByRole('button', { name: '軟刪除上次儲存批次' }) as HTMLButtonElement
    expect(btn.disabled).toBe(false)
    fireEvent.click(btn)
    expect(onUndo).toHaveBeenCalledTimes(1)
  })

  it('處理中時按鈕 disabled 且顯示處理中', () => {
    render(
      <SchedulingHistoryUndoPanel role="Admin" lastBatchId="b1" isUndoing onUndo={vi.fn()} />,
    )
    const btn = screen.getByRole('button', { name: '處理中…' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })
})
