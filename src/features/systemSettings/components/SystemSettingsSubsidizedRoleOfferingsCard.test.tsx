/** @vitest-environment happy-dom */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS,
  POLICY_SUBSIDIZED_ROLE_OFFERING_COUNT,
} from '../domain/policySubsidizedRoleOfferingDraft'
import { DEFAULT_SYSTEM_SETTINGS } from '../repository/systemSettingsRepository'
import { SystemSettingsSubsidizedRoleOfferingsCard } from './SystemSettingsSubsidizedRoleOfferingsCard'

describe('SystemSettingsSubsidizedRoleOfferingsCard', () => {
  it('載入 48 格時委派 setField 並標記 hydrated', () => {
    const setField = vi.fn()
    render(<SystemSettingsSubsidizedRoleOfferingsCard draft={DEFAULT_SYSTEM_SETTINGS} setField={setField} />)
    fireEvent.click(screen.getByRole('button', { name: '載入完整職類矩陣（48 格）' }))
    const arg = setField.mock.calls.find((c) => c[0] === 'policySubsidizedRoleOfferings')?.[1]
    expect(arg).toHaveLength(POLICY_SUBSIDIZED_ROLE_OFFERING_COUNT)
    expect(arg).toEqual(DEFAULT_POLICY_SUBSIDIZED_ROLE_OFFERINGS)
    expect(setField).toHaveBeenCalledWith('policySubsidizedRoleOfferingsHydrated', true)
  })
})
