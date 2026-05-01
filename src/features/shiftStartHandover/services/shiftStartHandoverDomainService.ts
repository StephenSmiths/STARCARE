import { globalAuditTrailService } from '../../../services/auditTrailService'
import {
  loadShiftStartHandovers,
  upsertShiftStartHandoverRow,
} from '../../../services/shiftStartHandoverStorage'
import type { ShiftStartHandoverFields, ShiftStartHandoverRecord } from '../types/shiftStartHandover'

const trimFields = (f: ShiftStartHandoverFields): ShiftStartHandoverFields => ({
  representativeNote: f.representativeNote.trim(),
  departmentOverview: f.departmentOverview.trim(),
  facilityInfoAcknowledgement: f.facilityInfoAcknowledgement.trim(),
  precautionsAcknowledgement: f.precautionsAcknowledgement.trim(),
  signatureName: f.signatureName.trim(),
})

/** PDF 02【5b】儲存草稿（六步欄位可分段填寫） */
export const upsertShiftStartHandoverDraft = (
  actorId: string,
  shiftDate: string,
  fields: ShiftStartHandoverFields,
  editingId: string | null,
): ShiftStartHandoverRecord => {
  const t = trimFields(fields)
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
  globalAuditTrailService.record({
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

/** 【5b】提交：六步內容＋簽名須完整（歷史步為查閱，不要求另欄） */
export const submitShiftStartHandover = (actorId: string, record: ShiftStartHandoverRecord): void => {
  if (record.actorId !== actorId) throw new Error('無權提交他人接更紀錄')
  if (record.status !== 'DRAFT') throw new Error('僅草稿可提交')
  const t = trimFields(record)
  const required: Array<[keyof ShiftStartHandoverFields, string]> = [
    ['representativeNote', '請填寫代表／承諾事項'],
    ['departmentOverview', '請填寫部門概覽'],
    ['facilityInfoAcknowledgement', '請填寫院舍資訊確認'],
    ['precautionsAcknowledgement', '請填寫注意事項確認'],
    ['signatureName', '請簽名（姓名）'],
  ]
  for (const [key, msg] of required) {
    if (!t[key]) throw new Error(msg)
  }
  const now = new Date().toISOString()
  const next: ShiftStartHandoverRecord = {
    ...record,
    ...t,
    status: 'SUBMITTED',
    updatedAt: now,
    submittedAt: now,
  }
  upsertShiftStartHandoverRow(next)
  globalAuditTrailService.record({
    action: 'SHIFT_START_HANDOVER_SUBMIT',
    entityType: 'Reporting',
    entityId: record.id,
    actorId,
    beforeState: JSON.stringify(record),
    afterState: JSON.stringify(next),
    detail: `開工接更已提交 shiftDate=${record.shiftDate}`,
    occurredAt: now,
  })
}

export const listSubmittedHistoryForActor = (actorId: string): ShiftStartHandoverRecord[] =>
  loadShiftStartHandovers()
    .filter((r) => r.actorId === actorId && r.status === 'SUBMITTED')
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))
