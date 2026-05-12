/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsSchedulingWindowsCard } from './SystemSettingsSchedulingWindowsCard'

afterEach(() => {
  cleanup()
})

const baseDraft = {
  schedulingWindowStart: '08:00',
  schedulingWindowEnd: '20:00',
  nonTherapyWindowStart: '12:00',
  nonTherapyWindowEnd: '13:00',
  shiftPrepBlockEnabled: false,
}

describe('SystemSettingsSchedulingWindowsCard', () => {
  it('排班與非治療欄位可見，變更委派 setField', () => {
    const setField = vi.fn()
    render(<SystemSettingsSchedulingWindowsCard draft={baseDraft} setField={setField} />)
    const start = screen.getByLabelText('排班開始（HH:mm）') as HTMLInputElement
    expect(start.value).toBe('08:00')
    expect((screen.getByLabelText('排班結束（HH:mm）') as HTMLInputElement).value).toBe('20:00')
    expect((screen.getByLabelText('非治療時段開始') as HTMLInputElement).value).toBe('12:00')
    expect((screen.getByLabelText('非治療時段結束') as HTMLInputElement).value).toBe('13:00')
    const prep = screen.getByRole('checkbox', {
      name: /啟用開工準備時段/,
    }) as HTMLInputElement
    expect(prep.checked).toBe(false)
    fireEvent.change(start, { target: { value: '09:00' } })
    expect(setField).toHaveBeenCalledWith('schedulingWindowStart', '09:00')
    fireEvent.click(prep)
    expect(setField).toHaveBeenCalledWith('shiftPrepBlockEnabled', true)
  })
})
