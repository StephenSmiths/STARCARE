/**
 * PDF 02【6】收工交更：數據概覽、跟進、新增事項、提醒、報告、簽名。
 * 01 §5：正式版應改 DB `is_deleted`；現階段 localStorage 對齊 Seq 17／18。
 */

export type EndShiftHandoverStatus = 'DRAFT' | 'SUBMITTED'

export interface EndShiftHandoverFields {
  dataOverview: string
  followUps: string
  newItems: string
  reminders: string
  reportSummary: string
  signatureName: string
}

export interface EndShiftHandoverRecord extends EndShiftHandoverFields {
  id: string
  actorId: string
  /** 收工／交班日期 YYYY-MM-DD */
  shiftDate: string
  status: EndShiftHandoverStatus
  createdAt: string
  updatedAt: string
  submittedAt: string | null
}
