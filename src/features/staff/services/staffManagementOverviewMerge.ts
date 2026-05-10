import type { StaffProfileListRow } from '../../../repositories/staffProfilesListRepository'
import type { StaffSkill } from '../../../repositories/staffSkillsRepository'
import type { SchedulingSession } from '../../../services/schedulingService'
import type { StaffOverviewRow } from './staffManagementTypes'

/**
 * PDF 02【1】合併主檔／排班時段／技能為員工總覽列（不含 IO）。
 * 列來源僅為未刪主檔；時段／技能僅補計數，避免已軟刪主檔因排班或技能殘留仍顯示（與 soft-delete 404 不同步）。
 */
export const mergeStaffOverviewRows = (
  profileRows: StaffProfileListRow[],
  sessions: SchedulingSession[],
  skills: StaffSkill[],
): StaffOverviewRow[] => {
  const profileById = new Map(profileRows.map((p) => [p.id, p]))
  const sessionCountMap = new Map<string, number>()
  const staffNameMap = new Map<string, string>()
  for (const item of sessions) {
    sessionCountMap.set(item.staffId, (sessionCountMap.get(item.staffId) ?? 0) + 1)
    if (item.staffName.trim()) staffNameMap.set(item.staffId, item.staffName.trim())
  }
  const skillCountMap = new Map<string, Set<string>>()
  for (const item of skills) {
    if (!skillCountMap.has(item.staffProfileId)) skillCountMap.set(item.staffProfileId, new Set())
    skillCountMap.get(item.staffProfileId)?.add(item.activityId)
  }
  const ids = [...profileById.keys()].sort((a, b) => a.localeCompare(b))
  return ids.map((staffId) => {
    const prof = profileById.get(staffId)
    return {
      staffId,
      staffName: prof?.displayName?.trim()
        ? prof.displayName
        : staffNameMap.get(staffId) ?? '(未命名員工)',
      roleType: prof?.roleType,
      serviceScope: prof?.serviceScope,
      sessionCount: sessionCountMap.get(staffId) ?? 0,
      skillCount: skillCountMap.get(staffId)?.size ?? 0,
    }
  })
}
