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

afterEach(() => {
  cleanup()
})

describe('SystemSettingsHome', () => {
  it('Pdf16 大節、政策區、審計標題與本機儲存語意可見', () => {
    render(<SystemSettingsHome />)
    expect(screen.getByRole('heading', { name: '智能排班設定' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '復康服務基本設定' })).toBeTruthy()
    expect(screen.getByRole('group', { name: '本機設定（瀏覽器儲存）' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '政策版本（雲端提交）（P1）' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '系統設定與相關審計（全域）' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '儲存設定（本機）' })).toBeTruthy()
  })
})
