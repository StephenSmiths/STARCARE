import type { SchedulingSession } from '../../../services/schedulingService'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { upsertServiceForm } from '../../../services/serviceFormStorage'
import type { ServiceFormRecord } from '../types/serviceForm'
import {
  assertSessionAcceptedForSubmit,
  assertStaffOwnsSession,
} from './serviceFormDomainGuards'
import { serviceFormMutationTimestampIso } from './serviceFormDomainMutationTimestamp'

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
  const ts = serviceFormMutationTimestampIso()
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
