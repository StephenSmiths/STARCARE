/**
 * PDF 02【16】Seq 29：系統設定快照（排班視窗、非治療時段、啟用開關與 SC 規則占位）。
 * 數值皆為字串 HH:mm，供 UI 與本地 JSON 序列化一致。
 */
export interface SystemSettingsSnapshot {
  schedulingWindowStart: string
  schedulingWindowEnd: string
  nonTherapyWindowStart: string
  nonTherapyWindowEnd: string
  rulesEngineEnabled: boolean
  fixedActivitiesEnabled: boolean
  serviceTypesEnabled: boolean
  /** SpecialCare：是否僅允許治療師（占位，待與排班引擎對齊） */
  specialCareTherapistOnly: boolean
}
