/** @vitest-environment happy-dom */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_SYSTEM_SETTINGS } from '../repository/systemSettingsRepository'
import type { SystemSettingsSnapshot } from '../types'
import { SystemSettingsNonTherapyIntervalsEditor } from './SystemSettingsNonTherapyIntervalsEditor'

const baseDraft = (): SystemSettingsSnapshot => ({ ...DEFAULT_SYSTEM_SETTINGS })

describe('SystemSettingsNonTherapyIntervalsEditor', () => {
  it('勾選多段時以午休初始化並可新增一段', () => {
    const setField = vi.fn()
    const draft = baseDraft()
    const { rerender } = render(<SystemSettingsNonTherapyIntervalsEditor draft={draft} setField={setField} />)
    fireEvent.click(screen.getByRole('checkbox', { name: /啟用多段/ }))
    expect(setField).toHaveBeenCalledWith('subsidizedRehabNonTherapyIntervals', [
      { timeStart: draft.nonTherapyWindowStart, timeEnd: draft.nonTherapyWindowEnd },
    ])
    setField.mockClear()
    const draft2 = {
      ...draft,
      subsidizedRehabNonTherapyIntervals: [{ timeStart: '12:00', timeEnd: '14:00' }],
    }
    rerender(<SystemSettingsNonTherapyIntervalsEditor draft={draft2} setField={setField} />)
    fireEvent.click(screen.getByRole('button', { name: '新增一段' }))
    expect(setField).toHaveBeenCalled()
  })
})
