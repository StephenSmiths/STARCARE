import type { StaffOverviewRow } from '../../staff/services/staffManagementService'

/** PDF 02【1】：僅以 DB `role_type` 分類；TeamLead 與未填職類歸「其他」（不依顯示名推斷） */
export const rehabDisciplineFamilyFromStaff = (row: StaffOverviewRow): 'PT' | 'OT' | 'Other' => {
  const t = row.roleType
  if (t === 'PT' || t === 'PTA') return 'PT'
  if (t === 'OT' || t === 'OTA') return 'OT'
  return 'Other'
}
