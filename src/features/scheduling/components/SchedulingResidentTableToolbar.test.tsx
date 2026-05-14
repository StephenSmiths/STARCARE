/** @vitest-environment happy-dom */
/** PDF 02【3】：排班院友表工具列（Seq 15）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SchedulingResidentTableToolbar } from './SchedulingResidentTableToolbar'

afterEach(() => {
  cleanup()
})

const base = {
  keyword: '',
  setKeyword: vi.fn(),
  resetPage: vi.fn(),
  statusFilter: 'all' as const,
  setStatusFilter: vi.fn(),
  pageSize: 20,
  setPageSize: vi.fn(),
  filteredCount: 12,
}

describe('SchedulingResidentTableToolbar', () => {
  it('顯示篩選後筆數', () => {
    render(<SchedulingResidentTableToolbar {...base} />)
    expect(screen.getByText('共 12 筆')).toBeInstanceOf(HTMLElement)
  })

  it('輸入關鍵字時呼叫 setKeyword 與 resetPage', () => {
    render(<SchedulingResidentTableToolbar {...base} />)
    fireEvent.change(screen.getByPlaceholderText('搜尋院友姓名'), { target: { value: '王' } })
    expect(base.setKeyword).toHaveBeenCalledWith('王')
    expect(base.resetPage).toHaveBeenCalled()
  })

  it('變更狀態篩選時呼叫 setStatusFilter 與 resetPage', () => {
    render(<SchedulingResidentTableToolbar {...base} />)
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'under-target' } })
    expect(base.setStatusFilter).toHaveBeenCalledWith('under-target')
    expect(base.resetPage).toHaveBeenCalled()
  })

  it('變更每頁筆數時呼叫 setPageSize 與 resetPage', () => {
    render(<SchedulingResidentTableToolbar {...base} />)
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: '50' } })
    expect(base.setPageSize).toHaveBeenCalledWith(50)
    expect(base.resetPage).toHaveBeenCalled()
  })
})
