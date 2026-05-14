/** @vitest-environment happy-dom */
/** PDF 02【3】：排班工作區 hook 組裝層（子 hook 窄 mock 煙霧）。 */
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { SchedulingViewModel } from '../types/schedule'
import { SCHEDULING_WORKSPACE_FACILITY_ID } from './schedulingWorkspaceDefaults'

const { emptyResult, previewSlice, batchUndoSlice, kpiSlice, facilitySlice, derivedSlice, csvSlice, runSaveSlice } =
  vi.hoisted(() => {
    const emptyResult: SchedulingViewModel = {
      assignments: [],
      conflicts: [],
      underTargetResidents: [],
    }
    return {
      emptyResult,
      previewSlice: {
        saveError: '',
        setSaveError: vi.fn(),
        saveSuccess: false,
        setSaveSuccess: vi.fn(),
        result: emptyResult,
        setResult: vi.fn(),
        isRunning: false,
        setIsRunning: vi.fn(),
        isSaving: false,
        setIsSaving: vi.fn(),
        clearPreviewState: vi.fn(),
      },
      batchUndoSlice: {
        lastSchedulingBatchId: null as string | null,
        refreshLastBatchId: vi.fn(),
        undoLastSchedulingBatch: vi.fn(),
        isUndoingSchedulingBatch: false,
      },
      kpiSlice: {
        kpiRunHistory: [] as const,
        exportKpiTrendCsv: vi.fn(),
        clearKpiTrendHistory: vi.fn(),
        appendKpiRunRecord: vi.fn(),
        setKpiRunHistory: vi.fn(),
        syncError: '',
        syncNotice: '',
        hasPendingSync: false,
        retryKpiSync: vi.fn(),
        isRetryingSync: false,
        historyFilter: { from: '', to: '', actorId: '' },
        applyHistoryFilter: vi.fn(),
        resetHistoryFilter: vi.fn(),
        isApplyingFilter: false,
      },
      facilitySlice: {
        residents: [] as const,
        setResidents: vi.fn(),
        sessionCount: 7,
        loadError: '',
        setLoadError: vi.fn(),
        staffProfilesLoadDegraded: false,
        reloadSchedulingData: vi.fn(),
      },
      derivedSlice: {
        stats: { totalResidents: 0, compliantCount: 0, pendingSlots: 0 },
        tableRows: [] as const,
        kpis: {
          coverageRate: 0,
          conflictRatePer100: 0,
          averageAssignmentsPerResident: 0,
          underTargetRate: 0,
        },
        complianceAlerts: [] as const,
      },
      csvSlice: {
        exportWeeklyComplianceCsv: vi.fn(),
        exportComplianceAlertsCsv: vi.fn(),
      },
      runSaveSlice: {
        runScheduling: vi.fn(),
        saveScheduleAssignments: vi.fn(),
      },
    }
  })

vi.mock('../../auth', () => ({
  useAuthActorId: vi.fn(() => 'actor-ws'),
  useAuth: vi.fn(() => ({ role: 'Admin' })),
}))

vi.mock('./useSchedulingRunPreviewState', () => ({
  useSchedulingRunPreviewState: vi.fn(() => previewSlice),
}))

vi.mock('./useSchedulingBatchUndo', () => ({
  useSchedulingBatchUndo: vi.fn(() => batchUndoSlice),
}))

vi.mock('./useSchedulingKpiHistory', () => ({
  useSchedulingKpiHistory: vi.fn(() => kpiSlice),
}))

vi.mock('./useSchedulingFacilityReload', () => ({
  useSchedulingFacilityReload: vi.fn(() => facilitySlice),
}))

vi.mock('./useSchedulingDerived', () => ({
  useSchedulingDerived: vi.fn(() => derivedSlice),
}))

vi.mock('./useSchedulingCsvExports', () => ({
  useSchedulingCsvExports: vi.fn(() => csvSlice),
}))

vi.mock('./useSchedulingRunAndSave', () => ({
  useSchedulingRunAndSave: vi.fn(() => runSaveSlice),
}))

import { useAuth, useAuthActorId } from '../../auth'
import { useSchedulingBatchUndo } from './useSchedulingBatchUndo'
import { useSchedulingCsvExports } from './useSchedulingCsvExports'
import { useSchedulingDerived } from './useSchedulingDerived'
import { useSchedulingFacilityReload } from './useSchedulingFacilityReload'
import { useSchedulingKpiHistory } from './useSchedulingKpiHistory'
import { useSchedulingRunAndSave } from './useSchedulingRunAndSave'
import { useSchedulingRunPreviewState } from './useSchedulingRunPreviewState'
import { useSchedulingWorkspace } from './useSchedulingWorkspace'

describe('useSchedulingWorkspace', () => {
  it('以預設院舍組裝子 hook 並回傳 buildSchedulingWorkspaceReturn 形狀', () => {
    const { result } = renderHook(() => useSchedulingWorkspace())

    expect(useAuthActorId).toHaveBeenCalled()
    expect(useAuth).toHaveBeenCalled()
    expect(useSchedulingBatchUndo).toHaveBeenCalledWith('actor-ws', 'Admin')
    expect(useSchedulingKpiHistory).toHaveBeenCalledWith(SCHEDULING_WORKSPACE_FACILITY_ID)
    expect(useSchedulingFacilityReload).toHaveBeenCalledWith(
      SCHEDULING_WORKSPACE_FACILITY_ID,
      previewSlice.clearPreviewState,
    )
    expect(useSchedulingDerived).toHaveBeenCalledWith(facilitySlice.residents, previewSlice.result)
    expect(useSchedulingCsvExports).toHaveBeenCalledWith(
      'actor-ws',
      facilitySlice.residents,
      derivedSlice.complianceAlerts,
    )
    expect(useSchedulingRunAndSave).toHaveBeenCalledWith(
      'actor-ws',
      SCHEDULING_WORKSPACE_FACILITY_ID,
      previewSlice.result,
      facilitySlice.setResidents,
      previewSlice.setResult,
      facilitySlice.setLoadError,
      previewSlice.setSaveSuccess,
      previewSlice.setSaveError,
      previewSlice.setIsRunning,
      previewSlice.setIsSaving,
      kpiSlice.setKpiRunHistory,
      kpiSlice.appendKpiRunRecord,
      batchUndoSlice.refreshLastBatchId,
    )

    expect(result.current.sessionCount).toBe(7)
    expect(result.current.canSave).toBe(false)
    expect(result.current.kpiRunHistory).toEqual([])
    expect(result.current.runScheduling).toBe(runSaveSlice.runScheduling)
  })
})
