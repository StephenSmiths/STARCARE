/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsSchedulingDetailPresetsCard } from './SystemSettingsSchedulingDetailPresetsCard'

afterEach(() => {
  cleanup()
})

const baseDraft = {
  schedulingDetailPresetParam1: false,
  schedulingDetailPresetParam2: true,
  schedulingDetailPresetParam3: false,
}

describe('SystemSettingsSchedulingDetailPresetsCard', () => {
  it('三個預留參數可見，勾選變更委派 setField', () => {
    const setField = vi.fn()
    render(<SystemSettingsSchedulingDetailPresetsCard draft={baseDraft} setField={setField} />)
    const p1 = screen.getByRole('checkbox', { name: /排班細節參數 1/ }) as HTMLInputElement
    const p2 = screen.getByRole('checkbox', { name: /排班細節參數 2/ }) as HTMLInputElement
    const p3 = screen.getByRole('checkbox', { name: /排班細節參數 3/ }) as HTMLInputElement
    expect(p1.checked).toBe(false)
    expect(p2.checked).toBe(true)
    expect(p3.checked).toBe(false)
    fireEvent.click(p1)
    expect(setField).toHaveBeenCalledWith('schedulingDetailPresetParam1', true)
    fireEvent.click(p2)
    expect(setField).toHaveBeenCalledWith('schedulingDetailPresetParam2', false)
    fireEvent.click(p3)
    expect(setField).toHaveBeenCalledWith('schedulingDetailPresetParam3', true)
  })
})
