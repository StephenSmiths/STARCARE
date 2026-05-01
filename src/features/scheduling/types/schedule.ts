import type {
  SchedulingAssignment,
  SchedulingConflict,
} from '../../../services/schedulingService'

export type UnderTargetResident = {
  residentId: string
  residentName: string
  missingCount: number
}

export type ServiceType = 'Subsidized_Rehab' | 'Dementia_Service'

export interface ScheduleSession {
  id: string
  staffName: string
  serviceType: ServiceType
  residentCount: number
}

export interface SchedulingViewModel {
  assignments: SchedulingAssignment[]
  conflicts: SchedulingConflict[]
  underTargetResidents: UnderTargetResident[]
}
