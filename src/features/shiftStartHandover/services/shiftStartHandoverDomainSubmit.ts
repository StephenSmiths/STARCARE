import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import { upsertShiftStartHandoverRow } from '../../../services/shiftStartHandoverStorage'
import type { ShiftStartHandoverFields, ShiftStartHandoverRecord } from '../types/shiftStartHandover'
import { trimShiftStartHandoverFields } from './shiftStartHandoverDomainNormalize'

const REQUIRED_FIELDS: Array<[keyof ShiftStartHandoverFields, string]> = [
  ['representativeNote', '請填寫代表／承諾事項'],
  ['departmentOverview', '請填寫部門概覽'],
  ['facilityInfoAcknowledgement', '請填寫院舍資訊確認'],
  ['precautionsAcknowledgement', '請填寫注意事項確認'],
  ['signatureName', '請簽名（姓名）'],
]

/** 【5b】提交：六步內容＋簽名須完整（歷史步為查閱，不要求另欄） */
export const submitShiftStartHandover = (actorId: string, record: ShiftStartHandoverRecord): void => {
  if (record.actorId !== actorId) throw new Error('無權提交他人接更紀錄')
  if (record.status !== 'DRAFT') throw new Error('僅草稿可提交')
  const t = trimShiftStartHandoverFields(record)
  for (const [key, msg] of REQUIRED_FIELDS) {
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
  recordAuditTrailThenHydrate({
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
