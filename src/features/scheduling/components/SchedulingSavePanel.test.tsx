/** @vitest-environment happy-dom */
/** PDF 02【3】：無衝突時一鍵儲存排班（Seq 15；對齊 scheduling_history 閉環敘述）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SchedulingSavePanel } from './SchedulingSavePanel'

afterEach(() => {
  cleanup()
})

describe('SchedulingSavePanel', () => {
  it('可儲存時點擊一鍵儲存會呼叫 onSave', () => {
    const onSave = vi.fn()
    render(<SchedulingSavePanel canSave hasConflicts={false} isSaving={false} onSave={onSave} />)
    const btn = screen.getByRole('button', { name: '一鍵儲存排班結果' }) as HTMLButtonElement
    expect(btn.disabled).toBe(false)
    fireEvent.click(btn)
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('有衝突時顯示勿儲存說明且按鈕 disabled', () => {
    render(<SchedulingSavePanel canSave hasConflicts isSaving={false} onSave={vi.fn()} />)
    expect(screen.getByText(/目前存在排班衝突/)).toBeInstanceOf(HTMLElement)
    const btn = screen.getByRole('button', { name: '一鍵儲存排班結果' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('儲存中時按鈕文案與 disabled', () => {
    render(<SchedulingSavePanel canSave hasConflicts={false} isSaving onSave={vi.fn()} />)
    const btn = screen.getByRole('button', { name: '儲存中…' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })
})
