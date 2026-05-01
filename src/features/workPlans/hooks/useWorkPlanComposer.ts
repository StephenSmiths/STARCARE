import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthActorId } from '../../auth'
import { createActivityRepository } from '../../../repositories/activityRepository'
import type { Activity } from '../../../repositories/activityRepository'
import { staffManagementService } from '../../staff/services/staffManagementService'
import type { StaffOverviewRow } from '../../staff/services/staffManagementService'
import { validateWorkPlanDraftLine, type WorkPlanDraftLine } from '../services/workPlanDraftService'
import { workPlanCommitService } from '../services/workPlanCommitService'

const FACILITY_ID = 'facility-main'

const todayYmd = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** PDF 02【2】表單狀態 + 預覽列表 + 提交鎖（Seq 14） */
export const useWorkPlanComposer = () => {
  const actorId = useAuthActorId()
  const commitLockRef = useRef(false)
  const [staffRows, setStaffRows] = useState<StaffOverviewRow[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [metaLoading, setMetaLoading] = useState(true)
  const [metaError, setMetaError] = useState('')
  const [drafts, setDrafts] = useState<WorkPlanDraftLine[]>([])
  const [sessionDate, setSessionDate] = useState(todayYmd)
  const [staffProfileId, setStaffProfileId] = useState('')
  const [timeSlot, setTimeSlot] = useState('09:00')
  const [capacity, setCapacity] = useState(1)
  const [serviceType, setServiceType] = useState<WorkPlanDraftLine['serviceType']>('Subsidized_Rehab')
  const [formError, setFormError] = useState('')
  const [commitError, setCommitError] = useState('')
  const [commitSuccess, setCommitSuccess] = useState('')
  const [isCommitting, setIsCommitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setMetaLoading(true)
      setMetaError('')
      try {
        const activityRepo = createActivityRepository()
        const [staff, acts] = await Promise.all([
          staffManagementService.listStaffOverview(FACILITY_ID),
          activityRepo.listActivities(FACILITY_ID),
        ])
        if (!cancelled) {
          setStaffRows(staff)
          setActivities(acts)
        }
      } catch {
        if (!cancelled) setMetaError('無法載入員工或活動主檔，請稍後重試。')
      } finally {
        if (!cancelled) setMetaLoading(false)
      }
    }
    queueMicrotask(() => {
      void load()
    })
    return () => {
      cancelled = true
    }
  }, [])

  const staffDisplayName =
    staffRows.find((row) => row.staffId === staffProfileId)?.staffName ?? ''

  const addDraft = useCallback(() => {
    setFormError('')
    const line: WorkPlanDraftLine = {
      sessionDate,
      staffProfileId,
      staffDisplayName,
      timeSlot,
      capacity,
      serviceType,
    }
    const err = validateWorkPlanDraftLine(line)
    if (err) {
      setFormError(err)
      return
    }
    setDrafts((prev) => [...prev, line])
  }, [capacity, serviceType, sessionDate, staffDisplayName, staffProfileId, timeSlot])

  const removeDraft = useCallback((index: number) => {
    setDrafts((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const commitDrafts = useCallback(async () => {
    if (commitLockRef.current || drafts.length === 0) return
    commitLockRef.current = true
    setCommitError('')
    setCommitSuccess('')
    setIsCommitting(true)
    try {
      const result = await workPlanCommitService.commitWorkPlanDrafts(actorId, FACILITY_ID, drafts)
      setCommitSuccess(`已發布 ${result.inserted} 個工作節時段，可至「智能排班」載入後執行排班。`)
      setDrafts([])
    } catch (error) {
      setCommitError(error instanceof Error ? error.message : '儲存失敗')
    } finally {
      commitLockRef.current = false
      setIsCommitting(false)
    }
  }, [actorId, drafts])

  return {
    staffRows,
    activities,
    metaLoading,
    metaError,
    drafts,
    sessionDate,
    setSessionDate,
    staffProfileId,
    setStaffProfileId,
    timeSlot,
    setTimeSlot,
    capacity,
    setCapacity,
    serviceType,
    setServiceType,
    formError,
    addDraft,
    removeDraft,
    commitDrafts,
    commitError,
    commitSuccess,
    isCommitting,
  }
}
