import { useAuthActorId } from '../../auth'
import { WORK_PLANS_WORKSPACE_FACILITY_ID } from '../constants/workPlansWorkspaceDefaults'
import { useWorkPlanComposerCommit } from './useWorkPlanComposerCommit'
import { useWorkPlanComposerFormState } from './useWorkPlanComposerFormState'
import { useWorkPlanComposerMeta } from './useWorkPlanComposerMeta'

/** PDF 02【2】表單狀態 + 預覽列表 + 提交鎖（Seq 14） */
export const useWorkPlanComposer = () => {
  const actorId = useAuthActorId()
  const { staffRows, activities, residents, rules, metaLoading, metaError } = useWorkPlanComposerMeta(
    WORK_PLANS_WORKSPACE_FACILITY_ID,
  )

  const form = useWorkPlanComposerFormState(staffRows, residents, rules)

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
    staffRoleType: form.staffRoleType,
    startTime: form.startTime,
    setStartTime: form.setStartTime,
    durationMinutes: form.durationMinutes,
    setDurationMinutes: form.setDurationMinutes,
    effectiveActivityType: form.effectiveActivityType,
    setActivityType: form.setActivityType,
    allowedActivityTypes: form.allowedActivityTypes,
    residents: form.residents,
    residentIds: form.residentIds,
    setResidentIds: form.setResidentIds,
    toggleResident: form.toggleResident,
    activityContent: form.activityContent,
    setActivityContent: form.setActivityContent,
    activityContentOther: form.activityContentOther,
    setActivityContentOther: form.setActivityContentOther,
    activityDetail: form.activityDetail,
    setActivityDetail: form.setActivityDetail,
    activityDetailOther: form.activityDetailOther,
    setActivityDetailOther: form.setActivityDetailOther,
    contentOptions: form.contentOptions,
    detailOptions: form.detailOptions,
    capacity: form.capacity,
    setCapacity: form.setCapacity,
    maxGroupCapacity: form.maxGroupCapacity,
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
