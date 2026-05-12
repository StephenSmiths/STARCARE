import { describe, expect, it } from 'vitest'
import { shiftPrepSlotTimes } from './shiftPrepWindow'

describe('shiftPrepWindow', () => {
  it('30 分鐘且不超出排班結束', () => {
    expect(shiftPrepSlotTimes('07:00', '22:00')).toEqual({ timeStart: '07:00', timeEnd: '07:30' })
  })

  it('視窗不足 30 分鐘時截斷至結束', () => {
    expect(shiftPrepSlotTimes('07:00', '07:15')).toEqual({ timeStart: '07:00', timeEnd: '07:15' })
  })
})
