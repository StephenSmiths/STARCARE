import { useCallback, useState } from 'react'
import type { Resident } from '../../residents/types/resident'
import type { SchedulingRules } from '../../../repositories/schedulingRulesRepository'
import type { StaffOverviewRow } from '../../staff/services/staffManagementService'
import type { StaffProfileRoleType } from '../../../services/schedulingService'
import {
  allowedActivityTypesByRole,
  getContentOptions,
  resolveDetailOptions,
} from '../constants/workPlanCascadeCatalog'
import {
  computeEndTime,
  formatRangeLabel,
  validateWorkPlanDraftLine,
  type WorkPlanActivityType,
  type WorkPlanDraftLine,
} from '../services/workPlanDraftService'
import { workPlanComposerTodayYmd } from '../utils/workPlanComposerLocalDate'

/** PDF 02【2】草稿列與主表欄位（不含提交）。 */
export const useWorkPlanComposerFormState = (
  staffRows: StaffOverviewRow[],
  residents: Resident[],
  rules: SchedulingRules | null,
) => {
  const [drafts, setDrafts] = useState<WorkPlanDraftLine[]>([])
  const [sessionDate, setSessionDate] = useState(workPlanComposerTodayYmd)
  const [staffProfileId, setStaffProfileId] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [activityType, setActivityType] = useState<WorkPlanActivityType>('Individual')
  const [residentIds, setResidentIds] = useState<string[]>([])
  const [activityContent, setActivityContent] = useState('')
  const [activityContentOther, setActivityContentOther] = useState('')
  const [activityDetail, setActivityDetail] = useState('')
  const [activityDetailOther, setActivityDetailOther] = useState('')
  const [capacity, setCapacity] = useState(1)
  const [serviceType, setServiceType] = useState<WorkPlanDraftLine['serviceType']>('Subsidized_Rehab')
  const [formError, setFormError] = useState('')

  const staffDisplayName = staffRows.find((row) => row.staffId === staffProfileId)?.staffName ?? ''
  const staffRoleType =
    (staffRows.find((row) => row.staffId === staffProfileId)?.roleType as StaffProfileRoleType | undefined) ?? 'PT'
  const allowedActivityTypes = allowedActivityTypesByRole[staffRoleType]
  const effectiveActivityType = allowedActivityTypes.includes(activityType)
    ? activityType
    : (allowedActivityTypes[0] ?? 'Other')
  const computedCapacity =
    effectiveActivityType === 'Individual' || effectiveActivityType === 'Assessment'
      ? 1
      : Math.max(1, Math.floor(capacity))
  const maxGroupCapacity = Math.max(1, rules?.groupCapacityLimit ?? 6)
  const contentOptions = getContentOptions(staffRoleType, effectiveActivityType)
  const detailOptions = resolveDetailOptions(staffRoleType, effectiveActivityType, activityContent)

  const addDraft = useCallback(() => {
    setFormError('')
    const endTime = computeEndTime(startTime, durationMinutes)
    if (!endTime) {
      setFormError('開始時間或時長格式錯誤')
      return
    }
    if ((effectiveActivityType === 'Individual' || effectiveActivityType === 'Assessment') && residentIds.length !== 1) {
      setFormError('個別訓練／評估需且僅可選 1 位院友')
      return
    }
    if (effectiveActivityType === 'Group') {
      if (residentIds.length < 1) {
        setFormError('小組訓練至少需選 1 位院友')
        return
      }
      if (residentIds.length > maxGroupCapacity || computedCapacity > maxGroupCapacity) {
        setFormError(`小組訓練上限為 ${maxGroupCapacity}`)
        return
      }
    }
    const line: WorkPlanDraftLine = {
      sessionDate,
      staffProfileId,
      staffDisplayName,
      staffRoleType,
      startTime,
      durationMinutes,
      endTime,
      timeSlot: formatRangeLabel(startTime, endTime),
      activityType: effectiveActivityType,
      residentIds: [...residentIds],
      activityContent,
      activityContentOther,
      activityDetail,
      activityDetailOther,
      capacity: computedCapacity,
      serviceType,
    }
    const err = validateWorkPlanDraftLine(line)
    if (err) {
      setFormError(err)
      return
    }
    setDrafts((prev) => [...prev, line])
  }, [
    activityContent,
    activityContentOther,
    activityDetail,
    activityDetailOther,
    computedCapacity,
    durationMinutes,
    effectiveActivityType,
    maxGroupCapacity,
    residentIds,
    serviceType,
    sessionDate,
    staffDisplayName,
    staffProfileId,
    staffRoleType,
    startTime,
  ])

  const removeDraft = useCallback((index: number) => {
    setDrafts((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const toggleResident = useCallback(
    (residentId: string) => {
      setResidentIds((prev) => {
        if (effectiveActivityType === 'Individual' || effectiveActivityType === 'Assessment') {
          return [residentId]
        }
        return prev.includes(residentId) ? prev.filter((id) => id !== residentId) : [...prev, residentId]
      })
    },
    [effectiveActivityType],
  )

  return {
    drafts,
    setDrafts,
    sessionDate,
    setSessionDate,
    staffProfileId,
    setStaffProfileId,
    staffRoleType,
    startTime,
    setStartTime,
    durationMinutes,
    setDurationMinutes,
    effectiveActivityType,
    setActivityType,
    allowedActivityTypes,
    residentIds,
    setResidentIds,
    toggleResident,
    residents,
    activityContent,
    setActivityContent,
    activityContentOther,
    setActivityContentOther,
    activityDetail,
    setActivityDetail,
    activityDetailOther,
    setActivityDetailOther,
    contentOptions,
    detailOptions,
    capacity,
    setCapacity,
    maxGroupCapacity,
    serviceType,
    setServiceType,
    formError,
    addDraft,
    removeDraft,
  }
}
