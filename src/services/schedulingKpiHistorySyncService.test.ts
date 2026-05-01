import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingKpiRunRecord } from './schedulingKpiService'
import { SchedulingKpiHistorySyncService } from './schedulingKpiHistorySyncService'
import type { SchedulingKpiHistoryRepository } from '../repositories/schedulingKpiHistoryRepository'

const { loadKpiRunHistoryMock, saveKpiRunHistoryMock, clearKpiRunHistoryMock } = vi.hoisted(() => ({
  loadKpiRunHistoryMock: vi.fn(() => []),
  saveKpiRunHistoryMock: vi.fn(),
  clearKpiRunHistoryMock: vi.fn(),
}))

vi.mock('./schedulingKpiHistoryStorage', () => ({
  loadKpiRunHistory: loadKpiRunHistoryMock,
  saveKpiRunHistory: saveKpiRunHistoryMock,
  clearKpiRunHistory: clearKpiRunHistoryMock,
}))

const record: SchedulingKpiRunRecord = {
  ranAt: '2026-05-01T10:00:00.000Z',
  kpis: {
    coverageRate: 90,
    conflictRatePer100: 1,
    averageAssignmentsPerResident: 1.3,
    underTargetRate: 10,
  },
  residentCount: 20,
  assignmentCount: 26,
  conflictCount: 1,
}

describe('SchedulingKpiHistorySyncService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hydrateFromServer persists returned rows to local cache', async () => {
    const repository: SchedulingKpiHistoryRepository = {
      listHistory: vi.fn(async () => [record]),
      appendRecord: vi.fn(async () => {}),
      clearHistory: vi.fn(async () => {}),
    }
    const service = new SchedulingKpiHistorySyncService(repository)
    const rows = await service.hydrateFromServer('facility-main')
    expect(rows).toEqual([record])
    expect(repository.listHistory).toHaveBeenCalledWith('facility-main', { limit: 10 })
    expect(saveKpiRunHistoryMock).toHaveBeenCalledWith('facility-main', [record])
  })

  it('clearHistory clears server then local cache', async () => {
    const repository: SchedulingKpiHistoryRepository = {
      listHistory: vi.fn(async () => []),
      appendRecord: vi.fn(async () => {}),
      clearHistory: vi.fn(async () => {}),
    }
    const service = new SchedulingKpiHistorySyncService(repository)
    await service.clearHistory('facility-main')
    expect(repository.clearHistory).toHaveBeenCalledWith('facility-main')
    expect(clearKpiRunHistoryMock).toHaveBeenCalledWith('facility-main')
  })
})
