import { useAuth } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useSchedulingDashboardViewModel } from '../hooks/useSchedulingDashboardViewModel'
import { SchedulingStatsCards } from './SchedulingStatsCards'
import { SchedulingToolbar } from './SchedulingToolbar'
import { SchedulingResidentTable } from './SchedulingResidentTable'
import { SchedulingConflictsPanel } from './SchedulingConflictsPanel'
import { SchedulingDataAlerts } from './SchedulingDataAlerts'
import { SchedulingSavePanel } from './SchedulingSavePanel'
import { SchedulingHistoryUndoPanel } from './SchedulingHistoryUndoPanel'
import { SchedulingReportBar } from './SchedulingReportBar'
import { SchedulingKpiCards } from './SchedulingKpiCards'
import { SchedulingKpiTrendPanel } from './SchedulingKpiTrendPanel'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { SchedulingWorkflowSection } from './SchedulingWorkflowSection'
import { SchedulingAssignmentsList } from './SchedulingAssignmentsList'

/** 智能排班儀表板主內容（統計卡、表格、排班結果） */
export const SchedulingDashboard = () => {
  const { role } = useAuth()
  const vm = useSchedulingDashboardViewModel()

  return (
    <div className={uiTokens.layoutSpaceY8}>
      <SchedulingDataAlerts
        loadError={vm.loadError}
        saveError={vm.saveError}
        saveSuccess={vm.saveSuccess}
        complianceAlerts={vm.complianceAlerts}
        staffProfilesLoadDegraded={vm.staffProfilesLoadDegraded}
      />
      <SchedulingWorkflowSection
        sessionCount={vm.sessionCount}
        rosterConfirmed={vm.rosterConfirmed}
        onRosterConfirmedChange={vm.setRosterConfirmed}
        assignmentCount={vm.assignments.length}
        conflictCount={vm.conflicts.length}
        saveSuccess={vm.saveSuccess}
        onRosterImportCommitted={() => void vm.reloadSchedulingData({ clearPreview: true })}
      />
      <SchedulingToolbar
        onRunScheduling={vm.runScheduling}
        isRunning={vm.isRunning}
        disableRun={Boolean(vm.runBlockedReason)}
        disableRunReason={vm.runBlockedReason}
      />
      <SchedulingStatsCards
        totalResidents={vm.totalResidents}
        compliantCount={vm.compliantCount}
        pendingSlots={vm.pendingSlots}
      />
      <SchedulingKpiCards kpis={vm.kpis} complianceAlerts={vm.complianceAlerts} />
      <SchedulingKpiTrendPanel
        history={vm.kpiRunHistory}
        onDownloadCsv={() => vm.exportKpiTrendCsv()}
        onClearHistory={() => vm.clearKpiTrendHistory()}
        syncError={vm.kpiSyncError}
        syncNotice={vm.kpiSyncNotice}
        hasPendingSync={vm.hasPendingKpiSync}
        onRetrySync={() => void vm.retryKpiSync()}
        isRetryingSync={vm.isRetryingKpiSync}
        currentFilter={vm.historyFilter}
        onApplyFilter={(filter) => void vm.applyHistoryFilter(filter)}
        onResetFilter={() => void vm.resetHistoryFilter()}
        isApplyingFilter={vm.isApplyingKpiFilter}
      />
      <SchedulingReportBar
        onDownloadCsv={vm.exportWeeklyComplianceCsv}
        onDownloadAlertsCsv={vm.exportComplianceAlertsCsv}
        disabled={vm.totalResidents === 0}
        alertDisabled={vm.complianceAlerts.length === 0}
      />
      <SchedulingResidentTable rows={vm.tableRows} />
      <SchedulingAssignmentsList assignments={vm.assignments} previewSessions={vm.previewSessions} />
      <SchedulingConflictsPanel conflicts={vm.conflicts} />
      <SchedulingSavePanel
        canSave={vm.canSave}
        hasConflicts={vm.conflicts.length > 0}
        isSaving={vm.isSaving}
        onSave={() => void vm.saveScheduleAssignments()}
      />
      <SchedulingHistoryUndoPanel
        role={role}
        lastBatchId={vm.lastSchedulingBatchId}
        isUndoing={vm.isUndoingSchedulingBatch}
        onUndo={async () => {
          if (!window.confirm('確定軟刪除上次「一鍵儲存」之排班歷史批次？（01 §5，DB is_deleted）')) {
            return
          }
          try {
            await vm.undoLastSchedulingBatch()
            window.alert('已軟刪除該批次')
          } catch (error) {
            window.alert(error instanceof Error ? error.message : '軟刪除失敗')
          }
        }}
      />
      <AuditTrailPanel
        title="排班與相關操作審計"
        help="含排班執行／儲存、合規匯出；活動時段軟刪除列為 Scheduling；員工軟刪除請以類型 Staff 篩選。"
        auditTrail={vm.auditTrail}
      />
    </div>
  )
}
