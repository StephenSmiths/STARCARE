import { describe, expect, it } from 'vitest'
import { splitHmTimeRangeByChunkMinutes } from './schedulingHmTimeRangeSplit'

describe('splitHmTimeRangeByChunkMinutes', () => {
  it('短於 chunk 則不切分', () => {
    expect(splitHmTimeRangeByChunkMinutes('09:00', '09:30', 60)).toEqual([
      { startHm: '09:00', endHm: '09:30' },
    ])
  })

  it('長時段依 30 分鐘切多段', () => {
    const parts = splitHmTimeRangeByChunkMinutes('08:00', '10:00', 30)
    expect(parts).toHaveLength(4)
    expect(parts[0]).toEqual({ startHm: '08:00', endHm: '08:30' })
    expect(parts[3]).toEqual({ startHm: '09:30', endHm: '10:00' })
  })
})
