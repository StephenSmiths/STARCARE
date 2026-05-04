/**
 * 01 §5：服務表單軟刪除（非 APPROVED）；Staff 僅能刪本人，TeamLead／Admin 可刪非核准列。
 * 先呼叫 Edge，再自本機移除並寫審計（PDF 02【5】／Seq 10）。
 */
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { removeServiceFormById } from '../../../services/serviceFormStorage'
import { createServiceFormRepository } from '../../../repositories/serviceFormRepository'
import type { ServiceFormRecord } from '../types/serviceForm'
import type { StarcareRole } from '../../auth/permissions'

export const assertServiceFormSoftDeletable = (
  role: StarcareRole,
  actorId: string,
  form: ServiceFormRecord,
): void => {
  if (form.status === 'APPROVED') throw new Error('已核准表單不可軟刪除')
  if (role === 'Staff' && form.ownerActorId !== actorId) {
    throw new Error('僅可軟刪除本人為填表人之表單')
  }
}

export const softDeleteServiceForm = async (
  role: StarcareRole,
  actorId: string,
  form: ServiceFormRecord,
  skipRemoteAuditPersist = false,
): Promise<void> => {
  assertServiceFormSoftDeletable(role, actorId, form)
  const repo = createServiceFormRepository()
  await repo.softDeleteForm(form.id)
  removeServiceFormById(form.id)
  const ts = new Date().toISOString()
  globalAuditTrailService.record(
    {
      action: 'FORM_SOFT_DELETE',
      entityType: 'Scheduling',
      entityId: form.id,
      actorId,
      beforeState: JSON.stringify({ status: form.status, sessionId: form.sessionId }),
      afterState: null,
      detail: '軟刪除服務表單（本機＋DB is_deleted）',
      occurredAt: ts,
    },
    skipRemoteAuditPersist,
  )
}
