import { describe, expect, it } from 'vitest'
import { STARCARE_DEFAULT_FACILITY_ID } from '../../../constants/starcareDefaultFacilityId'
import { SCHEDULING_WORKSPACE_FACILITY_ID } from './schedulingWorkspaceDefaults'

describe('schedulingWorkspaceDefaults', () => {
  it('排班工作區預設院舍 ID 與全站種子預設一致', () => {
    expect(SCHEDULING_WORKSPACE_FACILITY_ID).toBe(STARCARE_DEFAULT_FACILITY_ID)
  })
})
