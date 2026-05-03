import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ServiceFormRecord } from '../features/serviceForms/types/serviceForm'
import { createServiceFormRepository } from './serviceFormRepository'
import { loadServiceForms, saveServiceForms } from '../services/serviceFormStorage'
import { loadApprovedServiceFormsDbPrimary, mergeServiceFormSnapshotsById } from './serviceFormSyncService'

vi.mock('./serviceFormRepository', () => ({
  createServiceFormRepository: vi.fn(),
}))

vi.mock('../services/serviceFormStorage', () => ({
  loadServiceForms: vi.fn(() => []),
  saveServiceForms: vi.fn(),
}))

const row = (id: string, status: ServiceFormRecord['status'], updatedAt: string): ServiceFormRecord =>
  ({
    id,
    sessionId: 's',
    sessionDate: '2026-05-01',
    staffProfileId: 'sp',
    residentId: 'r',
    residentName: 'A',
    narrative: '',
    status,
    ownerActorId: 'o',
    createdAt: updatedAt,
    updatedAt,
    submittedAt: null,
    reviewedAt: null,
    reviewerActorId: null,
    reviewNote: null,
  }) as ServiceFormRecord

describe('loadApprovedServiceFormsDbPrimary', () => {
  beforeEach(() => {
    vi.mocked(loadServiceForms).mockReturnValue([])
    vi.clearAllMocks()
  })

  it('遠端成功時回傳僅遠端核准列並 save merge', async () => {
    const approved = row('a', 'APPROVED', '2026-05-02T10:00:00.000Z')
    vi.mocked(createServiceFormRepository).mockReturnValue({
      listForms: vi.fn().mockResolvedValue([approved]),
      upsertForm: vi.fn(),
      softDeleteForm: vi.fn(),
    } as ReturnType<typeof createServiceFormRepository>)
    const out = await loadApprovedServiceFormsDbPrimary('facility-main')
    expect(out).toEqual([approved])
    expect(saveServiceForms).toHaveBeenCalled()
  })

  it('遠端失敗時回傳 null', async () => {
    vi.mocked(createServiceFormRepository).mockReturnValue({
      listForms: vi.fn().mockResolvedValue(null),
      upsertForm: vi.fn(),
      softDeleteForm: vi.fn(),
    } as ReturnType<typeof createServiceFormRepository>)
    const out = await loadApprovedServiceFormsDbPrimary('facility-main')
    expect(out).toBeNull()
    expect(saveServiceForms).not.toHaveBeenCalled()
  })
})

describe('mergeServiceFormSnapshotsById', () => {
  it('遠端列覆蓋同 id；其餘本機 id 保留', () => {
    const local = [row('a', 'DRAFT', '2026-05-01T08:00:00.000Z'), row('b', 'SUBMITTED', '2026-05-01T09:00:00.000Z')]
    const remote = [row('b', 'APPROVED', '2026-05-02T10:00:00.000Z')]
    const out = mergeServiceFormSnapshotsById(local, remote)
    expect(out.find((f) => f.id === 'a')?.status).toBe('DRAFT')
    expect(out.find((f) => f.id === 'b')?.status).toBe('APPROVED')
  })
})
