import { describe, expect, it } from 'vitest'
import type { SchedulingSession } from '../../../services/schedulingService'
import { expandSchedulingSessionsByPolicySlotDuration } from './schedulingSessionSlotExpand'
import { P2_SESSION_SPLIT_MARKER } from './schedulingSessionIdNormalize'

const session = (over: Partial<SchedulingSession>): SchedulingSession => ({
  id: 'sess-1',
  staffId: 'st-1',
  staffName: '員工甲',
  date: '2026-05-11',
  timeSlot: '08:00-10:00',
  serviceType: 'Subsidized_Rehab',
  capacity: 6,
  staffRoleType: 'PT',
  ...over,
})

describe('expandSchedulingSessionsByPolicySlotDuration', () => {
  it('長時段展開為多個虛擬 session id', () => {
    const out = expandSchedulingSessionsByPolicySlotDuration([session({})], null)
    expect(out.length).toBeGreaterThan(1)
    expect(out[0]?.id).toContain(P2_SESSION_SPLIT_MARKER)
    expect(out[0]?.timeSlot).toBe('08:00-08:30')
  })
})
