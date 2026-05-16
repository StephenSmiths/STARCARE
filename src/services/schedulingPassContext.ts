import { buildSubsidizedRehabSessionCatalog } from './schedulingSubsidizedSessionCatalog'
import type { StaffGroupDailyCache } from './schedulingStaffGroupDailyCache'
import type {
  SchedulingAssignment,
  SchedulingConflict,
  SchedulingSession,
} from './schedulingService'

export interface PassContext {
  assignments: SchedulingAssignment[]
  conflicts: SchedulingConflict[]
  sessionUsage: Map<string, number>
  staffSlotSet: Set<string>
  subsidizedSessions: SchedulingSession[]
  sessionsById: Map<string, SchedulingSession>
  staffGroupDailyCache: StaffGroupDailyCache
  assignedSessionIds: Set<string>
}

export const createPassContext = (sessions: readonly SchedulingSession[]): PassContext => {
  const catalog = buildSubsidizedRehabSessionCatalog(sessions)
  return {
    assignments: [],
    conflicts: [],
    sessionUsage: new Map<string, number>(),
    staffSlotSet: new Set<string>(),
    staffGroupDailyCache: new Map(),
    assignedSessionIds: new Set<string>(),
    ...catalog,
  }
}
