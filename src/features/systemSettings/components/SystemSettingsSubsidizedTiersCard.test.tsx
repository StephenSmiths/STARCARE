/** @vitest-environment happy-dom */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_POLICY_SUBSIDIZED_TIER_ROWS } from '../domain/policySubsidizedTierDraft'
import { DEFAULT_SYSTEM_SETTINGS } from '../repository/systemSettingsRepository'
import { SystemSettingsSubsidizedTiersCard } from './SystemSettingsSubsidizedTiersCard'

describe('SystemSettingsSubsidizedTiersCard', () => {
  it('載入預設三列時委派 setField 並標記 hydrated', () => {
    const setField = vi.fn()
    render(<SystemSettingsSubsidizedTiersCard draft={DEFAULT_SYSTEM_SETTINGS} setField={setField} />)
    fireEvent.click(screen.getByRole('button', { name: '載入預設資助三列' }))
    const tierArg = setField.mock.calls.find((c) => c[0] === 'policySubsidizedTiers')?.[1]
    expect(tierArg).toEqual(DEFAULT_POLICY_SUBSIDIZED_TIER_ROWS)
    expect(setField).toHaveBeenCalledWith('policySubsidizedTiersHydrated', true)
  })
})
