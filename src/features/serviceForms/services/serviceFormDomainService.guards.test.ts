import { describe, expect, it } from 'vitest'
import type { ServiceFormRecord } from '../types/serviceForm'
import { assertFormEditable, assertSessionAcceptedForSubmit } from './serviceFormDomainService'

/** 測試用最小列（僅 assertFormEditable 會讀 status） */
const minimalForm = (status: ServiceFormRecord['status']): ServiceFormRecord => ({
  id: 'form-lock-1',
  sessionId: 'sess-form-1',
  sessionDate: '2026-05-15',
  staffProfileId: 'staff-match',
  residentId: 'res-1',
  residentName: '院友甲',
  narrative: '紀要',
  status,
  ownerActorId: 'actor-staff',
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
  submittedAt: status === 'DRAFT' ? null : '2026-05-01T01:00:00.000Z',
  reviewedAt: status === 'APPROVED' ? '2026-05-01T02:00:00.000Z' : null,
  reviewerActorId: status === 'APPROVED' ? 'actor-lead' : null,
  reviewNote: null,
})

/** 01 §2.1／§2.2 守門函式（不依賴 localStorage；Seq 17） */
describe('serviceFormDomainService 守門', () => {
  it('assertSessionAcceptedForSubmit：未接收時拒絕', () => {
    expect(() => assertSessionAcceptedForSubmit('sess-form-1')).toThrow(/已接收/)
  })

  it('assertFormEditable：APPROVED 鎖定（01 §2.2）', () => {
    expect(() => assertFormEditable(minimalForm('APPROVED'))).toThrow(/已核准並鎖定/)
  })

  it('assertFormEditable：SUBMITTED 不可再改草稿（01 §2.2）', () => {
    expect(() => assertFormEditable(minimalForm('SUBMITTED'))).toThrow(/待審/)
  })
})
