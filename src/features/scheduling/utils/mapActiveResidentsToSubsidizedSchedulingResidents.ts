import type { Resident } from '../../residents/types/resident'
import { isSubsidizedRehabCohort } from '../../residents/utils/residentCareTrackCohort'
import type { SchedulingResident } from '../../../services/schedulingService'
import { mapResidentToSchedulingResident } from './mapResidentToSchedulingResident'

/** PDF 01 §4.1：活躍院友中僅納入資助復康合規族群，再轉為排班引擎／KPI 用列 */
export const mapActiveResidentsToSubsidizedSchedulingResidents = (
  residentRows: Resident[],
): SchedulingResident[] => residentRows.filter(isSubsidizedRehabCohort).map(mapResidentToSchedulingResident)
