import { describe, expect, it } from 'vitest'
import type { WeeklyRosterDraftRow } from './weeklyRosterImportParseText'
import { expandWeeklyRosterDraftsByPolicySlotDuration } from './weeklyRosterDraftSlotSplit'

const draft = (over: Partial<WeeklyRosterDraftRow>): WeeklyRosterDraftRow => ({
  rowIndex: 2,
  serviceLabel: '資助復康服務',
  role: 'PT',
  displayName: '王小明',
  sessionDate: '2026-05-11',
  startHm: '08:00',
  endHm: '10:00',
  residentScope: '全院',
  ...over,
})

describe('expandWeeklyRosterDraftsByPolicySlotDuration', () => {
  it('無政策時 2 小時切為 30 分鐘多列', () => {
    const out = expandWeeklyRosterDraftsByPolicySlotDuration([draft({})], null)
    expect(out.length).toBeGreaterThan(1)
    expect(out[0]?.splitPart).toBe(0)
    expect(out[0]?.startHm).toBe('08:00')
  })
})
