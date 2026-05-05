import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import {
  loadEndShiftHandovers,
  upsertEndShiftHandoverRow,
} from '../../../services/endShiftHandoverStorage'
import type { EndShiftHandoverFields, EndShiftHandoverRecord } from '../types/endShiftHandover'
import { trimEndShiftHandoverFields } from './endShiftHandoverDomainNormalize'

/** PDF 02【6】草稿（可分項儲存） */
export const upsertEndShiftHandoverDraft = (
  actorId: string,
  shiftDate: string,
  fields: EndShiftHandoverFields,
  editingId: string | null,
): EndShiftHandoverRecord => {
  const t = trimEndShiftHandoverFields(fields)
  const now = new Date().toISOString()
  const all = loadEndShiftHandovers()
  const id = editingId ?? crypto.randomUUID()
  const existing = all.find((r) => r.id === id)
  if (existing?.status === 'SUBMITTED') throw new Error('已提交之交更紀錄不可再修改')
  const row: EndShiftHandoverRecord = {
    id,
    actorId,
    shiftDate,
    ...t,
    status: 'DRAFT',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    submittedAt: null,
  }
  upsertEndShiftHandoverRow(row)
  recordAuditTrailThenHydrate({
    action: 'SHIFT_END_HANDOVER_DRAFT_UPSERT',
    entityType: 'Reporting',
    entityId: id,
    actorId,
    beforeState: existing ? JSON.stringify(existing) : null,
    afterState: JSON.stringify(row),
    detail: `收工交更草稿 shiftDate=${shiftDate}`,
    occurredAt: now,
  })
  return row
}
