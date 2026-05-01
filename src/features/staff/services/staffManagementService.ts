import { globalAuditTrailService } from '../../../services/auditTrailService'
import { createStaffProfileRepository } from '../../../repositories/staffProfileRepository'
import { createStaffSkillsRepository } from '../../../repositories/staffSkillsRepository'
import { schedulingConfigService } from '../../../services/schedulingConfigService'

export interface StaffOverviewRow {
  staffId: string
  staffName: string
  sessionCount: number
  skillCount: number
}

const staffSkillsRepository = createStaffSkillsRepository()
const staffProfileRepository = createStaffProfileRepository()

export class StaffManagementService {
  async listStaffOverview(facilityId = 'facility-main'): Promise<StaffOverviewRow[]> {
    const [sessions, skills] = await Promise.all([
      schedulingConfigService.listSchedulingSessions(facilityId),
      staffSkillsRepository.listStaffSkills(facilityId),
    ])
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
    const ids = new Set([...sessionCountMap.keys(), ...skillCountMap.keys()])
    return Array.from(ids)
      .map((staffId) => ({
        staffId,
        staffName: staffNameMap.get(staffId) ?? '(未命名員工)',
        sessionCount: sessionCountMap.get(staffId) ?? 0,
        skillCount: skillCountMap.get(staffId)?.size ?? 0,
      }))
      .sort((a, b) => a.staffId.localeCompare(b.staffId))
  }

  async softDeleteStaff(actorId: string, staffId: string): Promise<void> {
    await staffProfileRepository.softDeleteStaffProfile(staffId)
    globalAuditTrailService.record({
      action: 'SOFT_DELETE',
      entityType: 'Staff',
      entityId: staffId,
      actorId,
      beforeState: JSON.stringify({ staffId, isDeleted: false }),
      afterState: JSON.stringify({ staffId, isDeleted: true }),
      detail: '軟刪除員工資料',
      occurredAt: new Date().toISOString(),
    })
  }
}

export const staffManagementService = new StaffManagementService()
