import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SchedulingSession } from '../../../services/schedulingService'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { residentService } from '../../residents/services/residentService'
import type { Resident } from '../../residents/types/resident'
import { loadServiceForms } from '../../../services/serviceFormStorage'
import { useAuth, useAuthActorId, resolveStaffProfileIdForWorkPlans } from '../../auth'
import type { StarcareRole } from '../../auth/permissions'
import { mergeSessionsWithResponses } from '../../workSessionPlans/services/workSessionPlanService'
import type { ServiceFormRecord } from '../types/serviceForm'
import {
  approveServiceForm,
  rejectServiceFormRevision,
  submitServiceForm,
  upsertDraftServiceForm,
} from '../services/serviceFormDomainService'

const FACILITY_ID = 'facility-main'

/** PDF 02【5】載入時段／院友／表單列表（Seq 17） */
export const useServiceFormsWorkspace = () => {
  const actorId = useAuthActorId()
  const { user, role } = useAuth()
  const staffProfileId = resolveStaffProfileIdForWorkPlans(user)
  const [sessions, setSessions] = useState<SchedulingSession[]>([])
  const [residents, setResidents] = useState<Resident[]>([])
  const [forms, setForms] = useState<ServiceFormRecord[]>(() => loadServiceForms())
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const refreshForms = useCallback(() => setForms(loadServiceForms()), [])

  const reloadContext = useCallback(async () => {
    setLoadError('')
    setIsLoading(true)
    try {
      const [sess, res] = await Promise.all([
        schedulingConfigService.listSchedulingSessions(FACILITY_ID),
        residentService.listActiveResidents(),
      ])
      setSessions(sess)
      setResidents(res)
      refreshForms()
    } catch {
      setLoadError('無法載入時段或院友資料')
    } finally {
      setIsLoading(false)
    }
  }, [refreshForms])

  useEffect(() => {
    queueMicrotask(() => {
      void reloadContext()
    })
  }, [reloadContext])

  const acceptedOwnSessions = useMemo(() => {
    const merged = mergeSessionsWithResponses(sessions)
    if (!staffProfileId) return []
    return merged.filter(
      (row) => row.responseStatus === 'ACCEPTED' && row.staffId === staffProfileId,
    )
  }, [sessions, staffProfileId])

  const myForms = useMemo(
    () => forms.filter((item) => item.ownerActorId === actorId),
    [forms, actorId],
  )

  const pendingReview = useMemo(() => forms.filter((item) => item.status === 'SUBMITTED'), [forms])

  const saveDraft = useCallback(
    (
      sess: SchedulingSession,
      residentId: string,
      residentName: string,
      narrative: string,
      existingId: string | null,
    ) => {
      const row = upsertDraftServiceForm(
        actorId,
        staffProfileId,
        sess,
        residentId,
        residentName,
        narrative,
        existingId,
      )
      refreshForms()
      return row
    },
    [actorId, staffProfileId, refreshForms],
  )

  const submit = useCallback(
    (record: ServiceFormRecord, sess: SchedulingSession) => {
      submitServiceForm(actorId, staffProfileId, record, sess)
      refreshForms()
    },
    [actorId, staffProfileId, refreshForms],
  )

  const approve = useCallback(
    (record: ServiceFormRecord) => {
      approveServiceForm(role as StarcareRole, actorId, record)
      refreshForms()
    },
    [actorId, role, refreshForms],
  )

  const rejectRevision = useCallback(
    (record: ServiceFormRecord, note: string) => {
      rejectServiceFormRevision(role as StarcareRole, actorId, record, note)
      refreshForms()
    },
    [actorId, role, refreshForms],
  )

  const value = {
    role: role as StarcareRole,
    actorId,
    staffProfileId,
    sessions,
    residents,
    /** 全系統表單列表（供 Seq 20【7】提交概況聚合） */
    allForms: forms,
    acceptedOwnSessions,
    myForms,
    pendingReview,
    isLoading,
    loadError,
    reloadContext,
    saveDraft,
    submit,
    approve,
    rejectRevision,
  }
  return value
}

export type ServiceFormsWorkspace = ReturnType<typeof useServiceFormsWorkspace>
