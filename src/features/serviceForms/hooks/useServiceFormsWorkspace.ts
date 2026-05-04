import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SchedulingSession } from '../../../services/schedulingService'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { residentService } from '../../residents/services/residentService'
import type { Resident } from '../../residents/types/resident'
import { loadServiceForms } from '../../../services/serviceFormStorage'
import { createServiceFormRepository } from '../../../repositories/serviceFormRepository'
import { mergeServiceFormsWithRemote } from '../../../repositories/serviceFormSyncService'
import { useAuth, useAuthActorId, resolveStaffProfileIdForWorkPlans } from '../../auth'
import { useInvalidateOnSystemSettingsExternalChange } from '../../systemSettings'
import type { StarcareRole } from '../../auth/permissions'
import { mergeSessionsWithResponses } from '../../workSessionPlans/services/workSessionPlanService'
import type { ServiceFormRecord } from '../types/serviceForm'
import {
  approveServiceForm,
  rejectServiceFormRevision,
  submitServiceForm,
  upsertDraftServiceForm,
} from '../services/serviceFormDomainService'
import { softDeleteServiceForm } from '../services/serviceFormSoftDeleteService'

const FACILITY_ID = 'facility-main'

const skipRemoteFormAuditPersist = (): boolean => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}
  return !!(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY)
}

/** PDF 02【5】載入時段／院友／表單列表（Seq 17） */
export const useServiceFormsWorkspace = () => {
  const actorId = useAuthActorId()
  const { user, role, isConfigured } = useAuth()
  const staffProfileId = resolveStaffProfileIdForWorkPlans(user, isConfigured)
  const serviceFormRepoRef = useRef(createServiceFormRepository())
  const [sessions, setSessions] = useState<SchedulingSession[]>([])
  const [residents, setResidents] = useState<Resident[]>([])
  const [forms, setForms] = useState<ServiceFormRecord[]>(() => loadServiceForms())
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const loadSeqRef = useRef(0)

  const refreshForms = useCallback(() => setForms(loadServiceForms()), [])

  const mergeRemoteForms = useCallback(() => mergeServiceFormsWithRemote(FACILITY_ID), [])

  const reloadContext = useCallback(async () => {
    const seq = ++loadSeqRef.current
    setLoadError('')
    setIsLoading(true)
    try {
      const [sess, res] = await Promise.all([
        schedulingConfigService.listSchedulingSessions(FACILITY_ID),
        residentService.listActiveResidents(),
      ])
      if (seq !== loadSeqRef.current) return
      setSessions(sess)
      setResidents(res)
      const merged = await mergeRemoteForms()
      if (seq !== loadSeqRef.current) return
      setForms(merged)
    } catch {
      if (seq === loadSeqRef.current) {
        setLoadError('無法載入時段或院友資料')
      }
    } finally {
      if (seq === loadSeqRef.current) setIsLoading(false)
    }
  }, [mergeRemoteForms])

  useEffect(() => {
    queueMicrotask(() => {
      void reloadContext()
    })
  }, [reloadContext])

  useInvalidateOnSystemSettingsExternalChange(reloadContext)

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
      const skipAudit = skipRemoteFormAuditPersist()
      const row = upsertDraftServiceForm(
        actorId,
        staffProfileId,
        sess,
        residentId,
        residentName,
        narrative,
        existingId,
        skipAudit,
      )
      refreshForms()
      void serviceFormRepoRef.current.upsertForm(FACILITY_ID, row).catch(() => {})
      return row
    },
    [actorId, staffProfileId, refreshForms],
  )

  const submit = useCallback(
    (record: ServiceFormRecord, sess: SchedulingSession) => {
      const next = submitServiceForm(actorId, staffProfileId, record, sess, skipRemoteFormAuditPersist())
      refreshForms()
      void serviceFormRepoRef.current.upsertForm(FACILITY_ID, next).catch(() => {})
    },
    [actorId, staffProfileId, refreshForms],
  )

  const approve = useCallback(
    (record: ServiceFormRecord) => {
      const next = approveServiceForm(role as StarcareRole, actorId, record, skipRemoteFormAuditPersist())
      refreshForms()
      void serviceFormRepoRef.current.upsertForm(FACILITY_ID, next).catch(() => {})
    },
    [actorId, role, refreshForms],
  )

  const rejectRevision = useCallback(
    (record: ServiceFormRecord, note: string) => {
      const next = rejectServiceFormRevision(
        role as StarcareRole,
        actorId,
        record,
        note,
        skipRemoteFormAuditPersist(),
      )
      refreshForms()
      void serviceFormRepoRef.current.upsertForm(FACILITY_ID, next).catch(() => {})
    },
    [actorId, role, refreshForms],
  )

  const softDelete = useCallback(
    async (record: ServiceFormRecord) => {
      await softDeleteServiceForm(role as StarcareRole, actorId, record, skipRemoteFormAuditPersist())
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
    softDelete,
  }
  return value
}

export type ServiceFormsWorkspace = ReturnType<typeof useServiceFormsWorkspace>
