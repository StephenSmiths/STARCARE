/**
 * 01 §2.1 工作節：ACCEPTED → COMPLETED（已完成服務）。
 * 與 Seq 17 閉環：主管核准服務表單後，將對應工作節標為完成（本地 store；正式環境改 DB）。
 */
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { workSessionResponseStore } from '../../../services/workSessionResponseStore'
import { resolveLifecycleStatus } from '../../workSessionPlans/services/workSessionPlanService'

export const completeWorkSessionAfterFormApproved = (
  sessionId: string,
  completedByActorId: string,
): void => {
  const current = resolveLifecycleStatus(sessionId)
  if (current === 'COMPLETED') return
  if (current !== 'ACCEPTED') {
    throw new Error('01 §2.1：僅「已接收」之工作節可於表單核准後標示為已完成')
  }
  const prev = workSessionResponseStore.get(sessionId)
  const now = new Date().toISOString()
  workSessionResponseStore.set({
    sessionId,
    status: 'COMPLETED',
    actorId: completedByActorId,
    occurredAt: now,
  })
  globalAuditTrailService.record({
    action: 'WORK_SESSION_COMPLETED',
    entityType: 'Scheduling',
    entityId: sessionId,
    actorId: completedByActorId,
    beforeState: prev ? JSON.stringify({ status: prev.status }) : null,
    afterState: JSON.stringify({ status: 'COMPLETED' }),
    detail: '表單已核准：工作節標示為已完成（COMPLETED）',
    occurredAt: now,
  })
}
