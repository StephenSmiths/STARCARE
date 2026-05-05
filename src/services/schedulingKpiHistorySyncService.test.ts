import { beforeEach, describe, expect, it, vi } from 'vitest'
import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
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
    const rows = await service.hydrateFromServer(STARCARE_DEFAULT_FACILITY_ID)
    expect(rows).toEqual([record])
    expect(repository.listHistory).toHaveBeenCalledWith(STARCARE_DEFAULT_FACILITY_ID, { limit: 10 })
    expect(saveKpiRunHistoryMock).toHaveBeenCalledWith(STARCARE_DEFAULT_FACILITY_ID, [record])
  })

  it('clearHistory clears server then local cache', async () => {
    const repository: SchedulingKpiHistoryRepository = {
      listHistory: vi.fn(async () => []),
      appendRecord: vi.fn(async () => {}),
      clearHistory: vi.fn(async () => {}),
    }
    const service = new SchedulingKpiHistorySyncService(repository)
    await service.clearHistory(STARCARE_DEFAULT_FACILITY_ID)
    expect(repository.clearHistory).toHaveBeenCalledWith(STARCARE_DEFAULT_FACILITY_ID)
    expect(clearKpiRunHistoryMock).toHaveBeenCalledWith(STARCARE_DEFAULT_FACILITY_ID)
  })
})
