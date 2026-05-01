import { describe, expect, it } from 'vitest'
import { getWeeklyTargetByFundingType } from './schedulingTargets'
import { buildWeeklyComplianceCsv } from './weeklyComplianceCsvService'

describe('本週合規 CSV', () => {
  it('「是否達標」欄位應正確輸出「是」或「否」', () => {
    const csv = buildWeeklyComplianceCsv([
      { name: '陳達標', fundingType: 'GradeA_Subsidized', isCompliant: true },
      { name: '林未達', fundingType: 'Voucher', isCompliant: false },
      { name: '黃私位', fundingType: 'Private', isCompliant: true },
    ])
    const body = csv.replace(/^\uFEFF/, '')
    const lines = body.split('\n').filter((line) => line.length > 0)
    expect(lines[0]).toBe('院友姓名,資助類別,是否達標')
    expect(lines[1]).toBe('陳達標,甲一買位（EA1）,是')
    expect(lines[2]).toBe('林未達,院舍券,否')
    expect(lines[3]).toBe('黃私位,私位,是')
  })

  it('週目標與完成次數比對後，未達標應輸出「否」', () => {
    const fundingType = 'GradeA_Subsidized'
    const weeklyCompletedCount = 1
    const isCompliant = weeklyCompletedCount >= getWeeklyTargetByFundingType(fundingType)
    expect(isCompliant).toBe(false)
    const csv = buildWeeklyComplianceCsv([
      { name: '甲一測試', fundingType, isCompliant },
    ])
    const lines = csv.replace(/^\uFEFF/, '').split('\n').filter((l) => l.length > 0)
    expect(lines[1]).toBe('甲一測試,甲一買位（EA1）,否')
  })
})
