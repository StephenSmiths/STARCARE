/**
 * 01 §2.1 工作節：ACCEPTED → COMPLETED（已完成服務）。
 * Seq 17：`FORM_APPROVE` 經 **`service-forms-upsert`** 時 Edge 同步落庫 **`WORK_SESSION_COMPLETED`**；
 * `skipRemotePersist=true` 時僅更新本機 store，不重複 `audit-trail-append`／避免與遠端 fingerprint 分叉。
 */
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { workSessionResponseStore } from '../../../services/workSessionResponseStore'
import { resolveLifecycleStatus } from '../../workSessionPlans/services/workSessionPlanService'

export const completeWorkSessionAfterFormApproved = (
  sessionId: string,
  completedByActorId: string,
  skipRemotePersist = false,
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
  if (skipRemotePersist) return
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
