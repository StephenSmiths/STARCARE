/** @vitest-environment happy-dom */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListSectionPanel } from './ListSectionPanel'

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
})
