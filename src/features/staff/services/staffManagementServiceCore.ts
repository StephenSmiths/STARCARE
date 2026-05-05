import type { StaffProfileListRow } from '../../../repositories/staffProfilesListRepository'
import type { StaffProfileUpdatePayload } from '../../../repositories/staffProfileUpdateRepository'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { recordStaffProfileUpdateAudit, recordStaffSoftDeleteAudit } from './staffManagementAuditTrail'
import { mergeStaffOverviewRows } from './staffManagementOverviewMerge'
import {
  staffProfileRepository,
  staffProfileUpdateRepository,
  staffProfilesListRepository,
  staffSkillsRepository,
} from './staffManagementServiceRepositories'
import { STAFF_WORKSPACE_FACILITY_ID } from '../constants/staffWorkspaceDefaults'
import type { StaffOverviewRow } from './staffManagementTypes'

export class StaffManagementService {
  async listStaffOverview(facilityId: string = STAFF_WORKSPACE_FACILITY_ID): Promise<StaffOverviewRow[]> {
    const profileRows = await staffProfilesListRepository.listStaffProfiles(facilityId).catch(() => [] as StaffProfileListRow[])
    const [sessions, skills] = await Promise.all([
      schedulingConfigService.listSchedulingSessions(facilityId),
      staffSkillsRepository.listStaffSkills(facilityId),
    ])
    return mergeStaffOverviewRows(profileRows, sessions, skills)
  }

  /** PDF 02【13】單筆主檔更新（TeamLead／Admin；Edge `staff-profile-update`） */
  async updateStaffProfile(
    actorId: string,
    input: Omit<StaffProfileUpdatePayload, 'actorId'>,
    auditBefore: Pick<StaffOverviewRow, 'staffName' | 'roleType' | 'serviceScope'>,
  ): Promise<void> {
    await staffProfileUpdateRepository.updateStaffProfile({ ...input, actorId })
    recordStaffProfileUpdateAudit(actorId, input, auditBefore)
  }

  async softDeleteStaff(actorId: string, staffId: string): Promise<void> {
    await staffProfileRepository.softDeleteStaffProfile(staffId)
    recordStaffSoftDeleteAudit(actorId, staffId)
  }
}
