import { describe, expect, it } from 'vitest'
import type { ServiceFormRecord } from '../types/serviceForm'
import { assertServiceFormSoftDeletable } from './serviceFormSoftDeleteService'

const form = (status: ServiceFormRecord['status'], owner = 'u1'): ServiceFormRecord =>
  ({
    id: 'f1',
    sessionId: 's',
    sessionDate: '2026-05-01',
    staffProfileId: 'sp',
    residentId: 'r',
    residentName: 'A',
    narrative: '',
    status,
    ownerActorId: owner,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    submittedAt: null,
    reviewedAt: null,
    reviewerActorId: null,
    reviewNote: null,
  }) as ServiceFormRecord

describe('serviceFormSoftDeleteService', () => {
  it('已核准不可刪', () => {
    expect(() => assertServiceFormSoftDeletable('Staff', 'u1', form('APPROVED'))).toThrow(/核准/)
  })

  it('Staff 不可刪他人表單', () => {
    expect(() => assertServiceFormSoftDeletable('Staff', 'u2', form('DRAFT', 'u1'))).toThrow(/本人/)
  })

  it('Staff 可刪本人草稿', () => {
    expect(() => assertServiceFormSoftDeletable('Staff', 'u1', form('DRAFT', 'u1'))).not.toThrow()
  })

  it('TeamLead 可刪非核准', () => {
    expect(() => assertServiceFormSoftDeletable('TeamLead', 'lead-1', form('SUBMITTED', 'u1'))).not.toThrow()
  })

  it('Admin 可刪非核准', () => {
    expect(() => assertServiceFormSoftDeletable('Admin', 'admin-1', form('SUBMITTED', 'u1'))).not.toThrow()
  })
})
