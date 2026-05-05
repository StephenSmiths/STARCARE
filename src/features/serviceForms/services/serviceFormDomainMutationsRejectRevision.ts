import { globalAuditTrailService } from '../../../services/auditTrailService'
import { upsertServiceForm } from '../../../services/serviceFormStorage'
import type { StarcareRole } from '../../auth/permissions'
import { canApproveForm, hasPermission } from '../../auth/permissions'
import type { ServiceFormRecord } from '../types/serviceForm'
import { serviceFormMutationTimestampIso } from './serviceFormDomainMutationTimestamp'

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
  const ts = serviceFormMutationTimestampIso()
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
