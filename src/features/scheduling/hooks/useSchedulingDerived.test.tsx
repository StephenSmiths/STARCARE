/** @vitest-environment happy-dom */
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { SchedulingResident } from '../../../services/schedulingService'
import { useSchedulingDerived } from './useSchedulingDerived'
import type { SchedulingViewModel } from '../types/schedule'

const emptyResult: SchedulingViewModel = {
  assignments: [],
  conflicts: [],
  underTargetResidents: [],
}

const res = (over: Partial<SchedulingResident>): SchedulingResident => ({
  id: 'r-1',
  name: '陳伯',
  fundingType: 'Private',
  isSpecialCareCase: false,
  weeklyCompletedCount: 0,
  assignedDates: [],
  ...over,
})

describe('useSchedulingDerived', () => {
  it('空院友：統計與表格皆為零', () => {
    const { result } = renderHook(() => useSchedulingDerived([], emptyResult))
    expect(result.current.stats).toEqual({ totalResidents: 0, compliantCount: 0, pendingSlots: 0 })
    expect(result.current.tableRows).toEqual([])
    expect(result.current.complianceAlerts).toEqual([])
  })

  it('私位未達標：pendingSlots 累加差額，表格列 isUnderTarget', () => {
    const { result } = renderHook(() => useSchedulingDerived([res({ weeklyCompletedCount: 0 })], emptyResult))
    expect(result.current.stats).toEqual({ totalResidents: 1, compliantCount: 0, pendingSlots: 1 })
    expect(result.current.tableRows[0]).toMatchObject({
      id: 'r-1',
      name: '陳伯',
      fundingType: 'Private',
      weeklyTarget: 1,
      weeklyCompleted: 0,
      isUnderTarget: true,
    })
  })

  it('甲一達週標：compliantCount 與 pendingSlots 反映目標次數 2', () => {
    const { result } = renderHook(() =>
      useSchedulingDerived([res({ fundingType: 'GradeA_Subsidized', weeklyCompletedCount: 2 })], emptyResult),
    )
    expect(result.current.stats).toEqual({ totalResidents: 1, compliantCount: 1, pendingSlots: 0 })
    expect(result.current.tableRows[0]?.isUnderTarget).toBe(false)
  })

  it('僅私位院友時 complianceAlerts 恒為空（週三邏輯不涵蓋私位）', () => {
    const { result } = renderHook(() =>
      useSchedulingDerived([res({ fundingType: 'Private', weeklyCompletedCount: 0 })], emptyResult),
    )
    expect(result.current.complianceAlerts).toEqual([])
  })
})
