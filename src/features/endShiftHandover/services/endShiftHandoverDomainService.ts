import { globalAuditTrailService } from '../../../services/auditTrailService'
import {
  loadEndShiftHandovers,
  upsertEndShiftHandoverRow,
} from '../../../services/endShiftHandoverStorage'
import type { EndShiftHandoverFields, EndShiftHandoverRecord } from '../types/endShiftHandover'

const trimFields = (f: EndShiftHandoverFields): EndShiftHandoverFields => ({
  dataOverview: f.dataOverview.trim(),
  followUps: f.followUps.trim(),
  newItems: f.newItems.trim(),
  reminders: f.reminders.trim(),
  reportSummary: f.reportSummary.trim(),
  signatureName: f.signatureName.trim(),
})

/** PDF 02【6】草稿（可分項儲存） */
export const upsertEndShiftHandoverDraft = (
  actorId: string,
  shiftDate: string,
  fields: EndShiftHandoverFields,
  editingId: string | null,
): EndShiftHandoverRecord => {
  const t = trimFields(fields)
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
  globalAuditTrailService.record({
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

/** 【6】提交：五欄摘要＋簽名須完整 */
export const submitEndShiftHandover = (actorId: string, record: EndShiftHandoverRecord): void => {
  if (record.actorId !== actorId) throw new Error('無權提交他人交更紀錄')
  if (record.status !== 'DRAFT') throw new Error('僅草稿可提交')
  const t = trimFields(record)
  const required: Array<[keyof EndShiftHandoverFields, string]> = [
    ['dataOverview', '請填寫數據概覽'],
    ['followUps', '請填寫跟進事項'],
    ['newItems', '請填寫新增事項'],
    ['reminders', '請填寫提醒'],
    ['reportSummary', '請填寫報告摘要'],
    ['signatureName', '請簽名（姓名）'],
  ]
  for (const [key, msg] of required) {
    if (!t[key]) throw new Error(msg)
  }
  const now = new Date().toISOString()
  const next: EndShiftHandoverRecord = {
    ...record,
    ...t,
    status: 'SUBMITTED',
    updatedAt: now,
    submittedAt: now,
  }
  upsertEndShiftHandoverRow(next)
  globalAuditTrailService.record({
    action: 'SHIFT_END_HANDOVER_SUBMIT',
    entityType: 'Reporting',
    entityId: record.id,
    actorId,
    beforeState: JSON.stringify(record),
    afterState: JSON.stringify(next),
    detail: `收工交更已提交 shiftDate=${record.shiftDate}`,
    occurredAt: now,
  })
}

export const listSubmittedEndHistoryForActor = (actorId: string): EndShiftHandoverRecord[] =>
  loadEndShiftHandovers()
    .filter((r) => r.actorId === actorId && r.status === 'SUBMITTED')
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))
