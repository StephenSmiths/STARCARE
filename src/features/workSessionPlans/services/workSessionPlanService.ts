import { createActivitySessionRepository } from '../../../repositories/activitySessionRepository'
import type { SchedulingSession } from '../../../services/schedulingService'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import {
  workSessionResponseStore,
  type StoredWorkSessionResponse,
} from '../../../services/workSessionResponseStore'

/** 01 §2.1 工作節狀態（UI 層含未入庫之 PENDING）；COMPLETED 寫入見 `features/workSessions` */
export type WorkSessionLifecycleStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'

export type WorkSessionPlanRow = SchedulingSession & {
  responseStatus: WorkSessionLifecycleStatus
  response: StoredWorkSessionResponse | null
}

export const resolveLifecycleStatus = (sessionId: string): WorkSessionLifecycleStatus => {
  const r = workSessionResponseStore.get(sessionId)
  if (!r) return 'PENDING'
  if (r.status === 'ACCEPTED') return 'ACCEPTED'
  if (r.status === 'REJECTED') return 'REJECTED'
  return 'COMPLETED'
}

export const mergeSessionsWithResponses = (sessions: SchedulingSession[]): WorkSessionPlanRow[] =>
  sessions.map((session) => {
    const response = workSessionResponseStore.get(session.id) ?? null
    return {
      ...session,
      responseStatus: resolveLifecycleStatus(session.id),
      response,
    }
  })

export const filterWorkPlanRows = (
  rows: WorkSessionPlanRow[],
  dateYmd: string,
  status: 'all' | WorkSessionLifecycleStatus,
): WorkSessionPlanRow[] =>
  rows
    .filter((row) => (dateYmd ? row.date === dateYmd : true))
    .filter((row) => (status === 'all' ? true : row.responseStatus === status))

export const acceptWorkSession = (actorId: string, sessionId: string): void => {
  const current = resolveLifecycleStatus(sessionId)
  if (current !== 'PENDING') throw new Error('僅「待接收」之工作節可點選接收')
  const now = new Date().toISOString()
  workSessionResponseStore.set({ sessionId, status: 'ACCEPTED', actorId, occurredAt: now })
  globalAuditTrailService.record({
    action: 'WORK_SESSION_ACCEPT',
    entityType: 'Scheduling',
    entityId: sessionId,
    actorId,
    beforeState: JSON.stringify({ status: 'PENDING' }),
    afterState: JSON.stringify({ status: 'ACCEPTED' }),
    detail: '員工接收工作節（ACCEPTED）',
    occurredAt: now,
  })
}

export const rejectWorkSession = (actorId: string, sessionId: string): void => {
  const current = resolveLifecycleStatus(sessionId)
  if (current !== 'PENDING') throw new Error('僅「待接收」之工作節可點選拒絕')
  const now = new Date().toISOString()
  workSessionResponseStore.set({ sessionId, status: 'REJECTED', actorId, occurredAt: now })
  globalAuditTrailService.record({
    action: 'WORK_SESSION_REJECT',
    entityType: 'Scheduling',
    entityId: sessionId,
    actorId,
    beforeState: JSON.stringify({ status: 'PENDING' }),
    afterState: JSON.stringify({ status: 'REJECTED' }),
    detail: '員工拒絕工作節（REJECTED）',
    occurredAt: now,
  })
}

/** TeamLead／Admin：批量軟刪活動時段（02【4】） */
export const bulkSoftDeleteWorkSessionsForTeam = async (
  actorId: string,
  sessionIds: string[],
): Promise<void> => {
  if (sessionIds.length === 0) return
  const repo = createActivitySessionRepository()
  for (const id of sessionIds) {
    await repo.softDeleteActivitySession(id)
    workSessionResponseStore.remove(id)
  }
  const now = new Date().toISOString()
  globalAuditTrailService.record({
    action: 'WORK_SESSION_TEAM_BULK_SOFT_DELETE',
    entityType: 'Scheduling',
    entityId: `bulk-${Date.now()}`,
    actorId,
    beforeState: JSON.stringify({ count: sessionIds.length }),
    afterState: null,
    detail: `團隊計劃：批量軟刪除 ${sessionIds.length} 個活動時段`,
    occurredAt: now,
  })
}
