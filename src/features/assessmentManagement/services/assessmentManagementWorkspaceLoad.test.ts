import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Resident } from '../../residents/types/resident'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'

const residentFixture = (): Resident => ({
  id: 'r1',
  name: '甲',
  bedNumber: '101',
  area: 'A',
  gender: 'Male',
  age: 80,
  admissionDate: '2025-01-01',
  assessmentNextDueDate: null,
  fundingType: 'GradeA_Subsidized',
  serviceType: 'Both',
  dementiaLevel: 'Moderate',
  isSpecialCareCase: false,
  healthCondition: '',
  medicationRecord: '',
  isDeleted: false,
})

const completionFixture = (over: Partial<AssessmentCompletionRecord>): AssessmentCompletionRecord => ({
  id: over.id ?? 'c1',
  residentId: over.residentId ?? 'r1',
  residentName: over.residentName ?? '甲',
  cycleAnchorDate: over.cycleAnchorDate ?? '2026-01-01',
  discipline: over.discipline ?? 'PT',
  versionLabel: over.versionLabel ?? 'v1',
  recordedByActorId: over.recordedByActorId ?? 'a1',
  completedAt: over.completedAt ?? '2026-01-02T00:00:00.000Z',
})

const mocks = vi.hoisted(() => ({
  listActiveResidents: vi.fn(),
  loadAssessmentCompletions: vi.fn(),
  listActiveRemote: vi.fn(),
  mergeRemotePrimary: vi.fn(),
  buildAssessmentDueSoonTasks: vi.fn(),
}))

vi.mock('../../residents/services/residentService', () => ({
  residentService: { listActiveResidents: mocks.listActiveResidents },
}))

vi.mock('../../../services/assessmentCompletionStorage', () => ({
  loadAssessmentCompletions: mocks.loadAssessmentCompletions,
}))

vi.mock('../../../repositories/assessmentCompletionRecordRepository', () => ({
  assessmentCompletionRecordRepository: { listActive: mocks.listActiveRemote },
}))

vi.mock('./mergeAssessmentCompletionRecords', () => ({
  mergeAssessmentCompletionRecordsRemotePrimary: mocks.mergeRemotePrimary,
}))

vi.mock('./assessmentManagementDomainService', () => ({
  buildAssessmentDueSoonTasks: mocks.buildAssessmentDueSoonTasks,
}))

import { loadAssessmentManagementWorkspaceBundle } from './assessmentManagementWorkspaceLoad'

describe('loadAssessmentManagementWorkspaceBundle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.listActiveResidents.mockResolvedValue([residentFixture()])
    mocks.loadAssessmentCompletions.mockReturnValue([completionFixture({ id: 'local' })])
    mocks.listActiveRemote.mockResolvedValue([completionFixture({ id: 'remote' })])
    mocks.buildAssessmentDueSoonTasks.mockResolvedValue([])
  })

  it('成功：合併遠端與本機完成紀錄並載入待辦', async () => {
    mocks.mergeRemotePrimary.mockReturnValue([completionFixture({ id: 'merged' })])
    const out = await loadAssessmentManagementWorkspaceBundle()
    expect(out.ok).toBe(true)
    if (!out.ok) return
    expect(out.data.residents).toHaveLength(1)
    expect(out.data.completions).toEqual([completionFixture({ id: 'merged' })])
    expect(out.data.dueSoonTasks).toEqual([])
    expect(mocks.mergeRemotePrimary).toHaveBeenCalledWith(
      [completionFixture({ id: 'remote' })],
      [completionFixture({ id: 'local' })],
    )
    expect(mocks.buildAssessmentDueSoonTasks).toHaveBeenCalled()
  })

  it('遠端失敗時退回本機完成紀錄且不呼叫 merge', async () => {
    mocks.listActiveRemote.mockRejectedValue(new Error('offline'))
    const out = await loadAssessmentManagementWorkspaceBundle()
    expect(out.ok).toBe(true)
    if (!out.ok) return
    expect(out.data.completions).toEqual([completionFixture({ id: 'local' })])
    expect(mocks.mergeRemotePrimary).not.toHaveBeenCalled()
  })

  it('院友列表載入失敗：回傳 ok false', async () => {
    mocks.listActiveResidents.mockRejectedValue(new Error('boom'))
    const out = await loadAssessmentManagementWorkspaceBundle()
    expect(out).toEqual({ ok: false })
  })

  it('待辦載入失敗：回傳 ok false', async () => {
    mocks.buildAssessmentDueSoonTasks.mockRejectedValue(new Error('due soon'))
    const out = await loadAssessmentManagementWorkspaceBundle()
    expect(out).toEqual({ ok: false })
  })
})
