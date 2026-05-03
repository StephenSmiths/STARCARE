import { describe, expect, it } from 'vitest'
import { assertCanSoftDeleteSchedulingHistoryBatch } from './schedulingHistoryBatchSoftDeleteService'

describe('schedulingHistoryBatchSoftDeleteService', () => {
  it('Staff 不可撤銷批次', () => {
    expect(() => assertCanSoftDeleteSchedulingHistoryBatch('Staff')).toThrow(/TeamLead/)
  })

  it('TeamLead／Admin 可撤銷', () => {
    expect(() => assertCanSoftDeleteSchedulingHistoryBatch('TeamLead')).not.toThrow()
    expect(() => assertCanSoftDeleteSchedulingHistoryBatch('Admin')).not.toThrow()
  })
})
