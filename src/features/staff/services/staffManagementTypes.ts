export type StaffServiceScope = 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'

export interface StaffOverviewRow {
  staffId: string
  staffName: string
  /** 有值時儀表盤 PT/OT 以 DB 權威為準（PDF 02【1】） */
  roleType?: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  /** staff_profiles.service_scope；單筆編輯用 */
  serviceScope?: StaffServiceScope
  sessionCount: number
  skillCount: number
}
