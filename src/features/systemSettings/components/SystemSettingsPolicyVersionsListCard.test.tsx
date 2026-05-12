/** @vitest-environment happy-dom */
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SystemSettingsPolicyVersionsListCard } from './SystemSettingsPolicyVersionsListCard'

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
