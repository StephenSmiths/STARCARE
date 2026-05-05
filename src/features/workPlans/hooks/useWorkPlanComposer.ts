import { useAuthActorId } from '../../auth'
import { WORK_PLANS_WORKSPACE_FACILITY_ID } from '../constants/workPlansWorkspaceDefaults'
import { useWorkPlanComposerCommit } from './useWorkPlanComposerCommit'
import { useWorkPlanComposerFormState } from './useWorkPlanComposerFormState'
import { useWorkPlanComposerMeta } from './useWorkPlanComposerMeta'

/** PDF 02【2】表單狀態 + 預覽列表 + 提交鎖（Seq 14） */
export const useWorkPlanComposer = () => {
  const actorId = useAuthActorId()
  const { staffRows, activities, metaLoading, metaError } = useWorkPlanComposerMeta(
    WORK_PLANS_WORKSPACE_FACILITY_ID,
  )

  const form = useWorkPlanComposerFormState(staffRows)

  const { commitDrafts, commitError, commitSuccess, isCommitting } = useWorkPlanComposerCommit(
    actorId,
    WORK_PLANS_WORKSPACE_FACILITY_ID,
    form.drafts,
    form.setDrafts,
  )

  return {
    staffRows,
    activities,
    metaLoading,
    metaError,
    drafts: form.drafts,
    sessionDate: form.sessionDate,
    setSessionDate: form.setSessionDate,
    staffProfileId: form.staffProfileId,
    setStaffProfileId: form.setStaffProfileId,
    timeSlot: form.timeSlot,
    setTimeSlot: form.setTimeSlot,
    capacity: form.capacity,
    setCapacity: form.setCapacity,
    serviceType: form.serviceType,
    setServiceType: form.setServiceType,
    formError: form.formError,
    addDraft: form.addDraft,
    removeDraft: form.removeDraft,
    commitDrafts,
    commitError,
    commitSuccess,
    isCommitting,
  }
}
