/** @vitest-environment happy-dom */
/** PDF 02【3】：儀表整合 **`useScheduling`** 與 **`runBlockedReason`**（五步 gate）。 */
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SchedulingWorkspaceReturn } from '../utils/buildSchedulingWorkspaceReturn'
import { useSchedulingDashboardViewModel } from './useSchedulingDashboardViewModel'

vi.mock('./useScheduling', () => ({
  useScheduling: vi.fn(),
}))

vi.mock('../../shared/hooks/useAuditTrailList', () => ({
  useAuditTrailList: vi.fn(() => []),
}))

import { useScheduling } from './useScheduling'

const workspace = (patch: Partial<SchedulingWorkspaceReturn>): SchedulingWorkspaceReturn =>
  ({
    totalResidents: 2,
    compliantCount: 0,
    pendingSlots: 0,
    sessionCount: 1,
    reloadSchedulingData: vi.fn(),
    tableRows: [],
    result: { assignments: [], conflicts: [], underTargetResidents: [], previewSessions: [] },
    runScheduling: vi.fn(),
    saveScheduleAssignments: vi.fn(),
    isRunning: false,
    isSaving: false,
    loadError: '',
    saveError: '',
    saveSuccess: false,
    exportWeeklyComplianceCsv: vi.fn(),
    exportComplianceAlertsCsv: vi.fn(),
    exportKpiTrendCsv: vi.fn(),
    clearKpiTrendHistory: vi.fn(),
    kpiSyncError: '',
    kpiSyncNotice: '',
    hasPendingKpiSync: false,
    retryKpiSync: vi.fn(),
    isRetryingKpiSync: false,
    historyFilter: { from: '', to: '', actorId: '' },
    applyHistoryFilter: vi.fn(),
    resetHistoryFilter: vi.fn(),
    isApplyingKpiFilter: false,
    kpis: { coverageRate: 0, conflictRatePer100: 0, averageAssignmentsPerResident: 0, underTargetRate: 0 },
    kpiRunHistory: [],
    complianceAlerts: [],
    lastSchedulingBatchId: null,
    undoLastSchedulingBatch: vi.fn(),
    isUndoingSchedulingBatch: false,
    staffProfilesLoadDegraded: false,
    ...patch,
  }) as SchedulingWorkspaceReturn

describe('useSchedulingDashboardViewModel', () => {
  beforeEach(() => {
    vi.mocked(useScheduling).mockReset()
  })

  it('runBlockedReason：無時段時阻擋步驟①', () => {
    vi.mocked(useScheduling).mockReturnValue(workspace({ sessionCount: 0, totalResidents: 3 }))
    const { result } = renderHook(() => useSchedulingDashboardViewModel())
    expect(result.current.runBlockedReason).toContain('步驟①')
  })

  it('runBlockedReason：未勾選週更確認時阻擋步驟②', () => {
    vi.mocked(useScheduling).mockReturnValue(workspace({ sessionCount: 2, totalResidents: 3 }))
    const { result } = renderHook(() => useSchedulingDashboardViewModel())
    expect(result.current.runBlockedReason).toContain('步驟②')
  })

  it('runBlockedReason：無院友時阻擋', () => {
    vi.mocked(useScheduling).mockReturnValue(workspace({ sessionCount: 1, totalResidents: 0 }))
    const { result } = renderHook(() => useSchedulingDashboardViewModel())
    act(() => {
      result.current.setRosterConfirmed(true)
    })
    expect(result.current.runBlockedReason).toContain('沒有在住院友')
  })

  it('條件滿足時 runBlockedReason 為 undefined', () => {
    vi.mocked(useScheduling).mockReturnValue(workspace({ sessionCount: 1, totalResidents: 2 }))
    const { result } = renderHook(() => useSchedulingDashboardViewModel())
    act(() => {
      result.current.setRosterConfirmed(true)
    })
    expect(result.current.runBlockedReason).toBeUndefined()
  })

  it('時段數歸零時以 microtask 清除週更確認勾選', async () => {
    vi.mocked(useScheduling).mockReturnValue(workspace({ sessionCount: 1, totalResidents: 1 }))
    const { result, rerender } = renderHook(() => useSchedulingDashboardViewModel())
    act(() => {
      result.current.setRosterConfirmed(true)
    })
    expect(result.current.rosterConfirmed).toBe(true)
    vi.mocked(useScheduling).mockReturnValue(workspace({ sessionCount: 0, totalResidents: 1 }))
    rerender()
    await waitFor(() => {
      expect(result.current.rosterConfirmed).toBe(false)
    })
  })
})
