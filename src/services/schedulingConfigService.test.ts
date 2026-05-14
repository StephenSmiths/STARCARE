/** PDF 02【3】：`listSchedulingSessions` 閉環（Seq 15；ActivitySession 為主／fallback 與職類降級）。 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

const m = vi.hoisted(() => ({
  listActivities: vi.fn(),
  listActivitySessions: vi.fn(),
  listStaffSkills: vi.fn(),
  listStaffProfiles: vi.fn(),
  listFallbackSessions: vi.fn(),
  getRules: vi.fn(),
}))

vi.mock('../repositories/activityRepository', () => ({
  createActivityRepository: () => ({ listActivities: m.listActivities }),
}))
vi.mock('../repositories/activitySessionRepository', () => ({
  createActivitySessionRepository: () => ({ listActivitySessions: m.listActivitySessions }),
}))
vi.mock('../repositories/schedulingRulesRepository', () => ({
  createSchedulingRulesRepository: () => ({ getRules: m.getRules }),
}))
vi.mock('../repositories/schedulingSessionRepository', () => ({
  createSchedulingSessionRepository: () => ({ listSessions: m.listFallbackSessions }),
}))
vi.mock('../repositories/staffSkillsRepository', () => ({
  createStaffSkillsRepository: () => ({ listStaffSkills: m.listStaffSkills }),
}))
vi.mock('../repositories/staffProfilesListRepository', () => ({
  createStaffProfilesListRepository: () => ({ listStaffProfiles: m.listStaffProfiles }),
}))

import type { Activity } from '../repositories/activityRepository'
import type { ActivitySession } from '../repositories/activitySessionRepository'
import type { StaffProfileListRow } from '../repositories/staffProfilesListRepository'
import type { StaffSkill } from '../repositories/staffSkillsRepository'
import type { SchedulingSession } from './schedulingService'
import { getStaffProfilesUnavailableLastList, schedulingConfigService } from './schedulingConfigService'

const fac = 'fac-test'

beforeEach(() => {
  vi.clearAllMocks()
  m.listActivities.mockResolvedValue([])
  m.listActivitySessions.mockResolvedValue([])
  m.listStaffSkills.mockResolvedValue([])
  m.listStaffProfiles.mockResolvedValue([])
  m.listFallbackSessions.mockResolvedValue([])
  m.getRules.mockResolvedValue(null)
})

describe('SchedulingConfigService.listSchedulingSessions', () => {
  it('無活動時段列時走 fallback 並標 skillMatched', async () => {
    const fb: SchedulingSession = {
      id: 'fb-1',
      staffId: 's1',
      staffName: 'OT',
      date: '2026-05-10',
      timeSlot: '09:00-10:00',
      serviceType: 'Subsidized_Rehab',
      capacity: 4,
    }
    m.listFallbackSessions.mockResolvedValue([fb])
    const rows = await schedulingConfigService.listSchedulingSessions(fac)
    expect(rows).toEqual([{ ...fb, skillMatched: true }])
    expect(getStaffProfilesUnavailableLastList()).toBe(false)
  })

  it('有活動時段列時依主檔與技能組裝 SchedulingSession', async () => {
    const activities: Activity[] = [
      {
        id: 'act-1',
        facilityId: fac,
        name: 'Grp',
        serviceType: 'Dementia_Care',
        activityKind: 'Training',
        deliveryMode: 'Group',
        minDurationMinutes: 30,
      },
    ]
    const sessions: ActivitySession[] = [
      {
        id: 'sess-1',
        facilityId: fac,
        activityId: 'act-1',
        staffProfileId: 'sp-1',
        staffName: '王 OT',
        sessionDate: '2026-05-11',
        timeSlot: '10:00-11:00',
        capacity: 6,
        serviceType: 'Subsidized_Rehab',
      },
    ]
    const skills: StaffSkill[] = [
      { id: 'sk-1', facilityId: fac, staffProfileId: 'sp-1', activityId: 'act-1' },
    ]
    const profiles: StaffProfileListRow[] = [
      {
        id: 'sp-1',
        facilityId: fac,
        displayName: '王 OT',
        roleType: 'OT',
        serviceScope: 'Subsidized_Rehab',
      },
    ]
    m.listActivities.mockResolvedValue(activities)
    m.listActivitySessions.mockResolvedValue(sessions)
    m.listStaffSkills.mockResolvedValue(skills)
    m.listStaffProfiles.mockResolvedValue(profiles)

    const rows = await schedulingConfigService.listSchedulingSessions(fac)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      id: 'sess-1',
      staffId: 'sp-1',
      staffName: '王 OT',
      date: '2026-05-11',
      timeSlot: '10:00-11:00',
      capacity: 6,
      serviceType: 'Dementia_Service',
      skillMatched: true,
      staffRoleType: 'OT',
    })
    expect(getStaffProfilesUnavailableLastList()).toBe(false)
  })

  it('staff-profiles-list 失敗時仍回傳時段並標記職類不可用', async () => {
    m.listStaffProfiles.mockRejectedValue(new Error('network'))
    m.listActivities.mockResolvedValue([
      {
        id: 'act-1',
        facilityId: fac,
        name: 'X',
        serviceType: 'Subsidized_Rehab',
        activityKind: 'Training',
        deliveryMode: 'Group',
        minDurationMinutes: 30,
      },
    ])
    m.listActivitySessions.mockResolvedValue([
      {
        id: 'sess-1',
        facilityId: fac,
        activityId: 'act-1',
        staffProfileId: 'sp-1',
        staffName: 'OT',
        sessionDate: '2026-05-12',
        timeSlot: '14:00-15:00',
        capacity: 4,
        serviceType: 'Subsidized_Rehab',
      },
    ])

    const rows = await schedulingConfigService.listSchedulingSessions(fac)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.staffRoleType).toBeUndefined()
    expect(getStaffProfilesUnavailableLastList()).toBe(true)
  })
})

describe('SchedulingConfigService.getRules', () => {
  it('委派 schedulingRulesRepository.getRules', async () => {
    m.getRules.mockResolvedValue(null)
    await expect(schedulingConfigService.getRules(fac)).resolves.toBeNull()
    expect(m.getRules).toHaveBeenCalledWith(fac)
  })
})
