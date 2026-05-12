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
    render(<SystemSettingsHome />)
    expect(screen.getByRole('heading', { name: '智能排班設定' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '復康服務基本設定' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '排班時間設定' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '排班規則設定（P1）' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '資助復康服務與認知障礙症服務（P1）' })).toBeTruthy()
    const localGroup = screen.getByRole('group', { name: '本機設定（瀏覽器儲存）' })
    expect(localGroup).toBeTruthy()
    expect(localGroup.getAttribute('aria-busy')).toBe('false')
    expect(screen.getByRole('heading', { name: '政策版本（雲端提交）（P1）' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '系統設定與相關審計（全域）' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '儲存設定（本機）' })).toBeTruthy()
    expect(screen.getByText(/未偵測到 Supabase 環境變數/)).toBeTruthy()
  })
})
