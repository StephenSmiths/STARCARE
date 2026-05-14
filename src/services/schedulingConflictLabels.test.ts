import { describe, expect, it } from 'vitest'
import type { ConflictType } from './schedulingService'
import {
  formatSchedulingConflictLine,
  schedulingConflictTypeLabel,
} from './schedulingConflictLabels'

const conflictTypeCases: [ConflictType, string][] = [
  ['NO_CAPACITY', '容量已滿'],
  ['DAILY_LIMIT', '同日服務上限'],
  ['INTERVAL_LIMIT', '相鄰日間隔'],
  ['STAFF_SLOT_DUPLICATED', '員工時段重複'],
  ['SKILL_MISMATCH', '技能／職類不符'],
  ['NO_ELIGIBLE_SESSION', '無可用時段'],
  ['STAFF_GROUP_DAILY_CAP', '小組活動每日場次上限'],
]

describe('schedulingConflictLabels', () => {
  it.each(conflictTypeCases)('schedulingConflictTypeLabel(%s) → %s', (type, label) => {
    expect(schedulingConflictTypeLabel(type)).toBe(label)
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
