/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ListSectionPanel } from './ListSectionPanel'

afterEach(() => {
  cleanup()
})

describe('ListSectionPanel', () => {
  it('section aria-labelledby 指向標題 id', () => {
    const { container } = render(
      <ListSectionPanel title="測試標題">
        <p>內文</p>
      </ListSectionPanel>,
    )
    const section = container.querySelector('section')
    const labelledBy = section?.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const heading = screen.getByRole('heading', { name: '測試標題' })
    expect(heading.id).toBe(labelledBy)
  })

  it('titleHeadingLevel 為 3 時仍關聯同一 id', () => {
    render(
      <ListSectionPanel title="小節" titleHeadingLevel={3}>
        <span>子</span>
      </ListSectionPanel>,
    )
    const heading = screen.getByRole('heading', { name: '小節' })
    expect(heading.tagName.toLowerCase()).toBe('h3')
    const section = heading.closest('section')
    expect(section?.getAttribute('aria-labelledby')).toBe(heading.id)
  })

  it('展開鈕 aria-controls 指向內容區；收合後內容區 hidden', () => {
    const { container } = render(
      <ListSectionPanel title="可摺疊">
        <p>內文</p>
      </ListSectionPanel>,
    )
    const section = container.querySelector('section')
    expect(section).toBeTruthy()
    const toggle = within(section as HTMLElement).getByRole('button', { name: '收合' })
    const controls = toggle.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    const region = section?.querySelector(`[id="${controls}"]`)
    expect(region).toBeTruthy()
    expect(region?.hasAttribute('hidden')).toBe(false)
    fireEvent.click(toggle)
    const expandBtn = within(section as HTMLElement).getByRole('button', { name: '展開' })
    expect(expandBtn.getAttribute('aria-expanded')).toBe('false')
    const collapsed = section?.querySelector(`[id="${controls}"]`)
    expect(collapsed?.hasAttribute('hidden')).toBe(true)
  })
})
