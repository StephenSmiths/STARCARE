/** @vitest-environment happy-dom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SystemSettingsPdf16Section } from './SystemSettingsPdf16Section'

afterEach(() => {
  cleanup()
})

describe('SystemSettingsPdf16Section', () => {
  it('智能排班設定：section aria-labelledby 指向 h2 標題 id', () => {
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
    expect(screen.getByText('說明文字')).toBeTruthy()
  })

  it('可選 alignmentNote：呈現於說明下方', () => {
    render(
      <SystemSettingsPdf16Section title="智能排班設定" description="短說明" alignmentNote={<span>對照小貼士</span>}>
        <p>子</p>
      </SystemSettingsPdf16Section>,
    )
    expect(screen.getByText('短說明')).toBeTruthy()
    expect(screen.getByRole('note')).toBeTruthy()
    expect(screen.getByText('對照小貼士')).toBeTruthy()
  })

  it('復康服務基本設定：section aria-labelledby 指向 h2 標題 id', () => {
    const { container } = render(
      <SystemSettingsPdf16Section title="復康服務基本設定" description="說明文字">
        <p>子內容</p>
      </SystemSettingsPdf16Section>,
    )
    const section = container.querySelector('section')
    const labelledBy = section?.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const heading = screen.getByRole('heading', { name: '復康服務基本設定' })
    expect(heading.tagName.toLowerCase()).toBe('h2')
    expect(heading.id).toBe(labelledBy)
    expect(screen.getByText('說明文字')).toBeTruthy()
  })
})
