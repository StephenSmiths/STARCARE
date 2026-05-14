/** @vitest-environment happy-dom */
/** PDF 02【3】：院友週次數表關鍵字／狀態／分頁。 */
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ResidentTableRow } from '../types/residentTableRow'
import { useSchedulingResidentTable } from './useSchedulingResidentTable'

const row = (over: Partial<ResidentTableRow>): ResidentTableRow => ({
  id: '1',
  name: '陳大文',
  fundingType: 'Private',
  weeklyTarget: 1,
  weeklyCompleted: 0,
  isUnderTarget: true,
  ...over,
})

describe('useSchedulingResidentTable', () => {
  const rows: ResidentTableRow[] = [
    row({ id: 'a', name: 'Alpha 甲', weeklyCompleted: 0, isUnderTarget: true }),
    row({ id: 'b', name: 'Beta 乙', weeklyCompleted: 1, isUnderTarget: false }),
    row({ id: 'c', name: 'Gamma 丙', weeklyCompleted: 0, isUnderTarget: true }),
  ]

  it('關鍵字不分大小寫過濾姓名', () => {
    const { result } = renderHook(() => useSchedulingResidentTable(rows))
    act(() => {
      result.current.setKeyword('  beta ')
    })
    expect(result.current.filteredRows).toHaveLength(1)
    expect(result.current.filteredRows[0]?.id).toBe('b')
  })

  it('狀態篩選：under-target 僅未達標列', () => {
    const { result } = renderHook(() => useSchedulingResidentTable(rows))
    act(() => {
      result.current.setStatusFilter('under-target')
    })
    expect(result.current.filteredRows.map((r) => r.id)).toEqual(['a', 'c'])
  })

  it('狀態篩選：completed 僅已達標列', () => {
    const { result } = renderHook(() => useSchedulingResidentTable(rows))
    act(() => {
      result.current.setStatusFilter('completed')
    })
    expect(result.current.filteredRows.map((r) => r.id)).toEqual(['b'])
  })

  it('分頁：safePage 不超過 pageCount，pagedRows 切片正確', () => {
    const { result } = renderHook(() => useSchedulingResidentTable(rows))
    act(() => {
      result.current.setPageSize(2)
      result.current.setPage(99)
    })
    expect(result.current.pageCount).toBe(2)
    expect(result.current.safePage).toBe(2)
    expect(result.current.pagedRows.map((r) => r.id)).toEqual(['c'])
  })

  it('resetPage 回到第 1 頁', () => {
    const { result } = renderHook(() => useSchedulingResidentTable(rows))
    act(() => {
      result.current.setPageSize(2)
      result.current.setPage(2)
      result.current.resetPage()
    })
    expect(result.current.page).toBe(1)
  })
})
