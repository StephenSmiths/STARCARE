import type { MutableRefObject } from 'react'
import type { SchedulingSession } from '../../../services/schedulingService'
import { isSupabaseBrowserConfigured } from '../../../services/supabaseBrowserEnv'
import type { ServiceFormRepository } from '../../../repositories/serviceFormRepository'
import type { StarcareRole } from '../../auth/permissions'
import {
  approveServiceForm,
  rejectServiceFormRevision,
  submitServiceForm,
  upsertDraftServiceForm,
} from '../services/serviceFormDomainService'
import { softDeleteServiceForm } from '../services/serviceFormSoftDeleteService'
import type { ServiceFormRecord } from '../types/serviceForm'
import { scheduleWorkspaceServiceFormEdgeUpsert } from './scheduleWorkspaceServiceFormEdgeUpsert'

/** 供 workspace hook 注入之共用依賴（Edge upsert + refresh）。 */
export type ServiceFormWorkspaceMutationDeps = {
  serviceFormRepoRef: MutableRefObject<ServiceFormRepository>
  refreshForms: () => void
  actorId: string
  staffProfileId: string | null
  role: StarcareRole
}

/** 草稿 upsert 後排程 Seq 17 Edge upsert（skipAudit 與 domain 一致）。 */
export const runWorkspaceSaveDraftServiceForm = (
  deps: Pick<
    ServiceFormWorkspaceMutationDeps,
    'serviceFormRepoRef' | 'refreshForms' | 'actorId' | 'staffProfileId'
  >,
  sess: SchedulingSession,
  residentId: string,
  residentName: string,
  narrative: string,
  existingId: string | null,
): ServiceFormRecord => {
  const skipAudit = isSupabaseBrowserConfigured()
  const row = upsertDraftServiceForm(
    deps.actorId,
    deps.staffProfileId,
    sess,
    residentId,
    residentName,
    narrative,
    existingId,
    skipAudit,
  )
  scheduleWorkspaceServiceFormEdgeUpsert(deps.serviceFormRepoRef, deps.refreshForms, row, skipAudit)
  return row
}

export const runWorkspaceSubmitServiceForm = (
  deps: Pick<
    ServiceFormWorkspaceMutationDeps,
    'serviceFormRepoRef' | 'refreshForms' | 'actorId' | 'staffProfileId'
  >,
  record: ServiceFormRecord,
  sess: SchedulingSession,
): void => {
  const skipAudit = isSupabaseBrowserConfigured()
  const next = submitServiceForm(deps.actorId, deps.staffProfileId, record, sess, skipAudit)
  scheduleWorkspaceServiceFormEdgeUpsert(deps.serviceFormRepoRef, deps.refreshForms, next, skipAudit)
}

export const runWorkspaceApproveServiceForm = (
  deps: Pick<ServiceFormWorkspaceMutationDeps, 'serviceFormRepoRef' | 'refreshForms' | 'actorId' | 'role'>,
  record: ServiceFormRecord,
): void => {
  const skipAudit = isSupabaseBrowserConfigured()
  const next = approveServiceForm(deps.role, deps.actorId, record, skipAudit)
  scheduleWorkspaceServiceFormEdgeUpsert(deps.serviceFormRepoRef, deps.refreshForms, next, skipAudit)
}

export const runWorkspaceRejectServiceFormRevision = (
  deps: Pick<ServiceFormWorkspaceMutationDeps, 'serviceFormRepoRef' | 'refreshForms' | 'actorId' | 'role'>,
  record: ServiceFormRecord,
  note: string,
): void => {
  const skipAudit = isSupabaseBrowserConfigured()
  const next = rejectServiceFormRevision(deps.role, deps.actorId, record, note, skipAudit)
  scheduleWorkspaceServiceFormEdgeUpsert(deps.serviceFormRepoRef, deps.refreshForms, next, skipAudit)
}

export const runWorkspaceSoftDeleteServiceForm = async (
  deps: Pick<ServiceFormWorkspaceMutationDeps, 'refreshForms' | 'actorId' | 'role'>,
  record: ServiceFormRecord,
): Promise<void> => {
  const skipAudit = isSupabaseBrowserConfigured()
  await softDeleteServiceForm(deps.role, deps.actorId, record, skipAudit)
  deps.refreshForms()
}
