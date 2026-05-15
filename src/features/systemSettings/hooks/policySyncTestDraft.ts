import { DEFAULT_POLICY_DEMENTIA_CORE } from '../domain/policyDementiaDraft'
import type { SystemSettingsSnapshot } from '../types'

/** Vitest：`useSystemSettingsPolicySync` 可通過 `validateSystemSettings` 之最小草稿 */
export const POLICY_SYNC_VALID_DRAFT: SystemSettingsSnapshot = {
  schedulingWindowStart: '08:00',
  schedulingWindowEnd: '18:00',
  nonTherapyWindowStart: '12:00',
  nonTherapyWindowEnd: '13:00',
  shiftPrepBlockEnabled: false,
  therapistGroupSessionsDailyCap: 4,
  assistantGroupSessionsDailyCap: 4,
  groupParticipantCap: 6,
  rulesEngineEnabled: false,
  fixedActivitiesEnabled: false,
  serviceTypesEnabled: false,
  specialCareTherapistOnly: false,
  schedulingDetailPresetParam1: false,
  schedulingDetailPresetParam2: false,
  schedulingDetailPresetParam3: false,
  policyFixedActivities: [],
  policySubsidizedPassOrder: [],
  policySubsidizedTiers: [],
  policySubsidizedRoleOfferings: [],
  policyDementiaCore: { ...DEFAULT_POLICY_DEMENTIA_CORE },
  policyDementiaRoleOfferings: [],
}
