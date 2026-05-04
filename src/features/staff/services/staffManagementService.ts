import { hydrateAuditTrailAfterLocalRecord } from '../../../services/auditTrailHydrationService'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { createStaffProfileRepository } from '../../../repositories/staffProfileRepository'
import {
  createStaffProfilesListRepository,
  type StaffProfileListRow,
} from '../../../repositories/staffProfilesListRepository'
import {
  createStaffProfileUpdateRepository,
  type StaffProfileUpdatePayload,
} from '../../../repositories/staffProfileUpdateRepository'
import { createStaffSkillsRepository } from '../../../repositories/staffSkillsRepository'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { isSupabaseBrowserConfigured } from '../../../services/supabaseBrowserEnv'

export type StaffServiceScope = 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'

export interface StaffOverviewRow {
  staffId: string
  staffName: string
  /** 有值時儀表盤 PT/OT 以 DB 權威為準（PDF 02【1】） */
  roleType?: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  /** staff_profiles.service_scope；單筆編輯用 */
  serviceScope?: StaffServiceScope
  sessionCount: number
  skillCount: number
}

const staffSkillsRepository = createStaffSkillsRepository()
const staffProfileRepository = createStaffProfileRepository()
const staffProfilesListRepository = createStaffProfilesListRepository()
const staffProfileUpdateRepository = createStaffProfileUpdateRepository()

export class StaffManagementService {
  async listStaffOverview(facilityId = 'facility-main'): Promise<StaffOverviewRow[]> {
    const profileRows = await staffProfilesListRepository.listStaffProfiles(facilityId).catch(() => [] as StaffProfileListRow[])
    const profileById = new Map(profileRows.map((p) => [p.id, p]))

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
    const ids = new Set([...sessionCountMap.keys(), ...skillCountMap.keys(), ...profileById.keys()])
    return Array.from(ids)
      .map((staffId) => {
        const prof = profileById.get(staffId)
        return {
          staffId,
          staffName: prof?.displayName ?? staffNameMap.get(staffId) ?? '(未命名員工)',
          roleType: prof?.roleType,
          serviceScope: prof?.serviceScope,
          sessionCount: sessionCountMap.get(staffId) ?? 0,
          skillCount: skillCountMap.get(staffId)?.size ?? 0,
        }
      })
      .sort((a, b) => a.staffId.localeCompare(b.staffId))
  }

  /** PDF 02【13】單筆主檔更新（TeamLead／Admin；Edge `staff-profile-update`） */
  async updateStaffProfile(
    actorId: string,
    input: Omit<StaffProfileUpdatePayload, 'actorId'>,
    auditBefore: Pick<StaffOverviewRow, 'staffName' | 'roleType' | 'serviceScope'>,
  ): Promise<void> {
    await staffProfileUpdateRepository.updateStaffProfile({ ...input, actorId })
    globalAuditTrailService.record(
      {
        action: 'UPDATE',
        entityType: 'Staff',
        entityId: input.staffId,
        actorId,
        beforeState: JSON.stringify(auditBefore),
        afterState: JSON.stringify({
          staffName: input.displayName,
          roleType: input.roleType,
          serviceScope: input.serviceScope,
        }),
        detail: '更新員工主檔（display_name／role_type／service_scope）',
        occurredAt: new Date().toISOString(),
      },
      isSupabaseBrowserConfigured(),
    )
    hydrateAuditTrailAfterLocalRecord()
  }

  async softDeleteStaff(actorId: string, staffId: string): Promise<void> {
    await staffProfileRepository.softDeleteStaffProfile(staffId)
    globalAuditTrailService.record(
      {
        action: 'SOFT_DELETE',
        entityType: 'Staff',
        entityId: staffId,
        actorId,
        beforeState: JSON.stringify({ staffId, isDeleted: false }),
        afterState: JSON.stringify({ staffId, isDeleted: true }),
        detail: '軟刪除員工資料',
        occurredAt: new Date().toISOString(),
      },
      isSupabaseBrowserConfigured(),
    )
    hydrateAuditTrailAfterLocalRecord()
  }
}

export const staffManagementService = new StaffManagementService()
