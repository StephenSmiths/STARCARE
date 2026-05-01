import { MyWorkPlanPanel } from './MyWorkPlanPanel'
import { TeamWorkPlanPanel } from './TeamWorkPlanPanel'
import { useWorkSessionPlans } from '../hooks/useWorkSessionPlans'

/** PDF 02【4】工作計劃入口（Seq 16） */
export const WorkSessionPlansHome = () => {
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
    </div>
  )
}
