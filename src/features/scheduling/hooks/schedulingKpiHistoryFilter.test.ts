import { describe, expect, it } from 'vitest'
import { SCHEDULING_KPI_HISTORY_LIMIT } from './schedulingKpiHistoryLimits'
import {
  EMPTY_SCHEDULING_KPI_HISTORY_FILTER,
  toSchedulingKpiHistoryQuery,
} from './schedulingKpiHistoryFilter'

describe('schedulingKpiHistoryFilter（排班 KPI 歷史篩選→查詢）', () => {
  it('EMPTY 為空字串三欄', () => {
    expect(EMPTY_SCHEDULING_KPI_HISTORY_FILTER).toEqual({
      from: '',
      to: '',
      actorId: '',
    })
  })

  it('toSchedulingKpiHistoryQuery：空字串轉 undefined 並帶固定 limit', () => {
    expect(
      toSchedulingKpiHistoryQuery({
        from: '',
        to: '',
        actorId: '',
      }),
    ).toEqual({
      limit: SCHEDULING_KPI_HISTORY_LIMIT,
      from: undefined,
      to: undefined,
      actorId: undefined,
    })
  })

  it('toSchedulingKpiHistoryQuery：有值時原樣傳入', () => {
    expect(
      toSchedulingKpiHistoryQuery({
        from: '2026-01-01',
        to: '2026-01-31',
        actorId: 'actor-1',
      }),
    ).toEqual({
      limit: SCHEDULING_KPI_HISTORY_LIMIT,
      from: '2026-01-01',
      to: '2026-01-31',
      actorId: 'actor-1',
    })
  })
})
