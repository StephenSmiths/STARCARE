/** @vitest-environment happy-dom */
/** PDF 02【3】：KPI 歷史 hook 組裝（子 hook／本機 load 隔離 mock）。 */
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { useSchedulingKpiHistory } from './useSchedulingKpiHistory'

vi.mock('../../../services/schedulingKpiHistorySyncService', () => ({
  schedulingKpiHistorySyncService: {
    loadLocal: vi.fn(),
  },
}))

vi.mock('./useSchedulingKpiHistoryFilterActions', () => ({
  useSchedulingKpiHistoryFilterActions: vi.fn(() => ({
    historyFilter: { from: '', to: '', actorId: '' },
    applyHistoryFilter: vi.fn(),
    resetHistoryFilter: vi.fn(),
    isApplyingFilter: false,
  })),
}))

vi.mock('./useSchedulingKpiHistoryMutations', () => ({
  useSchedulingKpiHistoryMutations: vi.fn(() => ({
    appendKpiRunRecord: vi.fn(),
    exportKpiTrendCsv: vi.fn(),
    clearKpiTrendHistory: vi.fn(),
    retryKpiSync: vi.fn(),
    isRetryingSync: false,
    hasPendingSync: false,
  })),
}))

vi.mock('./useSchedulingKpiHistoryEffects', () => ({
  usePersistSchedulingKpiRunHistory: vi.fn(),
  useAutoClearKpiSyncNotice: vi.fn(),
  useSchedulingKpiHistoryMountHydrate: vi.fn(),
}))

import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import { useSchedulingKpiHistoryFilterActions } from './useSchedulingKpiHistoryFilterActions'
import { useSchedulingKpiHistoryMutations } from './useSchedulingKpiHistoryMutations'

const sampleRow: SchedulingKpiRunRecord = {
  ranAt: '2026-05-09T12:00:00.000Z',
  kpis: { coverageRate: 10, conflictRatePer100: 0, averageAssignmentsPerResident: 0.5, underTargetRate: 5 },
  residentCount: 2,
  assignmentCount: 1,
  conflictCount: 0,
}

describe('useSchedulingKpiHistory', () => {
  it('以 loadLocal 初始化並註冊子 hook', () => {
    vi.mocked(schedulingKpiHistorySyncService.loadLocal).mockReturnValue([sampleRow])
    const { result } = renderHook(() => useSchedulingKpiHistory('facility-kpi'))
    expect(schedulingKpiHistorySyncService.loadLocal).toHaveBeenCalledWith('facility-kpi')
    expect(result.current.kpiRunHistory).toEqual([sampleRow])
    expect(useSchedulingKpiHistoryFilterActions).toHaveBeenCalledWith(
      'facility-kpi',
      expect.any(Function),
      expect.any(Function),
    )
    expect(useSchedulingKpiHistoryMutations).toHaveBeenCalledWith(
      expect.objectContaining({
        facilityId: 'facility-kpi',
        kpiRunHistory: [sampleRow],
        historyFilter: { from: '', to: '', actorId: '' },
      }),
    )
    expect(result.current.syncError).toBe('')
    expect(result.current.syncNotice).toBe('')
  })
})
