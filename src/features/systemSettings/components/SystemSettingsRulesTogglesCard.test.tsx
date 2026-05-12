/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsRulesTogglesCard } from './SystemSettingsRulesTogglesCard'

afterEach(() => {
  cleanup()
})

const baseDraft = {
  rulesEngineEnabled: false,
  fixedActivitiesEnabled: true,
  serviceTypesEnabled: false,
}

describe('SystemSettingsRulesTogglesCard', () => {
  it('三個總開關可見，勾選變更委派 setField', () => {
    const setField = vi.fn()
    render(<SystemSettingsRulesTogglesCard draft={baseDraft} setField={setField} />)
    const rules = screen.getByRole('checkbox', { name: /啟用排班規則引擎/ }) as HTMLInputElement
    const fixed = screen.getByRole('checkbox', { name: /啟用固定活動/ }) as HTMLInputElement
    const service = screen.getByRole('checkbox', { name: /啟用服務類型/ }) as HTMLInputElement
    expect(rules.checked).toBe(false)
    expect(fixed.checked).toBe(true)
    expect(service.checked).toBe(false)
    fireEvent.click(rules)
    expect(setField).toHaveBeenCalledWith('rulesEngineEnabled', true)
    fireEvent.click(fixed)
    expect(setField).toHaveBeenCalledWith('fixedActivitiesEnabled', false)
    fireEvent.click(service)
    expect(setField).toHaveBeenCalledWith('serviceTypesEnabled', true)
  })
})
