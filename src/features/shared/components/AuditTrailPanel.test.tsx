/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { AuditTrailRecord } from '../../../services/auditTrailService'
import { AuditTrailPanel } from './AuditTrailPanel'

const emptyTrail: AuditTrailRecord[] = []

afterEach(() => {
  cleanup()
})

describe('AuditTrailPanel', () => {
  it('section aria-labelledby 指向標題 h3 id', () => {
    const { container } = render(
      <AuditTrailPanel title="系統設定與相關審計（全域）" auditTrail={emptyTrail} />,
    )
    const section = container.querySelector('section')
    const labelledBy = section?.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const heading = screen.getByRole('heading', { name: '系統設定與相關審計（全域）' })
    expect(heading.tagName.toLowerCase()).toBe('h3')
    expect(heading.id).toBe(labelledBy)
  })

  it('同頁兩個實例時標題 id 不重複', () => {
    render(
      <div>
        <AuditTrailPanel title="審計 A" auditTrail={emptyTrail} />
        <AuditTrailPanel title="審計 B" auditTrail={emptyTrail} />
      </div>,
    )
    const a = screen.getByRole('heading', { name: '審計 A' })
    const b = screen.getByRole('heading', { name: '審計 B' })
    expect(a.id).toBeTruthy()
    expect(b.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
  })

  it('展開審計鈕 aria-controls 指向內容區；展開後可見篩選、收合後 hidden', () => {
    const { container } = render(<AuditTrailPanel title="審計區" auditTrail={emptyTrail} />)
    const section = container.querySelector('section')
    expect(section).toBeTruthy()
    const toggle = within(section as HTMLElement).getByRole('button', { name: '展開審計' })
    const controls = toggle.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    const region = section?.querySelector(`[id="${controls}"]`)
    expect(region?.hasAttribute('hidden')).toBe(true)
    fireEvent.click(toggle)
    expect(within(section as HTMLElement).getByRole('button', { name: '收合審計' }).getAttribute('aria-expanded')).toBe(
      'true',
    )
    expect(region?.hasAttribute('hidden')).toBe(false)
    expect(
      within(section as HTMLElement).queryByPlaceholderText('搜尋 actor / entity / detail'),
    ).not.toBeNull()
    fireEvent.click(within(section as HTMLElement).getByRole('button', { name: '收合審計' }))
    expect(within(section as HTMLElement).getByRole('button', { name: '展開審計' }).getAttribute('aria-expanded')).toBe(
      'false',
    )
    expect(section?.querySelector(`[id="${controls}"]`)?.hasAttribute('hidden')).toBe(true)
  })

  it('defaultExpanded 為 true 時篩選列一開始即掛載', () => {
    render(<AuditTrailPanel title="預設展開" auditTrail={emptyTrail} defaultExpanded />)
    const section = screen.getByRole('heading', { name: '預設展開' }).closest('section') as HTMLElement
    expect(within(section).getByPlaceholderText('搜尋 actor / entity / detail')).toBeTruthy()
    expect(within(section).getByRole('button', { name: '收合審計' }).getAttribute('aria-expanded')).toBe('true')
  })
})
