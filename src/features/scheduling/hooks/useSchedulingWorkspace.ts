import { useAuth, useAuthActorId } from '../../auth'
import { buildSchedulingWorkspaceReturn } from '../utils/buildSchedulingWorkspaceReturn'
import { SCHEDULING_WORKSPACE_FACILITY_ID } from './schedulingWorkspaceDefaults'
import { useSchedulingBatchUndo } from './useSchedulingBatchUndo'
import { useSchedulingCsvExports } from './useSchedulingCsvExports'
import { useSchedulingDerived } from './useSchedulingDerived'
import { useSchedulingFacilityReload } from './useSchedulingFacilityReload'
import { useSchedulingKpiHistory } from './useSchedulingKpiHistory'
import { useSchedulingRunAndSave } from './useSchedulingRunAndSave'
import { useSchedulingRunPreviewState } from './useSchedulingRunPreviewState'

/** 排班頁資料載入、乾跑／儲存、KPI 歷史與 CSV（見各子 hook；此檔為組裝層）。 */
export const useSchedulingWorkspace = () => {
  const actorId = useAuthActorId()
  const { role } = useAuth()
  const facilityId = SCHEDULING_WORKSPACE_FACILITY_ID
  const {
    saveError,
    setSaveError,
    saveSuccess,
    setSaveSuccess,
    result,
    setResult,
    isRunning,
    setIsRunning,
    isSaving,
    setIsSaving,
    clearPreviewState,
  } = useSchedulingRunPreviewState()
  const {
    lastSchedulingBatchId,
    refreshLastBatchId,
    undoLastSchedulingBatch,
    isUndoingSchedulingBatch,
  } = useSchedulingBatchUndo(actorId, role)
  /** Phase 4 Day 2/3/5：最近排班 KPI 快照（最多 10 次；本機快取 + 伺服端同步） */
  const {
    kpiRunHistory,
    exportKpiTrendCsv,
    clearKpiTrendHistory,
    appendKpiRunRecord,
    setKpiRunHistory,
    syncError: kpiSyncError,
    syncNotice: kpiSyncNotice,
    hasPendingSync: hasPendingKpiSync,
    retryKpiSync,
    isRetryingSync: isRetryingKpiSync,
    historyFilter,
    applyHistoryFilter,
    resetHistoryFilter,
    isApplyingFilter: isApplyingKpiFilter,
  } = useSchedulingKpiHistory(facilityId)

  const {
    residents,
    setResidents,
    sessionCount,
    loadError,
    setLoadError,
    staffProfilesLoadDegraded,
    reloadSchedulingData,
  } = useSchedulingFacilityReload(facilityId, clearPreviewState)

  const { stats, tableRows, kpis, complianceAlerts } = useSchedulingDerived(residents, result)
  const { exportWeeklyComplianceCsv, exportComplianceAlertsCsv } = useSchedulingCsvExports(
    actorId,
    residents,
    complianceAlerts,
  )

  const { runScheduling, saveScheduleAssignments } = useSchedulingRunAndSave(
    actorId,
    facilityId,
    result,
    setResidents,
    setResult,
    setLoadError,
    setSaveSuccess,
    setSaveError,
    setIsRunning,
    setIsSaving,
    setKpiRunHistory,
    appendKpiRunRecord,
    refreshLastBatchId,
  )

  return buildSchedulingWorkspaceReturn({
    stats,
    sessionCount,
    reloadSchedulingData,
    tableRows,
    result,
    runScheduling,
    saveScheduleAssignments,
    isRunning,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    exportWeeklyComplianceCsv,
    exportComplianceAlertsCsv,
    exportKpiTrendCsv,
    clearKpiTrendHistory,
    kpiSyncError,
    kpiSyncNotice,
    hasPendingKpiSync,
    retryKpiSync,
    isRetryingKpiSync,
    historyFilter,
    applyHistoryFilter,
    resetHistoryFilter,
    isApplyingKpiFilter,
    kpis,
    kpiRunHistory,
    complianceAlerts,
    lastSchedulingBatchId,
    undoLastSchedulingBatch,
    isUndoingSchedulingBatch,
    staffProfilesLoadDegraded,
  })
}
