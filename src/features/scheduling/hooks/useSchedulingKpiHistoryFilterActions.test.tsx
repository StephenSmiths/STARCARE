/** @vitest-environment happy-dom */
/** PDF 02【3】／PDF 03：KPI 歷史篩選套用與重設（伺服端 hydrate）。 */
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { SCHEDULING_KPI_HISTORY_LIMIT } from './schedulingKpiHistoryLimits'
import { useSchedulingKpiHistoryFilterActions } from './useSchedulingKpiHistoryFilterActions'

vi.mock('../../../services/schedulingKpiHistorySyncService', () => ({
  schedulingKpiHistorySyncService: { hydrateFromServer: vi.fn() },
}))

import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'

const row: SchedulingKpiRunRecord = {
  ranAt: '2026-01-01T00:00:00.000Z',
  kpis: { coverageRate: 50, conflictRatePer100: 0, averageAssignmentsPerResident: 1, underTargetRate: 0 },
  residentCount: 1,
  assignmentCount: 0,
  conflictCount: 0,
}

describe('useSchedulingKpiHistoryFilterActions', () => {
  const setKpiRunHistory = vi.fn()
  const setSyncError = vi.fn()

  beforeEach(() => {
    vi.mocked(schedulingKpiHistorySyncService.hydrateFromServer).mockReset()
    setKpiRunHistory.mockClear()
    setSyncError.mockClear()
  })

  it('applyHistoryFilter：帶查詢 hydrate 並寫入列表', async () => {
    vi.mocked(schedulingKpiHistorySyncService.hydrateFromServer).mockResolvedValue([row])
    const { result } = renderHook(() =>
      useSchedulingKpiHistoryFilterActions('facility-main', setKpiRunHistory, setSyncError),
    )
    await act(async () => {
      await result.current.applyHistoryFilter({
        from: '2026-01-01',
        to: '2026-01-31',
        actorId: 'a1',
      })
    })
    expect(schedulingKpiHistorySyncService.hydrateFromServer).toHaveBeenCalledWith('facility-main', {
      limit: SCHEDULING_KPI_HISTORY_LIMIT,
      from: '2026-01-01',
      to: '2026-01-31',
      actorId: 'a1',
    })
    expect(setKpiRunHistory).toHaveBeenCalledWith([row])
    expect(setSyncError).toHaveBeenCalledWith('')
    expect(result.current.isApplyingFilter).toBe(false)
  })

  it('resetHistoryFilter：空篩選並以 limit 重查', async () => {
    vi.mocked(schedulingKpiHistorySyncService.hydrateFromServer).mockResolvedValue([])
    const { result } = renderHook(() =>
      useSchedulingKpiHistoryFilterActions('facility-main', setKpiRunHistory, setSyncError),
    )
    await act(async () => {
      await result.current.resetHistoryFilter()
    })
    expect(schedulingKpiHistorySyncService.hydrateFromServer).toHaveBeenCalledWith('facility-main', {
      limit: SCHEDULING_KPI_HISTORY_LIMIT,
    })
    expect(setKpiRunHistory).toHaveBeenCalledWith([])
  })

  it('hydrate 失敗：寫入固定錯句', async () => {
    vi.mocked(schedulingKpiHistorySyncService.hydrateFromServer).mockRejectedValue(new Error('x'))
    const { result } = renderHook(() =>
      useSchedulingKpiHistoryFilterActions('facility-main', setKpiRunHistory, setSyncError),
    )
    await act(async () => {
      await result.current.applyHistoryFilter({ from: '', to: '', actorId: '' })
    })
    expect(setSyncError).toHaveBeenLastCalledWith('KPI 歷史查詢失敗，請檢查過濾條件後重試。')
    expect(result.current.isApplyingFilter).toBe(false)
  })
})
