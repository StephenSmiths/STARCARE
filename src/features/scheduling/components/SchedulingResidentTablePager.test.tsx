/** @vitest-environment happy-dom */
/** PDF 02【3】：排班院友表分頁（Seq 15）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { SchedulingResidentTablePager } from './SchedulingResidentTablePager'

afterEach(() => {
  cleanup()
})

const PagerHarness = ({ initialPage, pageCount }: { initialPage: number; pageCount: number }) => {
  const [page, setPage] = useState(initialPage)
  return (
    <>
      <SchedulingResidentTablePager safePage={page} pageCount={pageCount} setPage={setPage} />
      <span data-testid="page-state">{page}</span>
    </>
  )
}

describe('SchedulingResidentTablePager', () => {
  it('第一頁時「上一頁」disabled', () => {
    render(<PagerHarness initialPage={1} pageCount={3} />)
    expect((screen.getByRole('button', { name: '上一頁' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: '下一頁' }) as HTMLButtonElement).disabled).toBe(false)
    expect(screen.getByText('第 1 / 3 頁')).toBeInstanceOf(HTMLElement)
  })

  it('最末頁時「下一頁」disabled', () => {
    render(<PagerHarness initialPage={3} pageCount={3} />)
    expect((screen.getByRole('button', { name: '上一頁' }) as HTMLButtonElement).disabled).toBe(false)
    expect((screen.getByRole('button', { name: '下一頁' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('上一頁／下一頁會更新頁碼', () => {
    render(<PagerHarness initialPage={2} pageCount={3} />)
    fireEvent.click(screen.getByRole('button', { name: '上一頁' }))
    expect(screen.getByTestId('page-state').textContent).toBe('1')
    fireEvent.click(screen.getByRole('button', { name: '下一頁' }))
    expect(screen.getByTestId('page-state').textContent).toBe('2')
  })
})
