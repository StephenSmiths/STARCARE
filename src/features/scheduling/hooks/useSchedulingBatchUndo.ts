import { useCallback, useEffect, useState } from 'react'
import type { StarcareRole } from '../../auth/permissions'
import { readLastSchedulingBatchId } from '../../../services/schedulingLastBatchStorage'
import { softDeleteSchedulingHistoryBatch } from '../services/schedulingHistoryBatchSoftDeleteService'

/** 01 §5／Seq 10：記住並撤銷最近一次 scheduling_history 儲存批次 */
export const useSchedulingBatchUndo = (actorId: string, role: string) => {
  const [lastSchedulingBatchId, setLastSchedulingBatchId] = useState<string | null>(() =>
    readLastSchedulingBatchId(),
  )
  const [isUndoingSchedulingBatch, setIsUndoingSchedulingBatch] = useState(false)

  useEffect(() => {
    queueMicrotask(() => setLastSchedulingBatchId(readLastSchedulingBatchId()))
  }, [])

  const refreshLastBatchId = useCallback(() => {
    setLastSchedulingBatchId(readLastSchedulingBatchId())
  }, [])

  const undoLastSchedulingBatch = useCallback(async () => {
    const batchId = lastSchedulingBatchId ?? readLastSchedulingBatchId()
    if (!batchId) throw new Error('目前沒有可撤銷的批次（請先成功一鍵儲存排班）')
    setIsUndoingSchedulingBatch(true)
    try {
      await softDeleteSchedulingHistoryBatch(role as StarcareRole, actorId, batchId)
      setLastSchedulingBatchId(null)
    } finally {
      setIsUndoingSchedulingBatch(false)
    }
  }, [actorId, lastSchedulingBatchId, role])

  return {
    lastSchedulingBatchId,
    refreshLastBatchId,
    undoLastSchedulingBatch,
    isUndoingSchedulingBatch,
  }
}
