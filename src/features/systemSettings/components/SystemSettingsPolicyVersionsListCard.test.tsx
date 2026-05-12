/** @vitest-environment happy-dom */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsPolicyVersionsListCard } from './SystemSettingsPolicyVersionsListCard'

afterEach(() => {
  cleanup()
})

describe('SystemSettingsPolicyVersionsListCard', () => {
  it('Edge 啟用且 loadError 時顯示引導訊息（與提交卡錯誤同源提示）', () => {
    render(
      <SystemSettingsPolicyVersionsListCard
        edgeEnabled
        loadError="TypeError: failed to fetch"
        isPolicyLoading={false}
        versions={[]}
      />,
    )
    expect(screen.getByRole('heading', { name: '政策版本列表（雲端）' })).toBeTruthy()
    expect(screen.getByRole('status').textContent).toMatch(/無法載入版本列表/)
    expect(screen.queryByRole('button', { name: '重新載入雲端政策' })).toBeNull()
    const busy = document.querySelector('article')?.getAttribute('aria-busy')
    expect(busy === null || busy === 'false').toBe(true)
  })

  it('loadError 且傳入 onReloadPolicy 時顯示重載按鈕並可觸發', () => {
    const onReload = vi.fn()
    render(
      <SystemSettingsPolicyVersionsListCard
        edgeEnabled
        loadError="err"
        isPolicyLoading={false}
        versions={[]}
        onReloadPolicy={onReload}
      />,
    )
    const btn = screen.getByRole('button', { name: '重新載入雲端政策' })
    expect(btn).toBeTruthy()
    btn.click()
    expect(onReload).toHaveBeenCalledTimes(1)
  })

  it('loadError 且 isSubmitting 時重載按鈕 disabled 且不觸發', () => {
    const onReload = vi.fn()
    render(
      <SystemSettingsPolicyVersionsListCard
        edgeEnabled
        loadError="err"
        isPolicyLoading={false}
        isSubmitting
        versions={[]}
        onReloadPolicy={onReload}
      />,
    )
    const btn = screen.getByRole('button', { name: '重新載入雲端政策' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    btn.click()
    expect(onReload).not.toHaveBeenCalled()
    expect(document.querySelector('article')?.getAttribute('aria-busy')).toBe('true')
  })

  it('無 loadError 且 isPolicyLoading 時 article 為 aria-busy', () => {
    render(
      <SystemSettingsPolicyVersionsListCard
        edgeEnabled
        loadError={null}
        isPolicyLoading
        versions={[]}
      />,
    )
    expect(screen.getByText('載入版本列表中…')).toBeTruthy()
    expect(document.querySelector('article')?.getAttribute('aria-busy')).toBe('true')
  })

  it('未啟用 Edge 時不渲染', () => {
    const { container } = render(
      <SystemSettingsPolicyVersionsListCard
        edgeEnabled={false}
        loadError={null}
        isPolicyLoading={false}
        versions={[]}
      />,
    )
    expect(container.querySelector('article')).toBeNull()
  })
})
