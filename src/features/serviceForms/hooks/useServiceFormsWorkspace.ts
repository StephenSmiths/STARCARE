import { useMemo } from 'react'
import { useAuth, useAuthActorId, resolveStaffProfileIdForWorkPlans } from '../../auth'
import type { StarcareRole } from '../../auth/permissions'
import {
  deriveAcceptedOwnSessions,
  deriveMyForms,
  derivePendingReview,
} from './serviceFormWorkspaceDerived'
import { useServiceFormsWorkspaceLoadContext } from './useServiceFormsWorkspaceLoadContext'
import { useServiceFormsWorkspaceMutations } from './useServiceFormsWorkspaceMutations'

/** PDF 02【5】載入時段／院友／表單列表（Seq 17） */
export const useServiceFormsWorkspace = () => {
  const actorId = useAuthActorId()
  const { user, role, isConfigured } = useAuth()
  const staffProfileId = resolveStaffProfileIdForWorkPlans(user, isConfigured)

  const {
    serviceFormRepoRef,
    sessions,
    residents,
    forms,
    isLoading,
    loadError,
    reloadContext,
    refreshForms,
  } = useServiceFormsWorkspaceLoadContext()

  const acceptedOwnSessions = useMemo(
    () => deriveAcceptedOwnSessions(sessions, staffProfileId),
    [sessions, staffProfileId],
  )
  const myForms = useMemo(() => deriveMyForms(forms, actorId), [forms, actorId])
  const pendingReview = useMemo(() => derivePendingReview(forms), [forms])

  const { saveDraft, submit, approve, rejectRevision, softDelete } = useServiceFormsWorkspaceMutations({
    serviceFormRepoRef,
    refreshForms,
    actorId,
    staffProfileId,
    role: role as StarcareRole,
  })

  return {
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
}

export type ServiceFormsWorkspace = ReturnType<typeof useServiceFormsWorkspace>
