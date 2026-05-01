import { describe, expect, it } from 'vitest'
import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import { buildApprovedServiceFormsCsv } from './approvedServiceFormsCsvService'

describe('approvedServiceFormsCsvService', () => {
  it('應含標頭與換行跳脫', () => {
    const row = {
      id: 'x',
      sessionId: 's',
      sessionDate: '2026-05-01',
      staffProfileId: 'p',
      residentId: 'r',
      residentName: '測,試',
      narrative: '第一行\n第二行',
      status: 'APPROVED',
      ownerActorId: 'o',
      createdAt: '',
      updatedAt: '',
      submittedAt: null,
      reviewedAt: null,
      reviewerActorId: null,
      reviewNote: null,
    } satisfies ServiceFormRecord
    const csv = buildApprovedServiceFormsCsv([row])
    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv).toContain('表單ID')
    expect(csv).toContain('第一行')
  })
})
