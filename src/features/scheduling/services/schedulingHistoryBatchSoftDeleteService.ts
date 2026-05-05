/**
 * 01 §5：排班歷史批次軟刪除（PDF 02【3】儲存之撤銷；Seq 10）
 * 僅 TeamLead／Admin；成功後清除本機記住之 last batch id。
 */
import { createScheduleAssignmentRepository } from '../../../repositories/scheduleAssignmentRepository'
import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import { clearLastSchedulingBatchId } from '../../../services/schedulingLastBatchStorage'
import type { StarcareRole } from '../../auth/permissions'
import { isSupabaseBrowserConfigured } from '../../../services/supabaseBrowserEnv'

export const assertCanSoftDeleteSchedulingHistoryBatch = (role: StarcareRole): void => {
  if (role !== 'TeamLead' && role !== 'Admin') {
    throw new Error('僅 TeamLead／Admin 可軟刪除排班歷史批次')
  }
}

export const softDeleteSchedulingHistoryBatch = async (
  role: StarcareRole,
  actorId: string,
  batchId: string,
): Promise<void> => {
  assertCanSoftDeleteSchedulingHistoryBatch(role)
  const id = batchId.trim()
  if (!id) throw new Error('缺少 batch_id')
  const repo = createScheduleAssignmentRepository()
  await repo.softDeleteHistoryBatch(id)
  clearLastSchedulingBatchId()
  const ts = new Date().toISOString()
  recordAuditTrailThenHydrate(
    {
      action: 'SCHEDULING_HISTORY_BATCH_SOFT_DELETE',
      entityType: 'Scheduling',
      entityId: id,
      actorId,
      beforeState: JSON.stringify({ batchId: id }),
      afterState: JSON.stringify({ is_deleted: true }),
      detail: '軟刪除 scheduling_history 批次（is_deleted）',
      occurredAt: ts,
    },
    isSupabaseBrowserConfigured(),
  )
}
