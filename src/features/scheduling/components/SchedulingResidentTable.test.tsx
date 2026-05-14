/** @vitest-environment happy-dom */
/** PDF 02【3】：院友週次數表（Seq 15；`useSchedulingResidentTable` + 工具列／表身／分頁）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { ResidentTableRow } from '../types/residentTableRow'
import { SchedulingResidentTable } from './SchedulingResidentTable'

afterEach(() => {
  cleanup()
})

const mk = (over: Partial<ResidentTableRow>): ResidentTableRow => ({
  id: '1',
  name: '陳大文',
  fundingType: 'Private',
  weeklyTarget: 1,
  weeklyCompleted: 0,
  isUnderTarget: true,
  ...over,
})

describe('SchedulingResidentTable', () => {
  it('標題與列渲染；關鍵字篩選後筆數與可見列更新', () => {
    const rows: ResidentTableRow[] = [
      mk({ id: 'a', name: 'Alpha 甲', weeklyCompleted: 0, isUnderTarget: true }),
      mk({ id: 'b', name: 'Beta 乙', weeklyCompleted: 1, isUnderTarget: false }),
    ]
    render(<SchedulingResidentTable rows={rows} />)
    expect(screen.getByText('院友本週資助復康次數')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('Alpha 甲')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('Beta 乙')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('共 2 筆')).toBeInstanceOf(HTMLElement)

    fireEvent.change(screen.getByPlaceholderText('搜尋院友姓名'), { target: { value: 'Beta' } })
    expect(screen.getByText('共 1 筆')).toBeInstanceOf(HTMLElement)
    expect(screen.queryByText('Alpha 甲')).toBeNull()
    expect(screen.getByText('Beta 乙')).toBeInstanceOf(HTMLElement)
  })
})
