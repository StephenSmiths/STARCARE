/** @vitest-environment happy-dom */
/** PDF 01 §5／Seq 10：scheduling_history batch_id 本機暫存（sessionStorage）。 */
import { afterEach, describe, expect, it } from 'vitest'
import {
  clearLastSchedulingBatchId,
  readLastSchedulingBatchId,
  writeLastSchedulingBatchId,
} from './schedulingLastBatchStorage'

describe('schedulingLastBatchStorage', () => {
  afterEach(() => {
    sessionStorage.clear()
  })

  it('writeLastSchedulingBatchId 後 readLastSchedulingBatchId 可讀回', () => {
    writeLastSchedulingBatchId('batch-abc')
    expect(readLastSchedulingBatchId()).toBe('batch-abc')
  })

  it('clearLastSchedulingBatchId 清除暫存', () => {
    writeLastSchedulingBatchId('batch-x')
    clearLastSchedulingBatchId()
    expect(readLastSchedulingBatchId()).toBeNull()
  })
})
