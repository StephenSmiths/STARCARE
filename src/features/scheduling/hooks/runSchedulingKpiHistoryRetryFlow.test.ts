import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { EMPTY_SCHEDULING_KPI_HISTORY_FILTER } from './schedulingKpiHistoryFilter'
import { SCHEDULING_KPI_HISTORY_LIMIT } from './schedulingKpiHistoryLimits'

const recordAt = (ranAt: string): SchedulingKpiRunRecord => ({
  ranAt,
  kpis: {
    coverageRate: 0,
    conflictRatePer100: 0,
    averageAssignmentsPerResident: 0,
    underTargetRate: 0,
  },
  residentCount: 0,
  assignmentCount: 0,
  conflictCount: 0,
  actorId: 'a1',
})

const mocks = vi.hoisted(() => ({
  clearHistory: vi.fn(),
  appendRecord: vi.fn(),
  hydrateFromServer: vi.fn(),
}))

vi.mock('../../../services/schedulingKpiHistorySyncService', () => ({
  schedulingKpiHistorySyncService: {
    clearHistory: mocks.clearHistory,
    appendRecord: mocks.appendRecord,
    hydrateFromServer: mocks.hydrateFromServer,
  },
}))

import { runSchedulingKpiHistoryRetryFlow } from './runSchedulingKpiHistoryRetryFlow'

describe('runSchedulingKpiHistoryRetryFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.clearHistory.mockResolvedValue(undefined)
    mocks.appendRecord.mockResolvedValue(undefined)
    mocks.hydrateFromServer.mockResolvedValue([recordAt('2026-05-04T12:00:00.000Z')])
  })

  it('pendingClear 為 false 且佇列空：僅 hydrate，不清除、不上傳', async () => {
    const rows = await runSchedulingKpiHistoryRetryFlow(
      'fac-1',
      false,
      [],
      EMPTY_SCHEDULING_KPI_HISTORY_FILTER,
    )
    expect(mocks.clearHistory).not.toHaveBeenCalled()
    expect(mocks.appendRecord).not.toHaveBeenCalled()
    expect(mocks.hydrateFromServer).toHaveBeenCalledTimes(1)
    expect(mocks.hydrateFromServer).toHaveBeenCalledWith(
      'fac-1',
      expect.objectContaining({ limit: SCHEDULING_KPI_HISTORY_LIMIT }),
    )
    expect(rows).toHaveLength(1)
  })

  it('pendingClear 為 true：先 clear 再 hydrate', async () => {
    await runSchedulingKpiHistoryRetryFlow('fac-1', true, [], EMPTY_SCHEDULING_KPI_HISTORY_FILTER)
    expect(mocks.clearHistory).toHaveBeenCalledWith('fac-1')
    expect(mocks.clearHistory.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.hydrateFromServer.mock.invocationCallOrder[0] ?? 999,
    )
  })

  it('待上傳佇列：由舊到新 append（reverse 後逐一上傳）', async () => {
    const newer = recordAt('2026-05-04T02:00:00.000Z')
    const older = recordAt('2026-05-04T01:00:00.000Z')
    await runSchedulingKpiHistoryRetryFlow(
      'fac-1',
      false,
      [newer, older],
      EMPTY_SCHEDULING_KPI_HISTORY_FILTER,
    )
    expect(mocks.appendRecord).toHaveBeenCalledTimes(2)
    expect(mocks.appendRecord.mock.calls[0]).toEqual(['fac-1', older])
    expect(mocks.appendRecord.mock.calls[1]).toEqual(['fac-1', newer])
    expect(mocks.appendRecord.mock.invocationCallOrder[1]).toBeLessThan(
      mocks.hydrateFromServer.mock.invocationCallOrder[0] ?? 999,
    )
  })

  it('pendingClear 與待上傳併存：先 clear、再由舊到新 append、最後 hydrate', async () => {
    const newer = recordAt('2026-05-04T02:00:00.000Z')
    const older = recordAt('2026-05-04T01:00:00.000Z')
    await runSchedulingKpiHistoryRetryFlow('fac-1', true, [newer, older], EMPTY_SCHEDULING_KPI_HISTORY_FILTER)
    expect(mocks.clearHistory).toHaveBeenCalledTimes(1)
    expect(mocks.clearHistory.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.appendRecord.mock.invocationCallOrder[0] ?? 999,
    )
    expect(mocks.appendRecord).toHaveBeenCalledTimes(2)
    expect(mocks.appendRecord.mock.calls[0]).toEqual(['fac-1', older])
    expect(mocks.appendRecord.mock.calls[1]).toEqual(['fac-1', newer])
    expect(mocks.appendRecord.mock.invocationCallOrder[1]).toBeLessThan(
      mocks.hydrateFromServer.mock.invocationCallOrder[0] ?? 999,
    )
  })
})
