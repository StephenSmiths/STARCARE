import { describe, expect, it } from 'vitest'
import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import {
  filterApprovedServiceFormsForArchive,
  selectApprovedServiceForms,
} from './historicalDocumentsDomainService'

const base = (over: Partial<ServiceFormRecord> & Pick<ServiceFormRecord, 'id'>): ServiceFormRecord =>
  ({
    sessionId: 's1',
    sessionDate: '2026-05-01',
    staffProfileId: 'sp',
    residentId: 'r1',
    residentName: '王小明',
    narrative: '復康散步',
    status: 'APPROVED',
    ownerActorId: 'o1',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
    submittedAt: '2026-05-01T08:00:00.000Z',
    reviewedAt: '2026-05-02T09:00:00.000Z',
    reviewerActorId: 'rv1',
    reviewNote: null,
    ...over,
  }) as ServiceFormRecord

describe('historicalDocumentsDomainService（PDF 02【10】）', () => {
  it('selectApprovedServiceForms 排除未核准', () => {
    const rows = [
      base({ id: 'a', status: 'APPROVED' }),
      base({ id: 'b', status: 'SUBMITTED', residentName: '乙' }),
    ]
    expect(selectApprovedServiceForms(rows)).toHaveLength(1)
    expect(selectApprovedServiceForms(rows)[0].id).toBe('a')
  })

  it('filterApprovedServiceFormsForArchive：日期與關鍵字', () => {
    const approved = [
      base({ id: '1', sessionDate: '2026-05-10', residentName: '甲', narrative: '洗澡' }),
      base({ id: '2', sessionDate: '2026-06-01', residentName: '乙', narrative: '散步' }),
    ]
    const f1 = filterApprovedServiceFormsForArchive(approved, {
      dateFrom: '2026-05-01',
      dateTo: '2026-05-31',
      keyword: '',
    })
    expect(f1.map((r) => r.id)).toEqual(['1'])
    const f2 = filterApprovedServiceFormsForArchive(approved, {
      dateFrom: '',
      dateTo: '',
      keyword: '散步',
    })
    expect(f2.map((r) => r.id)).toEqual(['2'])
  })
})
