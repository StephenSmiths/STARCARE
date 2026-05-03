import { useCallback, useEffect, useState } from 'react'
import { useAuth, useAuthActorId } from '../../auth'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import type { SchedulingResident } from '../../../services/schedulingService'
import {
  getStaffProfilesUnavailableLastList,
  schedulingConfigService,
} from '../../../services/schedulingConfigService'
import type { SchedulingViewModel } from '../types/schedule'
import { residentService } from '../../residents/services/residentService'
import { runSchedulingReloadPageData } from '../services/schedulingReloadPageData'
import { useSchedulingBatchUndo } from './useSchedulingBatchUndo'
import { useSchedulingCsvExports } from './useSchedulingCsvExports'
import { cloneResidents } from './schedulingHookHelpers'
import { useSchedulingDerived } from './useSchedulingDerived'
import { useSchedulingKpiHistory } from './useSchedulingKpiHistory'
import { useSchedulingRunAndSave } from './useSchedulingRunAndSave'

export const useScheduling = () => {
  const actorId = useAuthActorId()
  const { role } = useAuth()
  const facilityId = 'facility-main'
  const [residents, setResidents] = useState<SchedulingResident[]>([])
  /** 本週已載入之活動／排班時段筆數（供 02【3】五步流程） */
  const [sessionCount, setSessionCount] = useState(0)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [result, setResult] = useState<SchedulingViewModel>({
    assignments: [],
    conflicts: [],
    underTargetResidents: [],
  })
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [staffProfilesLoadDegraded, setStaffProfilesLoadDegraded] = useState(false)
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

  const reloadSchedulingData = useCallback(
    async (options?: { clearPreview?: boolean }) => {
      setLoadError('')
      const outcome = await runSchedulingReloadPageData(facilityId, {
        listActiveResidents: () => residentService.listActiveResidents(),
        listSchedulingSessions: (id) => schedulingConfigService.listSchedulingSessions(id),
        prefetchRules: (id) => void schedulingConfigService.getRules(id),
      })
      if (!outcome.ok) {
        setLoadError(outcome.loadError)
        setStaffProfilesLoadDegraded(false)
        return
      }
      setResidents(cloneResidents(outcome.schedulingResidents))
      setSessionCount(outcome.sessionCount)
      setStaffProfilesLoadDegraded(getStaffProfilesUnavailableLastList())
      if (options?.clearPreview) {
        setResult({ assignments: [], conflicts: [], underTargetResidents: [] })
        setSaveSuccess(false)
        setSaveError('')
      }
    },
    [facilityId],
  )

  const reloadAfterSettingsChange = useCallback(
    () => void reloadSchedulingData({ clearPreview: true }),
    [reloadSchedulingData],
  )
  useInvalidateOnSystemSettingsExternalChange(reloadAfterSettingsChange)

  useEffect(() => {
    queueMicrotask(() => {
      void reloadSchedulingData()
    })
  }, [reloadSchedulingData])

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

  return {
    ...stats,
    sessionCount,
    reloadSchedulingData,
    tableRows,
    assignments: result.assignments,
    conflicts: result.conflicts,
    underTargetResidents: result.underTargetResidents,
    runScheduling,
    saveScheduleAssignments,
    isRunning,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    canSave: result.assignments.length > 0 && result.conflicts.length === 0,
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
  }
}
