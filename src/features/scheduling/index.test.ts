/** PDF 02【3】：排班模組公開匯出與實作檔一致（Seq 15 barrel 契約）。 */
import { describe, expect, it } from 'vitest'
import { SchedulingAppLayout, SchedulingDashboard } from './index'
import { SchedulingAppLayout as AppLayoutDirect } from './components/SchedulingAppLayout'
import { SchedulingDashboard as DashboardDirect } from './components/SchedulingDashboard'

describe('features/scheduling index', () => {
  it('SchedulingDashboard 與 components 直引為同一參照', () => {
    expect(SchedulingDashboard).toBe(DashboardDirect)
  })

  it('SchedulingAppLayout 與 components 直引為同一參照', () => {
    expect(SchedulingAppLayout).toBe(AppLayoutDirect)
  })
})
