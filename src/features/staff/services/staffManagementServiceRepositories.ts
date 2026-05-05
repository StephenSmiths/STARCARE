import { createStaffProfileRepository } from '../../../repositories/staffProfileRepository'
import { createStaffProfilesListRepository } from '../../../repositories/staffProfilesListRepository'
import { createStaffProfileUpdateRepository } from '../../../repositories/staffProfileUpdateRepository'
import { createStaffSkillsRepository } from '../../../repositories/staffSkillsRepository'

/** 員工領域：Repository 單例（與排班／工作計劃共用清單來源）。 */
export const staffSkillsRepository = createStaffSkillsRepository()
export const staffProfileRepository = createStaffProfileRepository()
export const staffProfilesListRepository = createStaffProfilesListRepository()
export const staffProfileUpdateRepository = createStaffProfileUpdateRepository()
