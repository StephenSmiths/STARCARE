/** @vitest-environment happy-dom */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_POLICY_SUBSIDIZED_PASS_ORDER } from '../domain/policyPassOrderDraft'
import { DEFAULT_SYSTEM_SETTINGS } from '../repository/systemSettingsRepository'
import { SystemSettingsPassOrderCard } from './SystemSettingsPassOrderCard'

describe('SystemSettingsPassOrderCard', () => {
  it('下移時委派 setField 更新 Pass 次序並標記 hydrated', () => {
    const setField = vi.fn()
    render(
      <SystemSettingsPassOrderCard
        draft={{
          ...DEFAULT_SYSTEM_SETTINGS,
          policySubsidizedPassOrder: [...DEFAULT_POLICY_SUBSIDIZED_PASS_ORDER],
          policySubsidizedPassOrderHydrated: true,
        }}
        setField={setField}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /Pass 1 下移/ }))
    expect(setField).toHaveBeenCalledWith('policySubsidizedPassOrder', expect.any(Array))
    expect(setField).toHaveBeenCalledWith('policySubsidizedPassOrderHydrated', true)
  })
})
