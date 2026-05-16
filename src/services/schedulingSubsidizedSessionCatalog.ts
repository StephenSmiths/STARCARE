/** 資助復康排班：預建時段索引，避免 pick 迴圈重複過濾／重建 Map */
import type { SchedulingSession } from './schedulingService'

export type SubsidizedSessionCatalog = {
  subsidizedSessions: SchedulingSession[]
  sessionsById: Map<string, SchedulingSession>
}

export const buildSubsidizedRehabSessionCatalog = (
  sessions: readonly SchedulingSession[],
): SubsidizedSessionCatalog => {
  const subsidizedSessions: SchedulingSession[] = []
  const sessionsById = new Map<string, SchedulingSession>()
  for (const session of sessions) {
    sessionsById.set(session.id, session)
    if (session.serviceType === 'Subsidized_Rehab') subsidizedSessions.push(session)
  }
  return { subsidizedSessions, sessionsById }
}
