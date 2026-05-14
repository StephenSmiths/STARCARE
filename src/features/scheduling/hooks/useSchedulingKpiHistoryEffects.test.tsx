/** @vitest-environment happy-dom */
/** PDF 02【3】：KPI 歷史副作用（本機持久化、提示清除、掛載 hydrate）。 */
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import {
  useAutoClearKpiSyncNotice,
  usePersistSchedulingKpiRunHistory,
  useSchedulingKpiHistoryMountHydrate,
} from './useSchedulingKpiHistoryEffects'

vi.mock('../../../services/schedulingKpiHistoryStorage', () => ({
  saveKpiRunHistory: vi.fn(),
}))

vi.mock('../../../services/schedulingKpiHistorySyncService', () => ({
  schedulingKpiHistorySyncService: {
    hydrateFromServer: vi.fn(),
  },
}))

import { saveKpiRunHistory } from '../../../services/schedulingKpiHistoryStorage'
import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'

const row: SchedulingKpiRunRecord = {
  ranAt: '2026-05-09T00:00:00.000Z',
  kpis: { coverageRate: 0, conflictRatePer100: 0, averageAssignmentsPerResident: 0, underTargetRate: 0 },
  residentCount: 0,
  assignmentCount: 0,
  conflictCount: 0,
}

describe('usePersistSchedulingKpiRunHistory', () => {
  beforeEach(() => {
    vi.mocked(saveKpiRunHistory).mockClear()
  })

  it('kpiRunHistory 變更時寫入本機 storage', () => {
    const { rerender } = renderHook(
      ({ rows }: { rows: SchedulingKpiRunRecord[] }) => {
        usePersistSchedulingKpiRunHistory('fac-persist', rows)
        return null
      },
      { initialProps: { rows: [] as SchedulingKpiRunRecord[] } },
    )
    expect(saveKpiRunHistory).toHaveBeenLastCalledWith('fac-persist', [])
    rerender({ rows: [row] })
    expect(saveKpiRunHistory).toHaveBeenLastCalledWith('fac-persist', [row])
  })
})

describe('useAutoClearKpiSyncNotice', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('有提示字串時約 4 秒後清除', () => {
    const { result } = renderHook(() => {
      const [syncNotice, setSyncNotice] = useState('KPI 歷史已成功同步到伺服器。')
      useAutoClearKpiSyncNotice(syncNotice, setSyncNotice)
      return { syncNotice, setSyncNotice }
    })
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(result.current.syncNotice).toBe('')
  })
})

describe('useSchedulingKpiHistoryMountHydrate', () => {
  beforeEach(() => {
    vi.mocked(schedulingKpiHistorySyncService.hydrateFromServer).mockReset()
  })

  it('掛載成功 hydrate 後寫入列並清錯誤', async () => {
    vi.mocked(schedulingKpiHistorySyncService.hydrateFromServer).mockResolvedValue([row])
    const setKpiRunHistory = vi.fn()
    const setSyncError = vi.fn()
    const setSyncNotice = vi.fn()
    renderHook(() => useSchedulingKpiHistoryMountHydrate('fac-h', setKpiRunHistory, setSyncError, setSyncNotice))
    await waitFor(() => {
      expect(setKpiRunHistory).toHaveBeenCalledWith([row])
    })
    expect(setSyncError).toHaveBeenCalledWith('')
    expect(setSyncNotice).toHaveBeenCalledWith('')
  })

  it('hydrate 失敗時寫入固定錯句', async () => {
    vi.mocked(schedulingKpiHistorySyncService.hydrateFromServer).mockRejectedValue(new Error('net'))
    const setKpiRunHistory = vi.fn()
    const setSyncError = vi.fn()
    const setSyncNotice = vi.fn()
    renderHook(() => useSchedulingKpiHistoryMountHydrate('fac-h', setKpiRunHistory, setSyncError, setSyncNotice))
    await waitFor(() => {
      expect(setSyncError).toHaveBeenCalledWith('KPI 歷史同步失敗，目前顯示本機快取。')
    })
  })
})
