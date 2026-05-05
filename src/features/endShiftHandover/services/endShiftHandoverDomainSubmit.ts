import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import { upsertEndShiftHandoverRow } from '../../../services/endShiftHandoverStorage'
import type { EndShiftHandoverFields, EndShiftHandoverRecord } from '../types/endShiftHandover'
import { trimEndShiftHandoverFields } from './endShiftHandoverDomainNormalize'

const REQUIRED_FIELDS: Array<[keyof EndShiftHandoverFields, string]> = [
  ['dataOverview', '請填寫數據概覽'],
  ['followUps', '請填寫跟進事項'],
  ['newItems', '請填寫新增事項'],
  ['reminders', '請填寫提醒'],
  ['reportSummary', '請填寫報告摘要'],
  ['signatureName', '請簽名（姓名）'],
]

/** 【6】提交：五欄摘要＋簽名須完整 */
export const submitEndShiftHandover = (actorId: string, record: EndShiftHandoverRecord): void => {
  if (record.actorId !== actorId) throw new Error('無權提交他人交更紀錄')
  if (record.status !== 'DRAFT') throw new Error('僅草稿可提交')
  const t = trimEndShiftHandoverFields(record)
  for (const [key, msg] of REQUIRED_FIELDS) {
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
  recordAuditTrailThenHydrate({
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
