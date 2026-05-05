import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'
import type { SchedulingKpiRunRecord, SchedulingKpiSnapshot } from '../../../services/schedulingKpiService'
import type { SchedulingKpiHistoryFilter } from '../types/schedulingKpiHistoryFilter'
import type { ResidentTableRow } from '../types/residentTableRow'
import type { SchedulingViewModel } from '../types/schedule'

/** 院友人數統計（來自 `useSchedulingDerived.stats`）。 */
export type SchedulingWorkspaceStatsSlice = {
  totalResidents: number
  compliantCount: number
  pendingSlots: number
}

/** 將排班子 hook 輸出組成儀表板／頁面單一回傳（純組字，無 React）。 */
export type BuildSchedulingWorkspaceReturnInput = {
  stats: SchedulingWorkspaceStatsSlice
  sessionCount: number
  reloadSchedulingData: (options?: { clearPreview?: boolean }) => Promise<void>
  tableRows: ResidentTableRow[]
  result: SchedulingViewModel
  runScheduling: () => Promise<void>
  saveScheduleAssignments: () => Promise<void>
  isRunning: boolean
  isSaving: boolean
  loadError: string
  saveError: string
  saveSuccess: boolean
  exportWeeklyComplianceCsv: () => void
  exportComplianceAlertsCsv: () => void
  exportKpiTrendCsv: () => void
  clearKpiTrendHistory: () => void
  kpiSyncError: string
  kpiSyncNotice: string
  hasPendingKpiSync: boolean
  retryKpiSync: () => Promise<void>
  isRetryingKpiSync: boolean
  historyFilter: SchedulingKpiHistoryFilter
  applyHistoryFilter: (nextFilter: SchedulingKpiHistoryFilter) => Promise<void>
  resetHistoryFilter: () => Promise<void>
  isApplyingKpiFilter: boolean
  kpis: SchedulingKpiSnapshot
  kpiRunHistory: SchedulingKpiRunRecord[]
  complianceAlerts: SchedulingComplianceAlert[]
  lastSchedulingBatchId: string | null
  undoLastSchedulingBatch: () => Promise<void>
  isUndoingSchedulingBatch: boolean
  staffProfilesLoadDegraded: boolean
}

/** PDF 02【3】：`canSave` 與試算結果同源（有指派且無衝突）。 */
export const buildSchedulingWorkspaceReturn = (input: BuildSchedulingWorkspaceReturnInput) => {
  const { stats, result } = input
  return {
    ...stats,
    sessionCount: input.sessionCount,
    reloadSchedulingData: input.reloadSchedulingData,
    tableRows: input.tableRows,
    assignments: result.assignments,
    conflicts: result.conflicts,
    underTargetResidents: result.underTargetResidents,
    runScheduling: input.runScheduling,
    saveScheduleAssignments: input.saveScheduleAssignments,
    isRunning: input.isRunning,
    isSaving: input.isSaving,
    loadError: input.loadError,
    saveError: input.saveError,
    saveSuccess: input.saveSuccess,
    canSave: result.assignments.length > 0 && result.conflicts.length === 0,
    exportWeeklyComplianceCsv: input.exportWeeklyComplianceCsv,
    exportComplianceAlertsCsv: input.exportComplianceAlertsCsv,
    exportKpiTrendCsv: input.exportKpiTrendCsv,
    clearKpiTrendHistory: input.clearKpiTrendHistory,
    kpiSyncError: input.kpiSyncError,
    kpiSyncNotice: input.kpiSyncNotice,
    hasPendingKpiSync: input.hasPendingKpiSync,
    retryKpiSync: input.retryKpiSync,
    isRetryingKpiSync: input.isRetryingKpiSync,
    historyFilter: input.historyFilter,
    applyHistoryFilter: input.applyHistoryFilter,
    resetHistoryFilter: input.resetHistoryFilter,
    isApplyingKpiFilter: input.isApplyingKpiFilter,
    kpis: input.kpis,
    kpiRunHistory: input.kpiRunHistory,
    complianceAlerts: input.complianceAlerts,
    lastSchedulingBatchId: input.lastSchedulingBatchId,
    undoLastSchedulingBatch: input.undoLastSchedulingBatch,
    isUndoingSchedulingBatch: input.isUndoingSchedulingBatch,
    staffProfilesLoadDegraded: input.staffProfilesLoadDegraded,
  }
}

export type SchedulingWorkspaceReturn = ReturnType<typeof buildSchedulingWorkspaceReturn>
