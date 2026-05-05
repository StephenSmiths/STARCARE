import type { SchedulingSession } from '../../../services/schedulingService'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { loadServiceForms, upsertServiceForm } from '../../../services/serviceFormStorage'
import type { ServiceFormRecord, ServiceFormStatus } from '../types/serviceForm'
import { assertFormEditable, assertStaffOwnsSession } from './serviceFormDomainGuards'
import { serviceFormMutationTimestampIso } from './serviceFormDomainMutationTimestamp'

/** Seq 17：同步 `record`；Supabase hydration 見 `hooks/serviceFormWorkspaceEdgeUpsert`。 */
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
  const ts = serviceFormMutationTimestampIso()
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
