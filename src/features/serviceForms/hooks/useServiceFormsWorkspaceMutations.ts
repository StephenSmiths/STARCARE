import { useCallback, type MutableRefObject } from 'react'
import type { SchedulingSession } from '../../../services/schedulingService'
import type { ServiceFormRepository } from '../../../repositories/serviceFormRepository'
import type { StarcareRole } from '../../auth/permissions'
import type { ServiceFormRecord } from '../types/serviceForm'
import {
  runWorkspaceApproveServiceForm,
  runWorkspaceRejectServiceFormRevision,
  runWorkspaceSaveDraftServiceForm,
  runWorkspaceSoftDeleteServiceForm,
  runWorkspaceSubmitServiceForm,
} from './serviceFormsWorkspaceMutationRunners'

/** 表單 workspace 之草稿／提交／審核／軟刪（Seq 17 Edge upsert + hydration；實作見 runners） */
export const useServiceFormsWorkspaceMutations = (params: {
  serviceFormRepoRef: MutableRefObject<ServiceFormRepository>
  refreshForms: () => void
  actorId: string
  staffProfileId: string | null
  role: StarcareRole
}) => {
  const { serviceFormRepoRef, refreshForms, actorId, staffProfileId, role } = params

  const saveDraft = useCallback(
    (
      sess: SchedulingSession,
      residentId: string,
      residentName: string,
      narrative: string,
      existingId: string | null,
    ) =>
      runWorkspaceSaveDraftServiceForm(
        { serviceFormRepoRef, refreshForms, actorId, staffProfileId },
        sess,
        residentId,
        residentName,
        narrative,
        existingId,
      ),
    [actorId, staffProfileId, refreshForms, serviceFormRepoRef],
  )

  const submit = useCallback(
    (record: ServiceFormRecord, sess: SchedulingSession) =>
      runWorkspaceSubmitServiceForm(
        { serviceFormRepoRef, refreshForms, actorId, staffProfileId },
        record,
        sess,
      ),
    [actorId, staffProfileId, refreshForms, serviceFormRepoRef],
  )

  const approve = useCallback(
    (record: ServiceFormRecord) =>
      runWorkspaceApproveServiceForm(
        { serviceFormRepoRef, refreshForms, actorId, role },
        record,
      ),
    [actorId, role, refreshForms, serviceFormRepoRef],
  )

  const rejectRevision = useCallback(
    (record: ServiceFormRecord, note: string) =>
      runWorkspaceRejectServiceFormRevision(
        { serviceFormRepoRef, refreshForms, actorId, role },
        record,
        note,
      ),
    [actorId, role, refreshForms, serviceFormRepoRef],
  )

  const softDelete = useCallback(
    async (record: ServiceFormRecord) =>
      runWorkspaceSoftDeleteServiceForm({ refreshForms, actorId, role }, record),
    [actorId, role, refreshForms],
  )

  return { saveDraft, submit, approve, rejectRevision, softDelete }
}
