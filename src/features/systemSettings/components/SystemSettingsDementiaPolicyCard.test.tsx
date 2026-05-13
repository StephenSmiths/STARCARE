/** @vitest-environment happy-dom */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_SYSTEM_SETTINGS } from '../repository/systemSettingsRepository'
import { SystemSettingsDementiaPolicyCard } from './SystemSettingsDementiaPolicyCard'

describe('SystemSettingsDementiaPolicyCard', () => {
  it('載入 8 格時委派 setField 並標記職類格 hydrated', () => {
    const setField = vi.fn()
    render(<SystemSettingsDementiaPolicyCard draft={DEFAULT_SYSTEM_SETTINGS} setField={setField} />)
    fireEvent.click(screen.getByRole('button', { name: /載入認知職類格/ }))
    expect(setField).toHaveBeenCalledWith('policyDementiaRoleOfferings', expect.any(Array))
    expect(setField).toHaveBeenCalledWith('policyDementiaRoleOfferingsHydrated', true)
  })
})
