import { globalAuditTrailService } from '../../../services/auditTrailService'
import { upsertServiceForm } from '../../../services/serviceFormStorage'
import { completeWorkSessionAfterFormApproved } from '../../workSessions/domain/workSessionCompletionService'
import type { StarcareRole } from '../../auth/permissions'
import { canApproveForm, hasPermission } from '../../auth/permissions'
import type { ServiceFormRecord } from '../types/serviceForm'
import { serviceFormMutationTimestampIso } from './serviceFormDomainMutationTimestamp'

export const approveServiceForm = (
  role: StarcareRole,
  reviewerActorId: string,
  form: ServiceFormRecord,
  skipRemoteAuditPersist = false,
): ServiceFormRecord => {
  if (!hasPermission(role, 'action:approve-form')) throw new Error('無審批權限')
  if (!canApproveForm(role, reviewerActorId, form.ownerActorId)) throw new Error('不可審批本人表單')
  if (form.status !== 'SUBMITTED') throw new Error('僅「已提交」表單可核准')
  const ts = serviceFormMutationTimestampIso()
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
  completeWorkSessionAfterFormApproved(form.sessionId, reviewerActorId, skipRemoteAuditPersist)
  return next
}
