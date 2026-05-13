/** @vitest-environment happy-dom */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_SYSTEM_SETTINGS } from '../repository/systemSettingsRepository'
import { SystemSettingsFixedActivitiesCard } from './SystemSettingsFixedActivitiesCard'

describe('SystemSettingsFixedActivitiesCard', () => {
  it('新增固定活動委派 setField', () => {
    const setField = vi.fn()
    render(
      <SystemSettingsFixedActivitiesCard
        draft={{ ...DEFAULT_SYSTEM_SETTINGS, policyFixedActivities: [] }}
        setField={setField}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: '新增固定活動' }))
    expect(setField).toHaveBeenCalledWith('policyFixedActivities', expect.any(Array))
  })
})
