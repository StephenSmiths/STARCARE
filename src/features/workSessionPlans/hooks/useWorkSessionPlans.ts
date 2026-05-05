import { useAuth, useAuthActorId, resolveStaffProfileIdForWorkPlans } from '../../auth'
import { useWorkSessionPlansActions } from './useWorkSessionPlansActions'
import { useWorkSessionPlansDerivedRows } from './useWorkSessionPlansDerivedRows'
import { useWorkSessionPlansFilterState } from './useWorkSessionPlansFilterState'
import { WORK_SESSION_PLANS_WORKSPACE_FACILITY_ID } from '../constants/workSessionPlansWorkspaceDefaults'
import { useWorkSessionPlansLoadState } from './useWorkSessionPlansLoadState'

/** PDF 02【4】載入時段、篩選、接收／拒絕／主管批量軟刪（Seq 16） */
export const useWorkSessionPlans = () => {
  const actorId = useAuthActorId()
  const { user, role, isConfigured } = useAuth()
  const effectiveStaffProfileId = resolveStaffProfileIdForWorkPlans(user, isConfigured)
  const { mergedRows, isLoading, error, reload, bumpStore } = useWorkSessionPlansLoadState(
    WORK_SESSION_PLANS_WORKSPACE_FACILITY_ID,
  )

  const {
    selectedDate,
    setSelectedDate,
    showAllDates,
    setShowAllDates,
    statusFilter,
    setStatusFilter,
    dateKey,
  } = useWorkSessionPlansFilterState()

  const { filteredMyRows, filteredTeamRows } = useWorkSessionPlansDerivedRows({
    mergedRows,
    effectiveStaffProfileId,
    dateKey,
    statusFilter,
  })

  const { accept, reject, bulkSoftDelete } = useWorkSessionPlansActions({
    actorId,
    bumpStore,
    reload,
  })

  return {
    role,
    actorId,
    effectiveStaffProfileId,
    isLoading,
    error,
    reload,
    selectedDate,
    setSelectedDate,
    showAllDates,
    setShowAllDates,
    statusFilter,
    setStatusFilter,
    filteredMyRows,
    filteredTeamRows,
    mergedRows,
    accept,
    reject,
    bulkSoftDelete,
  }
}
