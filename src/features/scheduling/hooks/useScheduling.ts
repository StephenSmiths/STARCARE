import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthActorId } from '../../auth'
import { getWeeklyTargetByFundingType } from '../../../services/schedulingTargets'
import { schedulingService } from '../../../services/schedulingService'
import type { SchedulingResident } from '../../../services/schedulingService'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import type { SchedulingViewModel } from '../types/schedule'
import { residentService } from '../../residents/services/residentService'
import { mapResidentToSchedulingResident } from '../utils/mapResidentToSchedulingResident'
import { schedulingPersistenceService } from '../../../services/schedulingPersistenceService'
import { downloadWeeklyComplianceCsv } from '../../../services/weeklyComplianceCsvService'
import { downloadSchedulingComplianceAlertsCsv } from '../../../services/schedulingComplianceAlertCsvService'
import { calculateSchedulingKpis, type SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { cloneResidents, cloneSessions, mapRulesToConstraints } from './schedulingHookHelpers'
import { useSchedulingDerived } from './useSchedulingDerived'
import { useSchedulingKpiHistory } from './useSchedulingKpiHistory'

export const useScheduling = () => {
  const actorId = useAuthActorId()
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
  const runLockRef = useRef(false)
  /** 防止連點造成重複寫入 scheduling_history（對齊業務 PDF 防重覆提交） */
  const saveLockRef = useRef(false)

  const reloadSchedulingData = useCallback(
    async (options?: { clearPreview?: boolean }) => {
      setLoadError('')
      try {
        const [residentRows, sessionRows] = await Promise.all([
          residentService.listActiveResidents(),
          schedulingConfigService.listSchedulingSessions(facilityId),
        ])
        void schedulingConfigService.getRules(facilityId)
        const mapped = residentRows.map(mapResidentToSchedulingResident)
        setResidents(cloneResidents(mapped))
        setSessionCount(sessionRows.length)
        if (options?.clearPreview) {
          setResult({ assignments: [], conflicts: [], underTargetResidents: [] })
          setSaveSuccess(false)
          setSaveError('')
        }
      } catch {
        setLoadError('無法連線載入院友或時段資料，請檢查網路與 API 設定。')
      }
    },
    [facilityId],
  )

  useEffect(() => {
    queueMicrotask(() => {
      void reloadSchedulingData()
    })
  }, [reloadSchedulingData])

  const { stats, tableRows, kpis, complianceAlerts } = useSchedulingDerived(residents, result)

  const runScheduling = useCallback(async () => {
    if (runLockRef.current) return
    runLockRef.current = true
    setIsRunning(true)
    setSaveSuccess(false)
    setSaveError('')
    try {
      const [residentRows, sessionRows, rules] = await Promise.all([
        residentService.listActiveResidents(),
        schedulingConfigService.listSchedulingSessions(facilityId),
        schedulingConfigService.getRules(facilityId),
      ])
      const latestResidents = residentRows.map(mapResidentToSchedulingResident)
      if (latestResidents.length === 0) {
        setResidents([])
        setResult({ assignments: [], conflicts: [], underTargetResidents: [] })
        setKpiRunHistory([])
        return
      }
      const nextResidents = cloneResidents(latestResidents)
      const sessionCopy = cloneSessions(sessionRows)
      const output = schedulingService.runSubsidizedRehabScheduling(
        actorId,
        nextResidents,
        sessionCopy,
        mapRulesToConstraints(rules),
      )
      setResidents(nextResidents)
      setResult({
        assignments: output.assignments,
        conflicts: output.conflicts,
        underTargetResidents: output.underTargetResidents,
      })
      const snapshot = calculateSchedulingKpis(nextResidents, output.assignments, output.conflicts)
      const nextRecord: SchedulingKpiRunRecord = {
        ranAt: new Date().toISOString(),
        kpis: snapshot,
        residentCount: nextResidents.length,
        assignmentCount: output.assignments.length,
        conflictCount: output.conflicts.length,
        actorId,
      }
      appendKpiRunRecord(nextRecord)
    } catch {
      setLoadError('無法連線載入院友或時段資料，請檢查網路與 API 設定。')
    } finally {
      runLockRef.current = false
      setIsRunning(false)
    }
  }, [actorId, appendKpiRunRecord, facilityId, setKpiRunHistory])

  const saveScheduleAssignments = useCallback(async () => {
    if (saveLockRef.current) return
    saveLockRef.current = true
    setSaveError('')
    setSaveSuccess(false)
    setIsSaving(true)
    try {
      await schedulingPersistenceService.saveScheduleAssignments(
        actorId,
        result.assignments,
        result.conflicts,
      )
      setSaveSuccess(true)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '儲存排班結果時發生錯誤，請稍後再試。'
      setSaveError(message)
    } finally {
      saveLockRef.current = false
      setIsSaving(false)
    }
  }, [actorId, result.assignments, result.conflicts])

  const exportWeeklyComplianceCsv = useCallback(() => {
    downloadWeeklyComplianceCsv(
      residents.map((r) => ({
        name: r.name,
        fundingType: r.fundingType,
        isCompliant: r.weeklyCompletedCount >= getWeeklyTargetByFundingType(r.fundingType),
      })),
    )
  }, [residents])

  const exportComplianceAlertsCsv = useCallback(() => {
    if (complianceAlerts.length === 0) return
    downloadSchedulingComplianceAlertsCsv(complianceAlerts)
    globalAuditTrailService.record({
      action: 'COMPLIANCE_ALERT_EXPORT',
      entityType: 'Reporting',
      entityId: `midweek-alerts-${Date.now()}`,
      actorId,
      beforeState: null,
      afterState: JSON.stringify({ alertCount: complianceAlerts.length }),
      detail: '匯出週三 0 次高優先提醒清單（CSV）',
      occurredAt: new Date().toISOString(),
    })
  }, [actorId, complianceAlerts])

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
  }
}
