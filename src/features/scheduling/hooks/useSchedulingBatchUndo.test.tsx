/** @vitest-environment happy-dom */
/** 01 §5／Seq 10：最近一次排班批次撤銷 hook。 */
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSchedulingBatchUndo } from './useSchedulingBatchUndo'

vi.mock('../../../services/schedulingLastBatchStorage', () => ({
  readLastSchedulingBatchId: vi.fn(),
}))

vi.mock('../services/schedulingHistoryBatchSoftDeleteService', () => ({
  softDeleteSchedulingHistoryBatch: vi.fn(),
}))

import { readLastSchedulingBatchId } from '../../../services/schedulingLastBatchStorage'
import { softDeleteSchedulingHistoryBatch } from '../services/schedulingHistoryBatchSoftDeleteService'

describe('useSchedulingBatchUndo', () => {
  beforeEach(() => {
    vi.mocked(readLastSchedulingBatchId).mockReset()
    vi.mocked(softDeleteSchedulingHistoryBatch).mockReset()
  })

  it('初始讀取本機批次 id（含 queueMicrotask 同步）', async () => {
    vi.mocked(readLastSchedulingBatchId).mockReturnValue('batch-abc')
    const { result } = renderHook(() => useSchedulingBatchUndo('actor-u', 'TeamLead'))
    await waitFor(() => {
      expect(result.current.lastSchedulingBatchId).toBe('batch-abc')
    })
    expect(readLastSchedulingBatchId).toHaveBeenCalled()
  })

  it('undoLastSchedulingBatch：呼叫軟刪服務並清空記住之 id', async () => {
    vi.mocked(readLastSchedulingBatchId).mockReturnValue('batch-xyz')
    vi.mocked(softDeleteSchedulingHistoryBatch).mockResolvedValue(undefined)
    const { result } = renderHook(() => useSchedulingBatchUndo('actor-u', 'TeamLead'))
    await waitFor(() => expect(result.current.lastSchedulingBatchId).toBe('batch-xyz'))
    await act(async () => {
      await result.current.undoLastSchedulingBatch()
    })
    expect(softDeleteSchedulingHistoryBatch).toHaveBeenCalledWith('TeamLead', 'actor-u', 'batch-xyz')
    expect(result.current.lastSchedulingBatchId).toBe(null)
    expect(result.current.isUndoingSchedulingBatch).toBe(false)
  })

  it('無批次 id 時拋出可讀錯誤', async () => {
    vi.mocked(readLastSchedulingBatchId).mockReturnValue(null)
    const { result } = renderHook(() => useSchedulingBatchUndo('actor-u', 'Admin'))
    await waitFor(() => expect(result.current.lastSchedulingBatchId).toBe(null))
    await expect(result.current.undoLastSchedulingBatch()).rejects.toThrow('目前沒有可撤銷的批次')
  })
})
