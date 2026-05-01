import { createActivityRepository } from '../repositories/activityRepository'
import { createActivitySessionRepository } from '../repositories/activitySessionRepository'
import { createSchedulingRulesRepository, type SchedulingRules } from '../repositories/schedulingRulesRepository'
import { createSchedulingSessionRepository } from '../repositories/schedulingSessionRepository'
import { createStaffSkillsRepository } from '../repositories/staffSkillsRepository'
import type { SchedulingSession } from './schedulingService'

const activityRepository = createActivityRepository()
const activitySessionRepository = createActivitySessionRepository()
const schedulingRulesRepository = createSchedulingRulesRepository()
const staffSkillsRepository = createStaffSkillsRepository()
const fallbackSessionRepository = createSchedulingSessionRepository()

const mapServiceType = (serviceType: 'Subsidized_Rehab' | 'Dementia_Care'): 'Subsidized_Rehab' | 'Dementia_Service' =>
  serviceType === 'Dementia_Care' ? 'Dementia_Service' : 'Subsidized_Rehab'

export class SchedulingConfigService {
  async listSchedulingSessions(facilityId = 'facility-main'): Promise<SchedulingSession[]> {
    const [activities, activitySessions, staffSkills] = await Promise.all([
      activityRepository.listActivities(facilityId),
      activitySessionRepository.listActivitySessions({ facilityId }),
      staffSkillsRepository.listStaffSkills(facilityId),
    ])
    if (activitySessions.length === 0) {
      return (await fallbackSessionRepository.listSessions()).map((item) => ({ ...item, skillMatched: true }))
    }
    const activityServiceMap = new Map(activities.map((item) => [item.id, item.serviceType] as const))
    const staffSkillPairs = new Set(staffSkills.map((item) => `${item.staffProfileId}|${item.activityId}`))
    return activitySessions.map((item) => ({
      id: item.id,
      staffId: item.staffProfileId,
      staffName: item.staffName,
      date: item.sessionDate,
      timeSlot: item.timeSlot,
      serviceType: mapServiceType(activityServiceMap.get(item.activityId) ?? item.serviceType),
      capacity: item.capacity,
      skillMatched: staffSkillPairs.has(`${item.staffProfileId}|${item.activityId}`),
    }))
  }

  async getRules(facilityId = 'facility-main'): Promise<SchedulingRules | null> {
    return schedulingRulesRepository.getRules(facilityId)
  }
}

export const schedulingConfigService = new SchedulingConfigService()
