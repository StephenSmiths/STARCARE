/** @vitest-environment happy-dom */
/** PDF 02【3】：排班院友表資料列（Seq 15；資助標籤與達標狀態）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { ResidentTableRow } from '../types/residentTableRow'
import { residentFundingLabel } from '../utils/residentTableFundingPresentation'
import { SchedulingResidentTableBody } from './SchedulingResidentTableBody'

afterEach(() => {
  cleanup()
})

const baseRow = (over: Partial<ResidentTableRow>): ResidentTableRow => ({
  id: 'r1',
  name: '測試院友',
  fundingType: 'Private',
  weeklyTarget: 2,
  weeklyCompleted: 0,
  isUnderTarget: true,
  ...over,
})

describe('SchedulingResidentTableBody', () => {
  it('無列時顯示空資料提示', () => {
    render(<SchedulingResidentTableBody pagedRows={[]} />)
    expect(screen.getByText('沒有符合條件的資料')).toBeInstanceOf(HTMLElement)
  })

  it('未達標列顯示待補齊與資助標籤', () => {
    const r = baseRow({ id: 'u1', name: '甲院友', fundingType: 'GradeA_Subsidized', weeklyTarget: 3, weeklyCompleted: 1 })
    render(<SchedulingResidentTableBody pagedRows={[r]} />)
    expect(screen.getByText('甲院友')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(residentFundingLabel('GradeA_Subsidized'))).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('3')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('1')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('待補齊')).toBeInstanceOf(HTMLElement)
  })

  it('已達標列顯示已達標', () => {
    const r = baseRow({ id: 'u2', weeklyCompleted: 2, isUnderTarget: false })
    render(<SchedulingResidentTableBody pagedRows={[r]} />)
    expect(screen.getByText('已達標')).toBeInstanceOf(HTMLElement)
  })
})
