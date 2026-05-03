import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { MyWorkPlanPanel } from './MyWorkPlanPanel'
import { TeamWorkPlanPanel } from './TeamWorkPlanPanel'
import { useWorkSessionPlans } from '../hooks/useWorkSessionPlans'

/** PDF 02【4】工作計劃入口（Seq 16） */
export const WorkSessionPlansHome = () => {
  const auditTrail = useAuditTrailList()
  const plans = useWorkSessionPlans()

  return (
    <div className="space-y-8">
      <MyWorkPlanPanel
        role={plans.role}
        effectiveStaffProfileId={plans.effectiveStaffProfileId}
        rows={plans.filteredMyRows}
        isLoading={plans.isLoading}
        error={plans.error}
        selectedDate={plans.selectedDate}
        onSelectedDateChange={plans.setSelectedDate}
        showAllDates={plans.showAllDates}
        onShowAllDatesChange={plans.setShowAllDates}
        statusFilter={plans.statusFilter}
        onStatusFilterChange={plans.setStatusFilter}
        onAccept={plans.accept}
        onReject={plans.reject}
      />
      <TeamWorkPlanPanel
        role={plans.role}
        rows={plans.filteredTeamRows}
        isLoading={plans.isLoading}
        selectedDate={plans.selectedDate}
        showAllDates={plans.showAllDates}
        onShowAllDatesChange={plans.setShowAllDates}
        onSelectedDateChange={plans.setSelectedDate}
        statusFilter={plans.statusFilter}
        onStatusFilterChange={plans.setStatusFilter}
        onBulkSoftDelete={plans.bulkSoftDelete}
      />
      <AuditTrailPanel
        title="工作節與計劃審計（全域）"
        help="含 WORK_SESSION_*、WORK_PLAN_SESSION_COMMIT 等（PDF 02【2】【4】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
