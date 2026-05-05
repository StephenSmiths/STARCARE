import type { SchedulingSession } from '../../../services/schedulingService'
import type { StoredWorkSessionResponse } from '../../../services/workSessionResponseStore'

/** 01 §2.1 工作節狀態（UI 層含未入庫之 PENDING）；COMPLETED 寫入見 `features/workSessions` */
export type WorkSessionLifecycleStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'

export type WorkSessionPlanRow = SchedulingSession & {
  responseStatus: WorkSessionLifecycleStatus
  response: StoredWorkSessionResponse | null
}
