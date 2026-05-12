/** @vitest-environment happy-dom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsPolicySubmitCard } from './SystemSettingsPolicySubmitCard'

afterEach(() => {
  cleanup()
})

describe('SystemSettingsPolicySubmitCard', () => {
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
  })
})
