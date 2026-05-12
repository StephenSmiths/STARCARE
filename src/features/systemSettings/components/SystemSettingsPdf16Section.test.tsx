/** @vitest-environment happy-dom */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SystemSettingsPdf16Section } from './SystemSettingsPdf16Section'

describe('SystemSettingsPdf16Section', () => {
  it('section aria-labelledby 指向 h2 標題 id', () => {
    const { container } = render(
      <SystemSettingsPdf16Section title="智能排班設定" description="說明文字">
        <p>子內容</p>
      </SystemSettingsPdf16Section>,
    )
    const section = container.querySelector('section')
    const labelledBy = section?.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const heading = screen.getByRole('heading', { name: '智能排班設定' })
    expect(heading.tagName.toLowerCase()).toBe('h2')
    expect(heading.id).toBe(labelledBy)
  })
})
