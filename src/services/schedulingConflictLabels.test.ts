import { describe, expect, it } from 'vitest'
import {
  formatSchedulingConflictLine,
  schedulingConflictTypeLabel,
} from './schedulingConflictLabels'

describe('schedulingConflictLabels', () => {
  it('STAFF_GROUP_DAILY_CAP 有中文標籤', () => {
    expect(schedulingConflictTypeLabel('STAFF_GROUP_DAILY_CAP')).toBe('小組活動每日場次上限')
  })

  it('formatSchedulingConflictLine 併院友名與理由', () => {
    expect(
      formatSchedulingConflictLine({
        residentId: 'r1',
        residentName: '王院友',
        type: 'STAFF_GROUP_DAILY_CAP',
        reason: '該員工於此日之小組活動場次已達每日上限',
      }),
    ).toBe('王院友：小組活動每日場次上限（該員工於此日之小組活動場次已達每日上限）')
  })
})
