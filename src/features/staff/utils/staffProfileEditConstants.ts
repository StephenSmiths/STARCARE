import type { StaffServiceScope } from '../services/staffManagementService'

/** 員工主檔編輯：職類選項（對齊 staff_profiles.role_type） */
export const STAFF_PROFILE_ROLE_OPTIONS = ['PT', 'OT', 'PTA', 'OTA', 'TeamLead'] as const

export type StaffProfileRoleTypeOption = (typeof STAFF_PROFILE_ROLE_OPTIONS)[number]

/** 服務範圍選項 */
export const STAFF_PROFILE_SCOPE_OPTIONS: StaffServiceScope[] = ['Subsidized_Rehab', 'Dementia_Care', 'Both']
