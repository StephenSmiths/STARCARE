import { createActivityRepository } from '../repositories/activityRepository'
import { createActivitySessionRepository } from '../repositories/activitySessionRepository'
import { createSchedulingRulesRepository, type SchedulingRules } from '../repositories/schedulingRulesRepository'
import { createSchedulingSessionRepository } from '../repositories/schedulingSessionRepository'
import { createStaffSkillsRepository } from '../repositories/staffSkillsRepository'
import {
  createStaffProfilesListRepository,
  type StaffProfileListRow,
} from '../repositories/staffProfilesListRepository'
import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import { isActivityPermittedByWorkPlanCatalogForStaffRole } from './schedulingWorkPlanCatalogSkill'
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
  async listSchedulingSessions(facilityId: string = STARCARE_DEFAULT_FACILITY_ID): Promise<SchedulingSession[]> {
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
    const activityById = new Map(activities.map((a) => [a.id, a] as const))
    const staffSkillPairs = new Set(staffSkills.map((item) => `${item.staffProfileId}|${item.activityId}`))
    const roleByStaffId = new Map(staffProfiles.map((p) => [p.id, p.roleType] as const))
    return activitySessions.map((item) => {
      const activity = activityById.get(item.activityId)
      const staffRoleType = roleByStaffId.get(item.staffProfileId)
      const fromSkills = staffSkillPairs.has(`${item.staffProfileId}|${item.activityId}`)
      const fromCatalog =
        activity !== undefined && isActivityPermittedByWorkPlanCatalogForStaffRole(activity, staffRoleType)
      return {
        id: item.id,
        staffId: item.staffProfileId,
        staffName: item.staffName,
        date: item.sessionDate,
        timeSlot: item.timeSlot,
        serviceType: mapServiceType(activity?.serviceType ?? item.serviceType),
        capacity: item.capacity,
        skillMatched: fromSkills || fromCatalog,
        staffRoleType,
      }
    })
  }

  async getRules(facilityId: string = STARCARE_DEFAULT_FACILITY_ID): Promise<SchedulingRules | null> {
    return schedulingRulesRepository.getRules(facilityId)
  }
}

export const schedulingConfigService = new SchedulingConfigService()
