import type { EndShiftHandoverFields } from '../types/endShiftHandover'

/** 提交／草稿落庫前欄位 trim（對齊 PDF 02【6】文字欄語意）。 */
export const trimEndShiftHandoverFields = (f: EndShiftHandoverFields): EndShiftHandoverFields => ({
  dataOverview: f.dataOverview.trim(),
  followUps: f.followUps.trim(),
  newItems: f.newItems.trim(),
  reminders: f.reminders.trim(),
  reportSummary: f.reportSummary.trim(),
  signatureName: f.signatureName.trim(),
})
