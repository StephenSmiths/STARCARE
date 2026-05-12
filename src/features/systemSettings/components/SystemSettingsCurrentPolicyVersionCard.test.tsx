/** @vitest-environment happy-dom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsCurrentPolicyVersionCard } from './SystemSettingsCurrentPolicyVersionCard'

afterEach(() => {
  cleanup()
})

describe('SystemSettingsCurrentPolicyVersionCard', () => {
  it('isPolicyLoading 時 article 為 aria-busy', () => {
    render(
      <SystemSettingsCurrentPolicyVersionCard
        edgeEnabled
        loadError={null}
        isPolicyLoading
        version={null}
      />,
    )
    expect(screen.getByRole('heading', { name: '目前政策版本（雲端摘要）' })).toBeTruthy()
    expect(document.querySelector('article')?.getAttribute('aria-busy')).toBe('true')
  })

  it('loadError 且 isSubmitting 時 aria-busy 為 true', () => {
    render(
      <SystemSettingsCurrentPolicyVersionCard
        edgeEnabled
        loadError="err"
        isPolicyLoading={false}
        isSubmitting
        version={null}
        onReloadPolicy={vi.fn()}
      />,
    )
    expect(document.querySelector('article')?.getAttribute('aria-busy')).toBe('true')
  })

  it('載入完成且無錯誤時 aria-busy 不為 true', () => {
    render(
      <SystemSettingsCurrentPolicyVersionCard
        edgeEnabled
        loadError={null}
        isPolicyLoading={false}
        version={null}
      />,
    )
    const busy = document.querySelector('article')?.getAttribute('aria-busy')
    expect(busy === null || busy === 'false').toBe(true)
  })
})
