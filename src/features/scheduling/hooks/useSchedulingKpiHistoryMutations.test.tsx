/** @vitest-environment happy-dom */
/** PDF 02【3】：KPI 歷史變更（追加、匯出、清除、重試同步）。 */
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { useSchedulingKpiHistoryMutations } from './useSchedulingKpiHistoryMutations'

vi.mock('../../../services/schedulingKpiHistorySyncService', () => ({
  schedulingKpiHistorySyncService: {
    appendRecord: vi.fn(),
    clearHistory: vi.fn(),
  },
}))

vi.mock('../../../services/schedulingKpiTrendCsvService', () => ({
  downloadSchedulingKpiTrendCsv: vi.fn(),
}))

vi.mock('./runSchedulingKpiHistoryRetryFlow', () => ({
  runSchedulingKpiHistoryRetryFlow: vi.fn(),
}))

import { schedulingKpiHistorySyncService } from '../../../services/schedulingKpiHistorySyncService'
import { downloadSchedulingKpiTrendCsv } from '../../../services/schedulingKpiTrendCsvService'
import { runSchedulingKpiHistoryRetryFlow } from './runSchedulingKpiHistoryRetryFlow'

const record: SchedulingKpiRunRecord = {
  ranAt: '2026-05-09T01:00:00.000Z',
  kpis: { coverageRate: 50, conflictRatePer100: 0, averageAssignmentsPerResident: 1, underTargetRate: 0 },
  residentCount: 1,
  assignmentCount: 1,
  conflictCount: 0,
}

const emptyFilter = { from: '', to: '', actorId: '' }

function useMutationHarness() {
  const [kpiRunHistory, setKpiRunHistory] = useState<SchedulingKpiRunRecord[]>([])
  const [syncError, setSyncError] = useState('')
  const [syncNotice, setSyncNotice] = useState('')
  const m = useSchedulingKpiHistoryMutations({
    facilityId: 'fac-m',
    kpiRunHistory,
    setKpiRunHistory,
    historyFilter: emptyFilter,
    setSyncError,
    setSyncNotice,
  })
  return { kpiRunHistory, syncError, syncNotice, ...m }
}

describe('useSchedulingKpiHistoryMutations', () => {
  beforeEach(() => {
    vi.mocked(schedulingKpiHistorySyncService.appendRecord).mockReset()
    vi.mocked(schedulingKpiHistorySyncService.clearHistory).mockReset()
    vi.mocked(downloadSchedulingKpiTrendCsv).mockReset()
    vi.mocked(runSchedulingKpiHistoryRetryFlow).mockReset()
    vi.mocked(schedulingKpiHistorySyncService.appendRecord).mockResolvedValue(undefined)
    vi.mocked(schedulingKpiHistorySyncService.clearHistory).mockResolvedValue(undefined)
  })

  it('appendKpiRunRecord：前置列並於 append 成功時清錯誤', async () => {
    vi.mocked(schedulingKpiHistorySyncService.appendRecord).mockResolvedValue(undefined)
    const { result } = renderHook(() => useMutationHarness())
    await act(async () => {
      result.current.appendKpiRunRecord(record)
    })
    expect(result.current.kpiRunHistory).toEqual([record])
    expect(schedulingKpiHistorySyncService.appendRecord).toHaveBeenCalledWith('fac-m', record)
    await waitFor(() => {
      expect(result.current.syncError).toBe('')
    })
  })

  it('appendRecord 失敗：寫入重試提示', async () => {
    vi.mocked(schedulingKpiHistorySyncService.appendRecord).mockRejectedValue(new Error('x'))
    const { result } = renderHook(() => useMutationHarness())
    await act(async () => {
      result.current.appendKpiRunRecord(record)
    })
    await waitFor(() => {
      expect(result.current.syncError).toContain('重試同步')
    })
    expect(result.current.hasPendingSync).toBe(true)
  })

  it('exportKpiTrendCsv：帶 facility 與目前列', () => {
    function useExportHarness() {
      const [kpiRunHistory, setKpiRunHistory] = useState<SchedulingKpiRunRecord[]>([record])
      const [, setSyncError] = useState('')
      const [, setSyncNotice] = useState('')
      const m = useSchedulingKpiHistoryMutations({
        facilityId: 'fac-m',
        kpiRunHistory,
        setKpiRunHistory,
        historyFilter: emptyFilter,
        setSyncError,
        setSyncNotice,
      })
      return m
    }
    const { result } = renderHook(() => useExportHarness())
    act(() => {
      result.current.exportKpiTrendCsv()
    })
    expect(downloadSchedulingKpiTrendCsv).toHaveBeenCalledWith('fac-m', [record])
  })

  it('clearHistory 失敗：標 pending 並寫錯', async () => {
    vi.mocked(schedulingKpiHistorySyncService.clearHistory).mockRejectedValue(new Error('x'))
    const { result } = renderHook(() => useMutationHarness())
    await act(async () => {
      result.current.clearKpiTrendHistory()
    })
    expect(result.current.kpiRunHistory).toEqual([])
    await waitFor(() => {
      expect(result.current.syncError).toContain('清除同步失敗')
    })
    expect(result.current.hasPendingSync).toBe(true)
  })

  it('retryKpiSync：合併重試 flow 結果並顯示成功提示', async () => {
    vi.mocked(runSchedulingKpiHistoryRetryFlow).mockResolvedValue([record])
    const { result } = renderHook(() => useMutationHarness())
    await act(async () => {
      await result.current.retryKpiSync()
    })
    expect(runSchedulingKpiHistoryRetryFlow).toHaveBeenCalled()
    expect(result.current.kpiRunHistory).toEqual([record])
    expect(result.current.syncNotice).toContain('已成功同步')
    expect(result.current.isRetryingSync).toBe(false)
  })
})
