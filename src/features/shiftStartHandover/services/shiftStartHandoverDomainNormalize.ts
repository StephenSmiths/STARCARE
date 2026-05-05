import type { ShiftStartHandoverFields } from '../types/shiftStartHandover'

/** 提交／草稿落庫前欄位 trim（對齊 PDF 02【5b】）。 */
export const trimShiftStartHandoverFields = (f: ShiftStartHandoverFields): ShiftStartHandoverFields => ({
  representativeNote: f.representativeNote.trim(),
  departmentOverview: f.departmentOverview.trim(),
  facilityInfoAcknowledgement: f.facilityInfoAcknowledgement.trim(),
  precautionsAcknowledgement: f.precautionsAcknowledgement.trim(),
  signatureName: f.signatureName.trim(),
})
