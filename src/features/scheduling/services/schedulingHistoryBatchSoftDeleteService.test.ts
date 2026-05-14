/** PDF 01 §5／Seq 15：批次軟刪服務（useSchedulingBatchUndo 下游）。 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../repositories/scheduleAssignmentRepository', () => ({
  createScheduleAssignmentRepository: vi.fn(),
}))

vi.mock('../../../services/schedulingLastBatchStorage', () => ({
  clearLastSchedulingBatchId: vi.fn(),
}))

vi.mock('../../../services/auditTrailHydrationService', () => ({
  recordAuditTrailThenHydrate: vi.fn(),
}))

vi.mock('../../../services/supabaseBrowserEnv', () => ({
  isSupabaseBrowserConfigured: vi.fn(),
}))

import { createScheduleAssignmentRepository } from '../../../repositories/scheduleAssignmentRepository'
import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import { clearLastSchedulingBatchId } from '../../../services/schedulingLastBatchStorage'
import { isSupabaseBrowserConfigured } from '../../../services/supabaseBrowserEnv'
import {
  assertCanSoftDeleteSchedulingHistoryBatch,
  softDeleteSchedulingHistoryBatch,
} from './schedulingHistoryBatchSoftDeleteService'

describe('schedulingHistoryBatchSoftDeleteService', () => {
  const repoSoftDelete = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createScheduleAssignmentRepository).mockReturnValue({
      saveBatch: vi.fn(),
      softDeleteHistoryBatch: repoSoftDelete,
    } as never)
    vi.mocked(isSupabaseBrowserConfigured).mockReturnValue(false)
  })

  it('Staff 不可撤銷批次', () => {
    expect(() => assertCanSoftDeleteSchedulingHistoryBatch('Staff')).toThrow(/TeamLead/)
  })

  it('TeamLead／Admin 可撤銷', () => {
    expect(() => assertCanSoftDeleteSchedulingHistoryBatch('TeamLead')).not.toThrow()
    expect(() => assertCanSoftDeleteSchedulingHistoryBatch('Admin')).not.toThrow()
  })

  it('Staff 呼叫 softDelete 時不觸發 Repository', async () => {
    await expect(softDeleteSchedulingHistoryBatch('Staff', 'a', 'b1')).rejects.toThrow(/TeamLead/)
    expect(repoSoftDelete).not.toHaveBeenCalled()
  })

  it('空或純空白 batch_id 時拒絕', async () => {
    await expect(softDeleteSchedulingHistoryBatch('TeamLead', 'a', '')).rejects.toThrow('缺少 batch_id')
    await expect(softDeleteSchedulingHistoryBatch('TeamLead', 'a', '   \t')).rejects.toThrow('缺少 batch_id')
    expect(repoSoftDelete).not.toHaveBeenCalled()
  })

  it('TeamLead 成功路徑：trim、Repository 軟刪、清除本機 batch、審計', async () => {
    await softDeleteSchedulingHistoryBatch('TeamLead', 'actor-1', '  batch-z  ')
    expect(repoSoftDelete).toHaveBeenCalledTimes(1)
    expect(repoSoftDelete).toHaveBeenCalledWith('batch-z')
    expect(clearLastSchedulingBatchId).toHaveBeenCalledTimes(1)
    expect(recordAuditTrailThenHydrate).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'SCHEDULING_HISTORY_BATCH_SOFT_DELETE',
        entityType: 'Scheduling',
        entityId: 'batch-z',
        actorId: 'actor-1',
        detail: '軟刪除 scheduling_history 批次（is_deleted）',
      }),
      false,
    )
  })

  it('審計第二參數隨 isSupabaseBrowserConfigured', async () => {
    vi.mocked(isSupabaseBrowserConfigured).mockReturnValue(true)
    await softDeleteSchedulingHistoryBatch('Admin', 'actor-2', 'bid')
    expect(recordAuditTrailThenHydrate).toHaveBeenCalledWith(expect.any(Object), true)
  })
})
