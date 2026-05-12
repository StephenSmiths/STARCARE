/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsNumericCapsCard } from './SystemSettingsNumericCapsCard'

afterEach(() => {
  cleanup()
})

const baseDraft = {
  therapistGroupSessionsDailyCap: 3,
  assistantGroupSessionsDailyCap: 2,
  groupParticipantCap: 10,
}

describe('SystemSettingsNumericCapsCard', () => {
  it('數字上限欄位可見，變更委派 setField', () => {
    const setField = vi.fn()
    render(<SystemSettingsNumericCapsCard draft={baseDraft} setField={setField} />)
    const therapist = screen.getByLabelText('治療師小組活動每日上限（節）') as HTMLInputElement
    expect(therapist.value).toBe('3')
    expect((screen.getByLabelText('治療助理小組活動每日上限（節）') as HTMLInputElement).value).toBe('2')
    expect((screen.getByLabelText('小組人數上限') as HTMLInputElement).value).toBe('10')
    fireEvent.change(therapist, { target: { value: '5' } })
    expect(setField).toHaveBeenCalledWith('therapistGroupSessionsDailyCap', 5)
    const groupCap = screen.getByLabelText('小組人數上限') as HTMLInputElement
    fireEvent.change(groupCap, { target: { value: '12' } })
    expect(setField).toHaveBeenCalledWith('groupParticipantCap', 12)
  })
})
