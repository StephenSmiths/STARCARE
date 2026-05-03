import { createActivityRepository } from '../repositories/activityRepository'
import { createActivitySessionRepository } from '../repositories/activitySessionRepository'
import { createSchedulingRulesRepository, type SchedulingRules } from '../repositories/schedulingRulesRepository'
import { createSchedulingSessionRepository } from '../repositories/schedulingSessionRepository'
import { createStaffSkillsRepository } from '../repositories/staffSkillsRepository'
import {
  createStaffProfilesListRepository,
  type StaffProfileListRow,
} from '../repositories/staffProfilesListRepository'
import type { SchedulingSession } from './schedulingService'

const activityRepository = createActivityRepository()
const activitySessionRepository = createActivitySessionRepository()
const schedulingRulesRepository = createSchedulingRulesRepository()
const staffSkillsRepository = createStaffSkillsRepository()
const staffProfilesListRepository = createStaffProfilesListRepository()
const fallbackSessionRepository = createSchedulingSessionRepository()

const mapServiceType = (serviceType: 'Subsidized_Rehab' | 'Dementia_Care'): 'Subsidized_Rehab' | 'Dementia_Service' =>
  serviceType === 'Dementia_Care' ? 'Dementia_Service' : 'Subsidized_Rehab'

/** 最近一次 `listSchedulingSessions` 是否因 `staff-profiles-list` 失敗而略過職類（供排班頁提示） */
let staffProfilesUnavailableLastList = false

export const getStaffProfilesUnavailableLastList = (): boolean => staffProfilesUnavailableLastList

export class SchedulingConfigService {
  async listSchedulingSessions(facilityId = 'facility-main'): Promise<SchedulingSession[]> {
    staffProfilesUnavailableLastList = false
    /** `staff-profiles-list` 失敗時仍回傳時段（無 `staffRoleType`；SC 僅治療師規則略過職類檢查） */
    const staffProfilesSafe = (): Promise<StaffProfileListRow[]> =>
      staffProfilesListRepository.listStaffProfiles(facilityId).catch(() => {
        staffProfilesUnavailableLastList = true
        return []
      })
    const [activities, activitySessions, staffSkills, staffProfiles] = await Promise.all([
      activityRepository.listActivities(facilityId),
      activitySessionRepository.listActivitySessions({ facilityId }),
      staffSkillsRepository.listStaffSkills(facilityId),
      staffProfilesSafe(),
    ])
    if (activitySessions.length === 0) {
      staffProfilesUnavailableLastList = false
      return (await fallbackSessionRepository.listSessions()).map((item) => ({ ...item, skillMatched: true }))
    }
    const activityServiceMap = new Map(activities.map((item) => [item.id, item.serviceType] as const))
    const staffSkillPairs = new Set(staffSkills.map((item) => `${item.staffProfileId}|${item.activityId}`))
    const roleByStaffId = new Map(staffProfiles.map((p) => [p.id, p.roleType] as const))
    return activitySessions.map((item) => ({
      id: item.id,
      staffId: item.staffProfileId,
      staffName: item.staffName,
      date: item.sessionDate,
      timeSlot: item.timeSlot,
      serviceType: mapServiceType(activityServiceMap.get(item.activityId) ?? item.serviceType),
      capacity: item.capacity,
      skillMatched: staffSkillPairs.has(`${item.staffProfileId}|${item.activityId}`),
      staffRoleType: roleByStaffId.get(item.staffProfileId),
    }))
  }

  async getRules(facilityId = 'facility-main'): Promise<SchedulingRules | null> {
    return schedulingRulesRepository.getRules(facilityId)
  }
}

export const schedulingConfigService = new SchedulingConfigService()
