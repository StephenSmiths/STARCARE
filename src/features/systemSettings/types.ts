import type {
  PolicyFixedActivityRow,
  PolicySubsidizedPassOrderRow,
  PolicySubsidizedRoleOfferingRow,
  PolicySubsidizedTierRow,
} from '../../repositories/schedulingPolicyTypes'

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
  /** P2：雲端政策 `facility_policy_fixed_activities` 多筆草稿（與 Edge bundle 對齊） */
  policyFixedActivities: PolicyFixedActivityRow[]
  /** 曾自 `scheduling-policy-current-get` 併入固定活動列後為 true；舊本機資料未帶此鍵時，提交合併仍以雲端既有列為準 */
  policyFixedActivitiesHydrated?: boolean
  /** P2：雲端 `facility_policy_subsidized_pass_order`（Pass 1–3；與 Edge bundle 對齊） */
  policySubsidizedPassOrder: PolicySubsidizedPassOrderRow[]
  /** 曾自 `scheduling-policy-current-get` 併入 Pass 次序後為 true；未帶此鍵時合併仍以雲端／預設為準 */
  policySubsidizedPassOrderHydrated?: boolean
  /** P2：雲端 `facility_policy_subsidized_tier`（甲一／院舍券／私位各一列） */
  policySubsidizedTiers: PolicySubsidizedTierRow[]
  /** 曾自雲端併入資助三列後為 true；未帶此鍵時合併仍以雲端既有列為準 */
  policySubsidizedTiersHydrated?: boolean
  /** P2：雲端 `facility_policy_subsidized_role_offerings`（資助 × 職類 × 節長；完整 48 格） */
  policySubsidizedRoleOfferings: PolicySubsidizedRoleOfferingRow[]
  /** 曾自雲端併入職類矩陣後為 true；未帶此鍵時合併仍以雲端既有列為準 */
  policySubsidizedRoleOfferingsHydrated?: boolean
}
