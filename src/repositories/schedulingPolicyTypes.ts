/** 與 Edge `scheduling-policy-*` 回應對齊之最小型別（前端 P1 合併用） */

/** 資助列（與 Edge `FUNDING_TIERS`、院友 `funding_type` 對齊） */
export const POLICY_SUBSIDIZED_FUNDING_TIERS = ['GradeA_Subsidized', 'Voucher', 'Private'] as const
export type PolicySubsidizedFundingTier = (typeof POLICY_SUBSIDIZED_FUNDING_TIERS)[number]

/** PDF 02【16】／`facility_policy_subsidized_pass_order`（P2：Pass 1–3 次序） */
export type PolicySubsidizedPassOrderRow = {
  sortOrder: number
  fundingTier: PolicySubsidizedFundingTier
}

/** PDF 02【16】／`facility_policy_subsidized_tier`（P2：甲一／院舍券／私位列） */
export type PolicySubsidizedTierRow = {
  fundingTier: PolicySubsidizedFundingTier
  enabled: boolean
  weeklyMinSessions: number
  specialCareTherapistOnly: boolean
}

/** 資助復康職類（與 Edge `ROLE_TYPES_SUB` 對齊） */
export const POLICY_SUBSIDIZED_ROLE_TYPES = ['PT', 'PTA', 'OT', 'OTA'] as const
export type PolicySubsidizedRoleType = (typeof POLICY_SUBSIDIZED_ROLE_TYPES)[number]

/** 節長變體（與 Edge `SLOT_VARIANTS` 對齊） */
export const POLICY_SLOT_VARIANTS = ['IND_15', 'IND_30', 'GRP_30', 'GRP_60'] as const
export type PolicySlotVariant = (typeof POLICY_SLOT_VARIANTS)[number]

/** PDF 02【16】／`facility_policy_subsidized_role_offerings`（P2：資助 × 職類 × 節長） */
export type PolicySubsidizedRoleOfferingRow = {
  fundingTier: PolicySubsidizedFundingTier
  roleType: PolicySubsidizedRoleType
  slotVariant: PolicySlotVariant
  enabled: boolean
}

/** PDF 02【16】／`facility_policy_fixed_activities`（P2 固定活動多筆） */
export type PolicyFixedActivityRow = {
  serviceType: string
  timeStart: string
  timeEnd: string
  deliveryMode: string
  activityName: string
  rolePt: boolean
  rolePta: boolean
  roleOt: boolean
  roleOta: boolean
}

export type SchedulingPolicyVersionSummary = {
  id: string
  effectiveFrom: string
  effectiveUntil: string | null
  status: string
  changeSummary: string
  createdAt: string
}

export type SchedulingPolicyBundle = {
  facilityId: string
  policyVersion: SchedulingPolicyVersionSummary | null
  nonTherapySlots: Array<{ slotKind: string; timeStart: string; timeEnd: string }>
  numericLimits: {
    therapistGroupSessionsDailyCap: number
    assistantGroupSessionsDailyCap: number
    groupParticipantCap: number
  }
  fixedActivities: PolicyFixedActivityRow[]
  subsidizedTiers: PolicySubsidizedTierRow[]
  subsidizedRoleOfferings: PolicySubsidizedRoleOfferingRow[]
  subsidizedPassOrder: PolicySubsidizedPassOrderRow[]
  dementiaCore: unknown | null
  dementiaRoleOfferings: unknown[]
  legacySchedulingRules: unknown | null
}

export type PolicyValidateError = { code: string; message: string }

export type PolicyValidateResponse =
  | { ok: true; errors: []; normalized: SchedulingPolicyBundle }
  | { ok: false; errors: PolicyValidateError[] }

export type PolicyCommitResponse =
  | { ok: true; policyVersionId: string }
  | { ok: false; errors?: PolicyValidateError[]; error?: string; policyVersionId?: string }
