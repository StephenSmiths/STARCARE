/** 與 Edge `scheduling-policy-*` 回應對齊之最小型別（前端 P1 合併用） */

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
  subsidizedPassOrder: Array<{ sortOrder: number; fundingTier: string }>
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
