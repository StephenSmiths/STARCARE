/**
 * PDF 02【16】Seq 29：系統設定快照（排班視窗、非治療時段、啟用開關與 SC 規則占位）。
 * 數值皆為字串 HH:mm，供 UI 與本地 JSON 序列化一致。
 */
export interface SystemSettingsSnapshot {
  schedulingWindowStart: string
  schedulingWindowEnd: string
  nonTherapyWindowStart: string
  nonTherapyWindowEnd: string
  /** P1：開工準備時段（SHIFT_PREP_BLOCK）是否寫入政策版本 */
  shiftPrepBlockEnabled: boolean
  /** P1：與 Edge `numericLimits` 對齊 */
  therapistGroupSessionsDailyCap: number
  assistantGroupSessionsDailyCap: number
  groupParticipantCap: number
  rulesEngineEnabled: boolean
  fixedActivitiesEnabled: boolean
  serviceTypesEnabled: boolean
  /** SpecialCare：是否僅允許治療師（占位，待與排班引擎對齊） */
  specialCareTherapistOnly: boolean
}
