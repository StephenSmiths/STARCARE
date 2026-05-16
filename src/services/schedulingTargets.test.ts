import { describe, expect, it } from 'vitest'
import {
  buildPass12TopUpQueue,
  buildTopUpQueue,
  getWeeklyTargetByFundingType,
  hasUnmetTarget,
} from './schedulingTargets'
import type { SchedulingResident } from './schedulingService'

/** PDF 01 §3.2／Seq 6：週目標常數與補位排序之迴歸錨點（對表簽核仍待產品） */
describe('schedulingTargets', () => {
  it('甲一與院舍券週目標為 2', () => {
    expect(getWeeklyTargetByFundingType('GradeA_Subsidized')).toBe(2)
    expect(getWeeklyTargetByFundingType('Voucher')).toBe(2)
  })

  it('私位週目標現程為 1（與 02「每週最多 2」是否一致待客戶裁定）', () => {
    expect(getWeeklyTargetByFundingType('Private')).toBe(1)
  })

  it('hasUnmetTarget 依 fundingType 比較週完成數', () => {
    const met: SchedulingResident = {
      id: 'r1',
      name: '',
      fundingType: 'GradeA_Subsidized',
      isSpecialCareCase: false,
      weeklyCompletedCount: 2,
      assignedDates: [],
    }
    const unmet: SchedulingResident = { ...met, weeklyCompletedCount: 1 }
    expect(hasUnmetTarget(met)).toBe(false)
    expect(hasUnmetTarget(unmet)).toBe(true)
  })

  it('buildTopUpQueue 缺額大者優先（Pass 3 補位與 fillWeeklyTargets 共用）', () => {
    const base = {
      name: '',
      fundingType: 'GradeA_Subsidized' as const,
      isSpecialCareCase: false,
      assignedDates: [] as string[],
    }
    const lowDeficit: SchedulingResident = { id: 'r-low', ...base, weeklyCompletedCount: 1 }
    const highDeficit: SchedulingResident = { id: 'r-high', ...base, weeklyCompletedCount: 0 }
    expect(buildTopUpQueue([lowDeficit, highDeficit]).map((r) => r.id)).toEqual(['r-high', 'r-low'])
    expect(buildTopUpQueue([])).toEqual([])
  })

  it('buildPass12TopUpQueue 排除私位（由 Pass 3 處理）', () => {
    const privateUnmet: SchedulingResident = {
      id: 'r-private',
      name: '',
      fundingType: 'Private',
      isSpecialCareCase: false,
      weeklyCompletedCount: 0,
      assignedDates: [],
    }
    const ea1Unmet: SchedulingResident = {
      id: 'r-ea1',
      name: '',
      fundingType: 'GradeA_Subsidized',
      isSpecialCareCase: false,
      weeklyCompletedCount: 1,
      assignedDates: [],
    }
    expect(buildPass12TopUpQueue([privateUnmet, ea1Unmet]).map((r) => r.id)).toEqual(['r-ea1'])
  })

  it('buildTopUpQueue 略過已達標者', () => {
    const met: SchedulingResident = {
      id: 'r-met',
      name: '',
      fundingType: 'Private',
      isSpecialCareCase: false,
      weeklyCompletedCount: 1,
      assignedDates: [],
    }
    const unmet: SchedulingResident = {
      id: 'r-unmet',
      name: '',
      fundingType: 'GradeA_Subsidized',
      isSpecialCareCase: false,
      weeklyCompletedCount: 1,
      assignedDates: [],
    }
    expect(buildTopUpQueue([met, unmet]).map((r) => r.id)).toEqual(['r-unmet'])
  })
})
