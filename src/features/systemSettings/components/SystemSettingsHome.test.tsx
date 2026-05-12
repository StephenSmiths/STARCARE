/** @vitest-environment happy-dom */
import { cleanup, render, screen, within } from '@testing-library/react'
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

describe('SystemSettingsHome', () => {
  it('Pdf16 大節、清單小節、政策區、審計與本機儲存語意可見', () => {
    const { container } = render(<SystemSettingsHome />)
    const expectSectionForHeading = (heading: HTMLElement) => {
      expect(heading.id).toBeTruthy()
      expect(container.querySelector(`section[aria-labelledby="${heading.id}"]`)).not.toBeNull()
    }
    const schedulingH2 = screen.getByRole('heading', { name: '智能排班設定' }) as HTMLElement
    const rehabH2 = screen.getByRole('heading', { name: '復康服務基本設定' }) as HTMLElement
    expectSectionForHeading(schedulingH2)
    expectSectionForHeading(rehabH2)
    const schedulingPdfSection = container.querySelector(
      `section[aria-labelledby="${schedulingH2.id}"]`,
    ) as HTMLElement
    const rehabPdfSection = container.querySelector(`section[aria-labelledby="${rehabH2.id}"]`) as HTMLElement
    expect(schedulingPdfSection).not.toBeNull()
    expect(rehabPdfSection).not.toBeNull()
    const scheduleTimeH3 = screen.getByRole('heading', { name: '排班時間設定' }) as HTMLElement
    const rulesH3 = screen.getByRole('heading', { name: '排班規則設定（P1）' }) as HTMLElement
    const subsidizedH3 = screen.getByRole('heading', { name: '資助復康服務與認知障礙症服務（P1）' }) as HTMLElement
    const schedulePanel = schedulingPdfSection.querySelector(
      `section[aria-labelledby="${scheduleTimeH3.id}"]`,
    )
    const rulesPanel = schedulingPdfSection.querySelector(`section[aria-labelledby="${rulesH3.id}"]`)
    const subsidizedPanel = rehabPdfSection.querySelector(`section[aria-labelledby="${subsidizedH3.id}"]`)
    expect(schedulePanel).not.toBeNull()
    expect(rulesPanel).not.toBeNull()
    expect(subsidizedPanel).not.toBeNull()
    const scheduleCollapse = within(schedulePanel as HTMLElement).getByRole('button', { name: '收合' })
    const rulesCollapse = within(rulesPanel as HTMLElement).getByRole('button', { name: '收合' })
    const expandSub = within(subsidizedPanel as HTMLElement).getByRole('button', { name: '展開' })
    const scheduleContentId = scheduleCollapse.getAttribute('aria-controls')
    const rulesContentId = rulesCollapse.getAttribute('aria-controls')
    expect(scheduleContentId).toBeTruthy()
    expect(rulesContentId).toBeTruthy()
    expect(scheduleContentId).not.toBe(rulesContentId)
    expect(document.getElementById(scheduleContentId!)?.hasAttribute('hidden')).toBe(false)
    expect(document.getElementById(rulesContentId!)?.hasAttribute('hidden')).toBe(false)
    const subsidizedContentId = expandSub.getAttribute('aria-controls')
    expect(subsidizedContentId).toBeTruthy()
    expect(subsidizedContentId).not.toBe(scheduleContentId)
    expect(document.getElementById(subsidizedContentId!)?.hasAttribute('hidden')).toBe(true)
    const localGroup = screen.getByRole('group', { name: '本機設定（瀏覽器儲存）' })
    expect(localGroup).toBeTruthy()
    expect(localGroup.getAttribute('aria-busy')).toBe('false')
    const policyH2 = screen.getByRole('heading', { name: '政策版本（雲端提交）（P1）' }) as HTMLElement
    expectSectionForHeading(policyH2)
    const policyPanel = container.querySelector(`section[aria-labelledby="${policyH2.id}"]`) as HTMLElement
    const policyCollapse = within(policyPanel).getByRole('button', { name: '收合' })
    const policyContentId = policyCollapse.getAttribute('aria-controls')
    expect(policyContentId).toBeTruthy()
    expect(document.getElementById(policyContentId!)?.hasAttribute('hidden')).toBe(false)
    const auditH3 = screen.getByRole('heading', { name: '系統設定與相關審計（全域）' }) as HTMLElement
    expectSectionForHeading(auditH3)
    const auditSection = container.querySelector(`section[aria-labelledby="${auditH3.id}"]`) as HTMLElement
    expect(auditSection).not.toBeNull()
    const expandAudit = within(auditSection).getByRole('button', { name: '展開審計' })
    const auditContentId = expandAudit.getAttribute('aria-controls')
    expect(auditContentId).toBeTruthy()
    expect(document.getElementById(auditContentId!)?.hasAttribute('hidden')).toBe(true)
    expect(screen.getByRole('button', { name: '儲存設定（本機）' })).toBeTruthy()
    expect(screen.getByText(/未偵測到 Supabase 環境變數/)).toBeTruthy()
  })
})
