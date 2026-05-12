/** PDF 02【16】／契約 `docs/scheduling-policy-edge-function-contract.md`：Bundle 與列舉（camelCase 對外） */

export const SLOT_KINDS = new Set([
  'LUNCH',
  'MORNING_DOC',
  'AFTERNOON_DOC',
  'OTHER',
  'SHIFT_PREP_BLOCK',
])

export const FUNDING_TIERS = new Set(['GradeA_Subsidized', 'Voucher', 'Private'])

export const SERVICE_TYPES = new Set(['Subsidized_Rehab', 'Dementia_Care'])

export const DELIVERY_MODES = new Set(['Individual', 'Group'])

export const ROLE_TYPES_SUB = new Set(['PT', 'PTA', 'OT', 'OTA'])

export const ROLE_TYPES_DEM = new Set(['OT', 'OTA'])

export const SLOT_VARIANTS = new Set(['IND_15', 'IND_30', 'GRP_30', 'GRP_60'])

export type PolicyVersionCamel = {
  id: string
  effectiveFrom: string
  effectiveUntil: string | null
  status: 'scheduled' | 'active' | 'superseded'
  changeSummary: string
  createdAt: string
}

export type SchedulingPolicyBundle = {
  facilityId: string
  policyVersion: PolicyVersionCamel | null
  nonTherapySlots: Array<{ slotKind: string; timeStart: string; timeEnd: string }>
  numericLimits: {
    therapistGroupSessionsDailyCap: number
    assistantGroupSessionsDailyCap: number
    groupParticipantCap: number
  }
  fixedActivities: Array<{
    serviceType: string
    timeStart: string
    timeEnd: string
    deliveryMode: string
    activityName: string
    rolePt: boolean
    rolePta: boolean
    roleOt: boolean
    roleOta: boolean
  }>
  subsidizedTiers: Array<{
    fundingTier: string
    enabled: boolean
    weeklyMinSessions: number
    specialCareTherapistOnly: boolean
  }>
  subsidizedRoleOfferings: Array<{
    fundingTier: string
    roleType: string
    slotVariant: string
    enabled: boolean
  }>
  subsidizedPassOrder: Array<{ sortOrder: number; fundingTier: string }>
  dementiaCore: {
    enabled: boolean
    weeklyMinSessions: number
    specialCareTherapistOnly: boolean
  } | null
  dementiaRoleOfferings: Array<{ roleType: string; slotVariant: string; enabled: boolean }>
  legacySchedulingRules: Record<string, unknown> | null
}
