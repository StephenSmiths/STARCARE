import { describe, expect, it, beforeEach } from 'vitest'
import type { SchedulingSession } from '../../../services/schedulingService'
import { workSessionResponseStore } from '../../../services/workSessionResponseStore'
import type { ServiceFormRecord } from '../types/serviceForm'
import { acceptWorkSession } from '../../workSessionPlans/services/workSessionPlanService'
import {
  deriveAcceptedOwnSessions,
  deriveMyForms,
  derivePendingReview,
} from './serviceFormWorkspaceDerived'

const sampleSession = (overrides: Partial<SchedulingSession> = {}): SchedulingSession => ({
  id: 'sess-1',
  staffId: 'staff-a',
  staffName: '張 PT',
  date: '2026-05-10',
  timeSlot: '09:00',
  serviceType: 'Subsidized_Rehab',
  capacity: 2,
  ...overrides,
})

const sampleForm = (overrides: Partial<ServiceFormRecord> = {}): ServiceFormRecord => ({
  id: 'f1',
  sessionId: 'sess-1',
  sessionDate: '2026-05-10',
  staffProfileId: 'staff-a',
  residentId: 'r1',
  residentName: '院友甲',
  narrative: '',
  status: 'DRAFT',
  ownerActorId: 'actor-owner',
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
  submittedAt: null,
  reviewedAt: null,
  reviewerActorId: null,
  reviewNote: null,
  ...overrides,
})

describe('serviceFormWorkspaceDerived (PDF 02【5】)', () => {
  beforeEach(() => {
    workSessionResponseStore.clearAll()
  })

  it('deriveAcceptedOwnSessions：無 staffProfileId 回空陣列', () => {
    expect(deriveAcceptedOwnSessions([sampleSession()], undefined)).toEqual([])
    expect(deriveAcceptedOwnSessions([sampleSession()], null)).toEqual([])
  })

  it('deriveAcceptedOwnSessions：僅保留已接收且 staffId 相符之工作節', () => {
    const s = sampleSession({ id: 'sess-a', staffId: 'staff-match' })
    acceptWorkSession('actor-1', 'sess-a')
    const rows = deriveAcceptedOwnSessions([s], 'staff-match')
    expect(rows).toHaveLength(1)
    expect(rows[0]?.responseStatus).toBe('ACCEPTED')
  })

  it('deriveAcceptedOwnSessions：staffId 不符則排除', () => {
    const s = sampleSession({ id: 'sess-b', staffId: 'staff-a' })
    acceptWorkSession('actor-1', 'sess-b')
    expect(deriveAcceptedOwnSessions([s], 'other-staff')).toEqual([])
  })

  it('deriveMyForms：依 ownerActorId 篩選', () => {
    const forms = [
      sampleForm({ id: '1', ownerActorId: 'me' }),
      sampleForm({ id: '2', ownerActorId: 'other' }),
    ]
    expect(deriveMyForms(forms, 'me')).toHaveLength(1)
    expect(deriveMyForms(forms, 'me')[0]?.id).toBe('1')
  })

  it('derivePendingReview：僅 SUBMITTED', () => {
    const forms = [
      sampleForm({ id: '1', status: 'DRAFT' }),
      sampleForm({ id: '2', status: 'SUBMITTED' }),
    ]
    expect(derivePendingReview(forms)).toHaveLength(1)
    expect(derivePendingReview(forms)[0]?.id).toBe('2')
  })
})
