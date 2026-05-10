import { describe, expect, it } from 'vitest'
import { STARCARE_DEFAULT_FACILITY_ID } from '../../../constants/starcareDefaultFacilityId'
import type { StaffProfileListRow } from '../../../repositories/staffProfilesListRepository'
import type { StaffSkill } from '../../../repositories/staffSkillsRepository'
import type { SchedulingSession } from '../../../services/schedulingService'
import { mergeStaffOverviewRows } from './staffManagementOverviewMerge'

describe('mergeStaffOverviewRows', () => {
  it('主檔 displayName 優先於時段 staffName', () => {
    const profiles: StaffProfileListRow[] = [
      {
        id: 's1',
        facilityId: STARCARE_DEFAULT_FACILITY_ID,
        displayName: 'DB 名',
        roleType: 'OT',
        serviceScope: 'Both',
      },
    ]
    const sessions: SchedulingSession[] = [
      {
        id: 'x',
        staffId: 's1',
        staffName: '排班別名',
        date: '2026-05-04',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'OT',
      },
    ]
    const out = mergeStaffOverviewRows(profiles, sessions, [])
    expect(out).toHaveLength(1)
    expect(out[0]?.staffName).toBe('DB 名')
    expect(out[0]?.sessionCount).toBe(1)
  })

  it('技能去重計數', () => {
    const profiles: StaffProfileListRow[] = [
      {
        id: 's1',
        facilityId: 'f',
        displayName: '員工',
        roleType: 'PT',
        serviceScope: 'Both',
      },
    ]
    const skills: StaffSkill[] = [
      { id: '1', facilityId: 'f', staffProfileId: 's1', activityId: 'a1' },
      { id: '2', facilityId: 'f', staffProfileId: 's1', activityId: 'a1' },
      { id: '3', facilityId: 'f', staffProfileId: 's1', activityId: 'a2' },
    ]
    const out = mergeStaffOverviewRows(profiles, [], skills)
    expect(out).toHaveLength(1)
    expect(out[0]?.skillCount).toBe(2)
  })

  it('已軟刪主檔不應因排班時段殘留而顯示於總覽', () => {
    const sessions: SchedulingSession[] = [
      {
        id: 'x',
        staffId: 'gone',
        staffName: '排班名',
        date: '2026-05-04',
        timeSlot: '09:00',
        serviceType: 'Subsidized_Rehab',
        capacity: 1,
        staffRoleType: 'PT',
      },
    ]
    const out = mergeStaffOverviewRows([], sessions, [])
    expect(out).toHaveLength(0)
  })

  it('無主檔時不因技能殘留單獨列出', () => {
    const skills: StaffSkill[] = [{ id: '1', facilityId: 'f', staffProfileId: 'orphan', activityId: 'a1' }]
    const out = mergeStaffOverviewRows([], [], skills)
    expect(out).toHaveLength(0)
  })
})
