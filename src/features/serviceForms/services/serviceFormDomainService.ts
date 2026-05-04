import type { SchedulingSession } from '../../../services/schedulingService'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import {
  loadServiceForms,
  upsertServiceForm,
} from '../../../services/serviceFormStorage'
import { resolveLifecycleStatus } from '../../workSessionPlans/services/workSessionPlanService'
import { completeWorkSessionAfterFormApproved } from '../../workSessions/domain/workSessionCompletionService'
import type { ServiceFormRecord, ServiceFormStatus } from '../types/serviceForm'
import type { StarcareRole } from '../../auth/permissions'
import { canApproveForm, hasPermission } from '../../auth/permissions'

const nowIso = () => new Date().toISOString()

/** 01 §2.1：僅 ACCEPTED 之工作節可提交服務表單 */
export const assertSessionAcceptedForSubmit = (sessionId: string): void => {
  if (resolveLifecycleStatus(sessionId) !== 'ACCEPTED') {
    throw new Error('01 §2.1：僅「已接收」工作節可提交服務表單')
  }
}

/** 員工只能為本人指派之工作節填寫 */
export const assertStaffOwnsSession = (
  session: SchedulingSession,
  staffProfileId: string | null,
): void => {
  if (!staffProfileId || session.staffId !== staffProfileId) {
    throw new Error('僅可為本人指派之工作節填寫表單')
  }
}

/** 01 §2.2：核准後鎖定 */
export const assertFormEditable = (form: ServiceFormRecord): void => {
  if (form.status === 'APPROVED') throw new Error('表單已核准並鎖定，不得修改')
  if (form.status === 'SUBMITTED') throw new Error('已提交待審，請等待主管審核或退回後再編輯')
}

export const upsertDraftServiceForm = (
  actorId: string,
  staffProfileId: string | null,
  session: SchedulingSession,
  residentId: string,
  residentName: string,
  narrative: string,
  existingId: string | null,
  skipRemoteAuditPersist = false,
): ServiceFormRecord => {
  assertStaffOwnsSession(session, staffProfileId)
  const ts = nowIso()
  const existing =
    existingId !== null ? loadServiceForms().find((item) => item.id === existingId) ?? null : null
  if (existing) assertFormEditable(existing)
  const base: ServiceFormRecord =
    existing ??
    ({
      id: `service-form-${crypto.randomUUID()}`,
      sessionId: session.id,
      sessionDate: session.date,
      staffProfileId: session.staffId,
      residentId,
      residentName,
      narrative,
      status: 'DRAFT' as ServiceFormStatus,
      ownerActorId: actorId,
      createdAt: ts,
      updatedAt: ts,
      submittedAt: null,
      reviewedAt: null,
      reviewerActorId: null,
      reviewNote: null,
    } satisfies ServiceFormRecord)
  const row: ServiceFormRecord = {
    ...base,
    sessionId: session.id,
    sessionDate: session.date,
    staffProfileId: session.staffId,
    residentId,
    residentName,
    narrative,
    updatedAt: ts,
  }
  upsertServiceForm(row)
  globalAuditTrailService.record(
    {
      action: 'FORM_DRAFT_UPSERT',
      entityType: 'Scheduling',
      entityId: row.id,
      actorId,
      beforeState: existing ? JSON.stringify({ status: existing.status }) : null,
      afterState: JSON.stringify({ status: row.status, sessionId: row.sessionId }),
      detail: '儲存服務表單草稿',
      occurredAt: ts,
    },
    skipRemoteAuditPersist,
  )
  return row
}

export const submitServiceForm = (
  actorId: string,
  staffProfileId: string | null,
  form: ServiceFormRecord,
  session: SchedulingSession,
  skipRemoteAuditPersist = false,
): ServiceFormRecord => {
  assertStaffOwnsSession(session, staffProfileId)
  assertSessionAcceptedForSubmit(session.id)
  if (form.ownerActorId !== actorId) throw new Error('僅填表人本人可提交')
  if (form.status !== 'DRAFT' && form.status !== 'REJECTED_NEEDS_REVISION') {
    throw new Error('僅草稿或退回狀態可提交')
  }
  const ts = nowIso()
  const next: ServiceFormRecord = {
    ...form,
    status: 'SUBMITTED',
    updatedAt: ts,
    submittedAt: ts,
  }
  upsertServiceForm(next)
  globalAuditTrailService.record(
    {
      action: 'FORM_SUBMIT',
      entityType: 'Scheduling',
      entityId: form.id,
      actorId,
      beforeState: JSON.stringify({ status: form.status }),
      afterState: JSON.stringify({ status: 'SUBMITTED' }),
      detail: '提交服務表單待審',
      occurredAt: ts,
    },
    skipRemoteAuditPersist,
  )
  return next
}

export const approveServiceForm = (
  role: StarcareRole,
  reviewerActorId: string,
  form: ServiceFormRecord,
  skipRemoteAuditPersist = false,
): ServiceFormRecord => {
  if (!hasPermission(role, 'action:approve-form')) throw new Error('無審批權限')
  if (!canApproveForm(role, reviewerActorId, form.ownerActorId)) throw new Error('不可審批本人表單')
  if (form.status !== 'SUBMITTED') throw new Error('僅「已提交」表單可核准')
  const ts = nowIso()
  const next: ServiceFormRecord = {
    ...form,
    status: 'APPROVED',
    updatedAt: ts,
    reviewedAt: ts,
    reviewerActorId,
    reviewNote: null,
  }
  upsertServiceForm(next)
  globalAuditTrailService.record(
    {
      action: 'FORM_APPROVE',
      entityType: 'Scheduling',
      entityId: form.id,
      actorId: reviewerActorId,
      beforeState: JSON.stringify({ status: 'SUBMITTED' }),
      afterState: JSON.stringify({ status: 'APPROVED' }),
      detail: '核准服務表單（已鎖定）',
      occurredAt: ts,
    },
    skipRemoteAuditPersist,
  )
  completeWorkSessionAfterFormApproved(form.sessionId, reviewerActorId)
  return next
}

export const rejectServiceFormRevision = (
  role: StarcareRole,
  reviewerActorId: string,
  form: ServiceFormRecord,
  reviewNote: string,
  skipRemoteAuditPersist = false,
): ServiceFormRecord => {
  if (!hasPermission(role, 'action:approve-form')) throw new Error('無審批權限')
  if (!canApproveForm(role, reviewerActorId, form.ownerActorId)) throw new Error('不可審批本人表單')
  if (form.status !== 'SUBMITTED') throw new Error('僅「已提交」表單可退回')
  const note = reviewNote.trim()
  if (!note) throw new Error('退回時請填審核意見')
  const ts = nowIso()
  const next: ServiceFormRecord = {
    ...form,
    status: 'REJECTED_NEEDS_REVISION',
    updatedAt: ts,
    reviewedAt: ts,
    reviewerActorId,
    reviewNote: note,
  }
  upsertServiceForm(next)
  globalAuditTrailService.record(
    {
      action: 'FORM_REJECT_REVISION',
      entityType: 'Scheduling',
      entityId: form.id,
      actorId: reviewerActorId,
      beforeState: JSON.stringify({ status: 'SUBMITTED' }),
      afterState: JSON.stringify({ status: 'REJECTED_NEEDS_REVISION', reviewNote: note }),
      detail: '退回服務表單待重改',
      occurredAt: ts,
    },
    skipRemoteAuditPersist,
  )
  return next
}
