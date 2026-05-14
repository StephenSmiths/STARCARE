/** @vitest-environment happy-dom */
/** PDF 02【3】：主視圖 scheduling 與 view:scheduling 閉環（Seq 15；Suspense／lazy）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AuthPermission } from '../features/auth/permissions'

vi.mock('../features/scheduling', () => ({
  SchedulingDashboard: () => <div data-testid="scheduling-dashboard-smoke">智能排班</div>,
}))

import { AppMainViews } from './AppMainViews'

afterEach(() => {
  cleanup()
})

describe('AppMainViews（排班）', () => {
  it('effectiveView 為 scheduling 且有 view:scheduling 時掛載 SchedulingDashboard（lazy）', async () => {
    const hasPermission = (p: AuthPermission) => p === 'view:scheduling'
    render(<AppMainViews effectiveView="scheduling" hasPermission={hasPermission} />)
    expect(await screen.findByTestId('scheduling-dashboard-smoke')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('智能排班')).toBeInstanceOf(HTMLElement)
  })

  it('effectiveView 為 scheduling 但無權限時不掛載排班', () => {
    const hasPermission = () => false
    render(<AppMainViews effectiveView="scheduling" hasPermission={hasPermission} />)
    expect(screen.queryByTestId('scheduling-dashboard-smoke')).toBeNull()
  })

  it('非 scheduling 視圖時即使僅擁有 view:scheduling 也不掛載排班', () => {
    const hasPermission = (p: AuthPermission) => p === 'view:scheduling'
    render(<AppMainViews effectiveView="residents" hasPermission={hasPermission} />)
    expect(screen.queryByTestId('scheduling-dashboard-smoke')).toBeNull()
  })
})
