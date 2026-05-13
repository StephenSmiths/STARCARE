/** 與 Edge `scheduling-policy-*` 回應對齊之最小型別（前端 P1 合併用） */

/** 資助列（與 Edge `FUNDING_TIERS`、院友 `funding_type` 對齊） */
export const POLICY_SUBSIDIZED_FUNDING_TIERS = ['GradeA_Subsidized', 'Voucher', 'Private'] as const
export type PolicySubsidizedFundingTier = (typeof POLICY_SUBSIDIZED_FUNDING_TIERS)[number]

/** PDF 02【16】／`facility_policy_subsidized_pass_order`（P2：Pass 1–3 次序） */
export type PolicySubsidizedPassOrderRow = {
  sortOrder: number
  fundingTier: PolicySubsidizedFundingTier
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
  subsidizedTiers: unknown[]
  subsidizedRoleOfferings: unknown[]
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
