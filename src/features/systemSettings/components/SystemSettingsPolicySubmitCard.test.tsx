/** @vitest-environment happy-dom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsPolicySubmitCard } from './SystemSettingsPolicySubmitCard'

afterEach(() => {
  cleanup()
})

describe('SystemSettingsPolicySubmitCard', () => {
  it('Edge 模式且 isSubmitting 時提交鈕為 disabled 並顯示提交中 status', () => {
    render(
      <SystemSettingsPolicySubmitCard
        edgeEnabled
        loadError={null}
        isPolicyLoading={false}
        validateErrors={[]}
        submitMessage={null}
        isSubmitting
        onSubmit={vi.fn()}
      />,
    )
    const btn = screen.getByText('提交政策版本', { selector: 'button' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    expect(screen.getByRole('status').textContent).toMatch(/提交政策版本至雲端/)
    expect(document.querySelector('article')?.getAttribute('aria-busy')).toBe('true')
  })

  it('Edge 模式且 isPolicyLoading 時提交鈕為 disabled', () => {
    render(
      <SystemSettingsPolicySubmitCard
        edgeEnabled
        loadError={null}
        isPolicyLoading
        validateErrors={[]}
        submitMessage={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    )
    const btn = screen.getByText('提交政策版本', { selector: 'button' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    expect(screen.getByRole('status').textContent).toMatch(/載入中/)
    expect(document.querySelector('article')?.getAttribute('aria-busy')).toBe('true')
  })

  it('同時 isSubmitting 與 isPolicyLoading 時 status 以提交中為優先', () => {
    render(
      <SystemSettingsPolicySubmitCard
        edgeEnabled
        loadError={null}
        isPolicyLoading
        validateErrors={[]}
        submitMessage={null}
        isSubmitting
        onSubmit={vi.fn()}
      />,
    )
    expect(screen.getByRole('status').textContent).toMatch(/提交政策版本至雲端/)
    expect(document.querySelector('article')?.getAttribute('aria-busy')).toBe('true')
  })

  it('validateErrors 呈現時為 role=alert', () => {
    render(
      <SystemSettingsPolicySubmitCard
        edgeEnabled
        loadError={null}
        isPolicyLoading={false}
        validateErrors={[{ code: 'BAD_DEM_CORE', message: 'weeklyMinSessions 須為非負整數' }]}
        submitMessage={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    )
    expect(screen.getByRole('alert').textContent).toContain('BAD_DEM_CORE')
  })

  it('非載入、非提交中時提交鈕可點', () => {
    render(
      <SystemSettingsPolicySubmitCard
        edgeEnabled
        loadError={null}
        isPolicyLoading={false}
        validateErrors={[]}
        submitMessage={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
      />,
    )
    const btn = screen.getByText('提交政策版本', { selector: 'button' }) as HTMLButtonElement
    expect(btn.disabled).toBe(false)
    expect(screen.queryByRole('status')).toBeNull()
    const busy = document.querySelector('article')?.getAttribute('aria-busy')
    expect(busy === null || busy === 'false').toBe(true)
  })
})
