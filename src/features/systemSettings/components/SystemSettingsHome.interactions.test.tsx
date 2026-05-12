/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SystemSettingsHome } from './SystemSettingsHome'

vi.mock('../../auth', () => ({
  useAuth: () => ({ user: { id: 'vitest-actor' } }),
}))

vi.mock('../../shared/hooks/useAuditTrailList', () => ({
  useAuditTrailList: () => [],
}))

vi.mock('../../../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: () => null,
}))

afterEach(() => {
  cleanup()
})

describe('SystemSettingsHome interactions', () => {
  it('審計面板可展開與收回', () => {
    const { container } = render(<SystemSettingsHome />)
    const auditH3 = screen.getByRole('heading', { name: '系統設定與相關審計（全域）' }) as HTMLElement
    const auditSection = container.querySelector(`section[aria-labelledby="${auditH3.id}"]`) as HTMLElement
    expect(auditSection).not.toBeNull()
    const expandAudit = within(auditSection).getByRole('button', { name: '展開審計' })
    const auditRegionId = expandAudit.getAttribute('aria-controls')
    expect(auditRegionId).toBeTruthy()
    const auditRegion = document.getElementById(auditRegionId!) as HTMLElement
    expect(auditRegion.hasAttribute('hidden')).toBe(true)
    expect(screen.queryByPlaceholderText('搜尋 actor / entity / detail')).toBeNull()
    fireEvent.click(expandAudit)
    expect(within(auditSection).getByRole('button', { name: '收合審計' })).toBeTruthy()
    expect(auditRegion.hasAttribute('hidden')).toBe(false)
    expect(screen.getByPlaceholderText('搜尋 actor / entity / detail')).toBeTruthy()
    fireEvent.click(within(auditSection).getByRole('button', { name: '收合審計' }))
    expect(within(auditSection).getByRole('button', { name: '展開審計' })).toBeTruthy()
    expect(auditRegion.hasAttribute('hidden')).toBe(true)
    expect(screen.queryByPlaceholderText('搜尋 actor / entity / detail')).toBeNull()
  })

  it('資助復康 panel 可展開並顯示 Special Care 說明', () => {
    const { container } = render(<SystemSettingsHome />)
    const rehabH2 = screen.getByRole('heading', { name: '復康服務基本設定' }) as HTMLElement
    const rehabPdfSection = container.querySelector(`section[aria-labelledby="${rehabH2.id}"]`) as HTMLElement
    const subsidizedH3 = screen.getByRole('heading', { name: '資助復康服務與認知障礙症服務（P1）' }) as HTMLElement
    const subsidizedPanel = rehabPdfSection.querySelector(
      `section[aria-labelledby="${subsidizedH3.id}"]`,
    ) as HTMLElement
    expect(screen.queryByText(/Special Care 僅由治療師承接/)).toBeNull()
    fireEvent.click(within(subsidizedPanel).getByRole('button', { name: '展開' }))
    expect(screen.getByText(/Special Care 僅由治療師承接/)).toBeTruthy()
    const collapseSub = within(subsidizedPanel).getByRole('button', { name: '收合' })
    const subContentId = collapseSub.getAttribute('aria-controls')
    expect(subContentId).toBeTruthy()
    expect(document.getElementById(subContentId!)?.hasAttribute('hidden')).toBe(false)
  })

  it('政策版本 panel 可收合與再展開', () => {
    const { container } = render(<SystemSettingsHome />)
    const policyH2 = screen.getByRole('heading', { name: '政策版本（雲端提交）（P1）' }) as HTMLElement
    const policyPanel = container.querySelector(`section[aria-labelledby="${policyH2.id}"]`) as HTMLElement
    const collapsePolicy = within(policyPanel).getByRole('button', { name: '收合' })
    const policyContentId = collapsePolicy.getAttribute('aria-controls')
    expect(policyContentId).toBeTruthy()
    const policyRegion = document.getElementById(policyContentId!) as HTMLElement
    expect(policyRegion.hasAttribute('hidden')).toBe(false)
    fireEvent.click(collapsePolicy)
    expect(within(policyPanel).getByRole('button', { name: '展開' })).toBeTruthy()
    expect(policyRegion.hasAttribute('hidden')).toBe(true)
    fireEvent.click(within(policyPanel).getByRole('button', { name: '展開' }))
    expect(within(policyPanel).getByRole('button', { name: '收合' })).toBeTruthy()
    expect(policyRegion.hasAttribute('hidden')).toBe(false)
  })
})
