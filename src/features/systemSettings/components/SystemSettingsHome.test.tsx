/** @vitest-environment happy-dom */
import { cleanup, render, screen } from '@testing-library/react'
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
    expect(schedulingPdfSection.querySelector(`section[aria-labelledby="${scheduleTimeH3.id}"]`)).not.toBeNull()
    expect(schedulingPdfSection.querySelector(`section[aria-labelledby="${rulesH3.id}"]`)).not.toBeNull()
    expect(rehabPdfSection.querySelector(`section[aria-labelledby="${subsidizedH3.id}"]`)).not.toBeNull()
    const localGroup = screen.getByRole('group', { name: '本機設定（瀏覽器儲存）' })
    expect(localGroup).toBeTruthy()
    expect(localGroup.getAttribute('aria-busy')).toBe('false')
    expectSectionForHeading(screen.getByRole('heading', { name: '政策版本（雲端提交）（P1）' }) as HTMLElement)
    expectSectionForHeading(screen.getByRole('heading', { name: '系統設定與相關審計（全域）' }) as HTMLElement)
    expect(screen.getByRole('button', { name: '儲存設定（本機）' })).toBeTruthy()
    expect(screen.getByText(/未偵測到 Supabase 環境變數/)).toBeTruthy()
  })
})
