/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsSpecialCareCard } from './SystemSettingsSpecialCareCard'

afterEach(() => {
  cleanup()
})

describe('SystemSettingsSpecialCareCard', () => {
  it('SC 僅治療師開關可見，勾選變更委派 setField', () => {
    const setField = vi.fn()
    const { rerender } = render(
      <SystemSettingsSpecialCareCard draft={{ specialCareTherapistOnly: false }} setField={setField} />,
    )
    const box = () => screen.getByRole('checkbox', { name: /Special Care 僅由治療師承接/ }) as HTMLInputElement
    expect(box().checked).toBe(false)
    fireEvent.click(box())
    expect(setField).toHaveBeenCalledWith('specialCareTherapistOnly', true)
    rerender(<SystemSettingsSpecialCareCard draft={{ specialCareTherapistOnly: true }} setField={setField} />)
    expect(box().checked).toBe(true)
    fireEvent.click(box())
    expect(setField).toHaveBeenCalledWith('specialCareTherapistOnly', false)
  })
})
