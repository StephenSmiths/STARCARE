/**
 * PDF 02【5b】開工接更：代表、部門概覽、院舍資訊、注意事項、歷史查閱、簽名確認（六步 SOP）。
 * 01 §5：正式環境應持久化至 DB 並軟刪除；現階段 localStorage 對齊 Seq 17 表單策略。
 */

export type ShiftStartHandoverStatus = 'DRAFT' | 'SUBMITTED'

/** 五步填寫欄位＋簽名（對應 SOP；「歷史」為唯讀列表，非單筆欄位） */
export interface ShiftStartHandoverFields {
  representativeNote: string
  departmentOverview: string
  facilityInfoAcknowledgement: string
  precautionsAcknowledgement: string
  signatureName: string
}

export interface ShiftStartHandoverRecord extends ShiftStartHandoverFields {
  id: string
  actorId: string
  /** 接班／開工日期 YYYY-MM-DD */
  shiftDate: string
  status: ShiftStartHandoverStatus
  createdAt: string
  updatedAt: string
  submittedAt: string | null
}
