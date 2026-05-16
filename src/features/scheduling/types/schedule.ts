import type {
  SchedulingAssignment,
  SchedulingConflict,
  SchedulingSession,
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
  /** 最近一次乾跑所用時段快照（供 TL 員工工作表預覽；PDF 02【3】第一期） */
  previewSessions: SchedulingSession[]
}
