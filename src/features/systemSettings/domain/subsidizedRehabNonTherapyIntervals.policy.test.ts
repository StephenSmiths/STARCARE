import { describe, expect, it } from 'vitest'
import { POLICY_SYNC_VALID_DRAFT } from '../hooks/policySyncTestDraft'
import { minimalSchedulingPolicyBundle } from '../../../repositories/schedulingPolicyRepository.fixtures'
import {
  draftOtherNonTherapySlotsFromIntervals,
  shouldAttachSubsidizedRehabNonTherapyIntervalsFromPolicy,
} from './subsidizedRehabNonTherapyIntervals'
import { mergeP1DraftIntoPolicyBundle } from './mergeP1DraftIntoPolicyBundle'

describe('shouldAttachSubsidizedRehabNonTherapyIntervalsFromPolicy', () => {
  it('僅 LUNCH 時不附加多段鍵', () => {
    expect(shouldAttachSubsidizedRehabNonTherapyIntervalsFromPolicy([{ slotKind: 'LUNCH', timeStart: '12:00', timeEnd: '13:00' }])).toBe(
      false,
    )
  })
  it('LUNCH＋開工準備時附加', () => {
    expect(
      shouldAttachSubsidizedRehabNonTherapyIntervalsFromPolicy([
        { slotKind: 'LUNCH', timeStart: '12:00', timeEnd: '13:00' },
        { slotKind: 'SHIFT_PREP_BLOCK', timeStart: '07:00', timeEnd: '07:30' },
      ]),
    ).toBe(true)
  })
  it('含 MORNING_DOC 時附加', () => {
    expect(
      shouldAttachSubsidizedRehabNonTherapyIntervalsFromPolicy([
        { slotKind: 'MORNING_DOC', timeStart: '09:00', timeEnd: '09:30' },
      ]),
    ).toBe(true)
  })
})

describe('draftOtherNonTherapySlotsFromIntervals', () => {
  it('略過與午休相同之列', () => {
    const d = {
      ...POLICY_SYNC_VALID_DRAFT,
      nonTherapyWindowStart: '12:00',
      nonTherapyWindowEnd: '13:00',
      subsidizedRehabNonTherapyIntervals: [
        { timeStart: '12:00', timeEnd: '13:00' },
        { timeStart: '15:00', timeEnd: '15:30' },
      ],
    }
    const out = draftOtherNonTherapySlotsFromIntervals(d)
    expect(out).toEqual([{ slotKind: 'OTHER', timeStart: '15:00', timeEnd: '15:30' }])
  })
})

describe('mergeP1DraftIntoPolicyBundle（OTHER 與雲端）', () => {
  it('草稿未定義多段時保留雲端 OTHER', () => {
    const base = {
      ...minimalSchedulingPolicyBundle,
      nonTherapySlots: [
        { slotKind: 'LUNCH', timeStart: '11:00', timeEnd: '12:00' },
        { slotKind: 'OTHER', timeStart: '15:00', timeEnd: '15:30' },
      ],
    }
    const draft = { ...POLICY_SYNC_VALID_DRAFT, nonTherapyWindowStart: '12:30', nonTherapyWindowEnd: '13:30' }
    const out = mergeP1DraftIntoPolicyBundle(draft, base, 'facility-main')
    expect(out.nonTherapySlots.some((s) => s.slotKind === 'OTHER' && s.timeStart === '15:00')).toBe(true)
  })

  it('草稿啟用多段時以 OTHER 寫入額外區間', () => {
    const base = { ...minimalSchedulingPolicyBundle, nonTherapySlots: [] }
    const draft = {
      ...POLICY_SYNC_VALID_DRAFT,
      nonTherapyWindowStart: '12:00',
      nonTherapyWindowEnd: '13:00',
      subsidizedRehabNonTherapyIntervals: [
        { timeStart: '12:00', timeEnd: '13:00' },
        { timeStart: '16:00', timeEnd: '16:30' },
      ],
    }
    const out = mergeP1DraftIntoPolicyBundle(draft, base, 'facility-main')
    expect(out.nonTherapySlots.filter((s) => s.slotKind === 'OTHER')).toEqual([
      { slotKind: 'OTHER', timeStart: '16:00', timeEnd: '16:30' },
    ])
  })
})
