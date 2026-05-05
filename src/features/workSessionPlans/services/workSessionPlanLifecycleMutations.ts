import { createActivitySessionRepository } from '../../../repositories/activitySessionRepository'
import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import { workSessionResponseStore } from '../../../services/workSessionResponseStore'
import { resolveLifecycleStatus } from './workSessionPlanRowModel'

export const acceptWorkSession = (actorId: string, sessionId: string): void => {
  const current = resolveLifecycleStatus(sessionId)
  if (current !== 'PENDING') throw new Error('僅「待接收」之工作節可點選接收')
  const now = new Date().toISOString()
  workSessionResponseStore.set({ sessionId, status: 'ACCEPTED', actorId, occurredAt: now })
  recordAuditTrailThenHydrate({
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
  recordAuditTrailThenHydrate({
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
  /** Edge 每筆 activity-session 軟刪已落庫審計；合併遠端 SOFT_DELETE 列（Seq 12） */
  recordAuditTrailThenHydrate({
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
