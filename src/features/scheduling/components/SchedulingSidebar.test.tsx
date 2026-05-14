/** @vitest-environment happy-dom */
/** PDF 02【3】：排班模組左側導覽（Seq 15；SCHEDULING_NAV_GROUPS 與 useAuth）。 */
import type { User } from '@supabase/supabase-js'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthContextValue } from '../../auth/context/authContext'
import { SchedulingSidebar } from './SchedulingSidebar'

vi.mock('../../auth', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../../auth'

const buildAuth = (overrides: Partial<AuthContextValue>): AuthContextValue => ({
  session: null,
  user: null,
  role: 'Staff',
  isLoading: false,
  isConfigured: false,
  hasPermission: () => false,
  canApproveForm: () => false,
  signIn: async () => ({ error: null }),
  signOut: vi.fn(async () => {}),
  ...overrides,
})

afterEach(() => {
  cleanup()
})

describe('SchedulingSidebar', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(
      buildAuth({
        user: { email: 'nurse@facility.example' } as User,
        role: 'TeamLead',
        isConfigured: true,
        hasPermission: () => true,
      }),
    )
  })

  it('導覽連結點擊會呼叫 onRequestClose', () => {
    const onRequestClose = vi.fn()
    render(<SchedulingSidebar isMobileOpen={false} onRequestClose={onRequestClose} />)
    fireEvent.click(screen.getByRole('link', { name: '儀表盤' }))
    expect(onRequestClose).toHaveBeenCalledTimes(1)
  })

  it('已設定帳號時顯示 email 與登出', () => {
    const signOut = vi.fn(async () => {})
    vi.mocked(useAuth).mockReturnValue(
      buildAuth({
        user: { email: 'admin@facility.example' } as User,
        role: 'Admin',
        isConfigured: true,
        hasPermission: () => true,
        signOut,
      }),
    )
    render(<SchedulingSidebar isMobileOpen={false} onRequestClose={vi.fn()} />)
    expect(screen.getByText('admin@facility.example')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/角色：Admin/)).toBeInstanceOf(HTMLElement)
    fireEvent.click(screen.getByRole('button', { name: '登出' }))
    expect(signOut).toHaveBeenCalledTimes(1)
  })
})
