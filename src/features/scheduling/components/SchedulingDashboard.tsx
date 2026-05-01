import { useEffect, useMemo, useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useScheduling } from '../hooks/useScheduling'
import { SchedulingStatsCards } from './SchedulingStatsCards'
import { SchedulingToolbar } from './SchedulingToolbar'
import { SchedulingResidentTable } from './SchedulingResidentTable'
import { SchedulingConflictsPanel } from './SchedulingConflictsPanel'
import { SchedulingDataAlerts } from './SchedulingDataAlerts'
import { SchedulingSavePanel } from './SchedulingSavePanel'
import { SchedulingReportBar } from './SchedulingReportBar'
import { SchedulingKpiCards } from './SchedulingKpiCards'
import { SchedulingKpiTrendPanel } from './SchedulingKpiTrendPanel'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { SchedulingWorkflowSection } from './SchedulingWorkflowSection'

/** 智能排班儀表板主內容（統計卡、表格、排班結果） */
export const SchedulingDashboard = () => {
  const [rosterConfirmed, setRosterConfirmed] = useState(false)
  const {
    totalResidents,
    compliantCount,
    pendingSlots,
    tableRows,
    assignments,
    conflicts,
    sessionCount,
    reloadSchedulingData,
    runScheduling,
    saveScheduleAssignments,
    isRunning,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    complianceAlerts,
    canSave,
    exportWeeklyComplianceCsv,
    exportComplianceAlertsCsv,
    kpis,
    kpiRunHistory,
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
  } = useScheduling()

  useEffect(() => {
    if (sessionCount > 0) return
    queueMicrotask(() => setRosterConfirmed(false))
  }, [sessionCount])

  const runBlockedReason = useMemo(() => {
    if (sessionCount === 0) return '請先匯入週更表或建立活動時段（步驟①）'
    if (!rosterConfirmed) return '請先勾選「確認本週更表／已載入時段」（步驟②）'
    if (totalResidents === 0) return '目前沒有在住院友可排班'
    return undefined
  }, [sessionCount, rosterConfirmed, totalResidents])

  return (
    <div className="space-y-8">
      <SchedulingDataAlerts
        loadError={loadError}
        saveError={saveError}
        saveSuccess={saveSuccess}
        complianceAlerts={complianceAlerts}
      />
      <SchedulingWorkflowSection
        sessionCount={sessionCount}
        rosterConfirmed={rosterConfirmed}
        onRosterConfirmedChange={setRosterConfirmed}
        assignmentCount={assignments.length}
        conflictCount={conflicts.length}
        saveSuccess={saveSuccess}
        onRosterImportCommitted={() => void reloadSchedulingData({ clearPreview: true })}
      />
      <SchedulingToolbar
        onRunScheduling={runScheduling}
        isRunning={isRunning}
        disableRun={Boolean(runBlockedReason)}
        disableRunReason={runBlockedReason}
      />
      <SchedulingStatsCards
        totalResidents={totalResidents}
        compliantCount={compliantCount}
        pendingSlots={pendingSlots}
      />
      <SchedulingKpiCards kpis={kpis} complianceAlerts={complianceAlerts} />
      <SchedulingKpiTrendPanel
        history={kpiRunHistory}
        onDownloadCsv={() => exportKpiTrendCsv()}
        onClearHistory={() => clearKpiTrendHistory()}
        syncError={kpiSyncError}
        syncNotice={kpiSyncNotice}
        hasPendingSync={hasPendingKpiSync}
        onRetrySync={() => void retryKpiSync()}
        isRetryingSync={isRetryingKpiSync}
        currentFilter={historyFilter}
        onApplyFilter={(filter) => void applyHistoryFilter(filter)}
        onResetFilter={() => void resetHistoryFilter()}
        isApplyingFilter={isApplyingKpiFilter}
      />
      <SchedulingReportBar
        onDownloadCsv={exportWeeklyComplianceCsv}
        onDownloadAlertsCsv={exportComplianceAlertsCsv}
        disabled={totalResidents === 0}
        alertDisabled={complianceAlerts.length === 0}
      />
      <SchedulingResidentTable rows={tableRows} />
      <div className={uiTokens.surfaceCardCompact}>
        <h3 className={uiTokens.blockHeading}>本次排班指派</h3>
        {assignments.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">尚未執行排班，請點選右上角「啟動智能排班」。</p>
        ) : (
          <ul className="mt-3 max-h-72 divide-y divide-slate-100 overflow-auto text-sm">
            {assignments.map((a) => (
              <li key={`${a.sessionId}-${a.residentId}`} className="py-2">
                <span className="font-medium text-slate-900">{a.residentName}</span>
                <span className="ml-2 text-slate-500">Pass {a.pass}</span>
                <span className="ml-2 text-xs text-slate-400">（{a.sessionId}）</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <SchedulingConflictsPanel conflicts={conflicts} />
      <SchedulingSavePanel
        canSave={canSave}
        hasConflicts={conflicts.length > 0}
        isSaving={isSaving}
        onSave={() => void saveScheduleAssignments()}
      />
      <AuditTrailPanel
        title="排班與相關操作審計"
        help="含排班執行／儲存、合規匯出；活動時段軟刪除列為 Scheduling；員工軟刪除請以類型 Staff 篩選。"
        auditTrail={globalAuditTrailService.list()}
      />
    </div>
  )
}
