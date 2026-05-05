import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import {
  loadShiftStartHandovers,
  upsertShiftStartHandoverRow,
} from '../../../services/shiftStartHandoverStorage'
import type { ShiftStartHandoverFields, ShiftStartHandoverRecord } from '../types/shiftStartHandover'
import { trimShiftStartHandoverFields } from './shiftStartHandoverDomainNormalize'

/** PDF 02【5b】儲存草稿（六步欄位可分段填寫） */
export const upsertShiftStartHandoverDraft = (
  actorId: string,
  shiftDate: string,
  fields: ShiftStartHandoverFields,
  editingId: string | null,
): ShiftStartHandoverRecord => {
  const t = trimShiftStartHandoverFields(fields)
  const now = new Date().toISOString()
  const all = loadShiftStartHandovers()
  const id = editingId ?? crypto.randomUUID()
  const existing = all.find((r) => r.id === id)
  if (existing?.status === 'SUBMITTED') {
    throw new Error('已提交之接更紀錄不可再修改')
  }
  const row: ShiftStartHandoverRecord = {
    id,
    actorId,
    shiftDate,
    ...t,
    status: 'DRAFT',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    submittedAt: null,
  }
  upsertShiftStartHandoverRow(row)
  recordAuditTrailThenHydrate({
    action: 'SHIFT_START_HANDOVER_DRAFT_UPSERT',
    entityType: 'Reporting',
    entityId: id,
    actorId,
    beforeState: existing ? JSON.stringify(existing) : null,
    afterState: JSON.stringify(row),
    detail: `開工接更草稿 shiftDate=${shiftDate}`,
    occurredAt: now,
  })
  return row
}
