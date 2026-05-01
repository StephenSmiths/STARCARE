import { describe, expect, it } from 'vitest'
import type { User } from '@supabase/supabase-js'
import { canApproveForm, hasPermission, resolveStarcareRole } from './permissions'

const makeUser = (options: { appRole?: string; userRole?: string; id?: string } = {}): User =>
  ({
    id: options.id ?? 'user-1',
    app_metadata: options.appRole ? { starcare_role: options.appRole } : {},
    user_metadata: options.userRole ? { starcare_role: options.userRole } : {},
  }) as User

describe('auth permissions (RBAC)', () => {
  it('優先讀取 app_metadata.starcare_role，再回退 user_metadata', () => {
    const appRoleUser = makeUser({ appRole: 'admin', userRole: 'staff' })
    const userRoleUser = makeUser({ userRole: 'teamlead' })
    expect(resolveStarcareRole(appRoleUser, true)).toBe('Admin')
    expect(resolveStarcareRole(userRoleUser, true)).toBe('TeamLead')
  })

  it('未設定 Supabase 時回傳 TeamLead；其餘未知值回退 Staff', () => {
    expect(resolveStarcareRole(null, false)).toBe('TeamLead')
    expect(resolveStarcareRole(makeUser({ appRole: 'unknown-role' }), true)).toBe('Staff')
  })

  it('Staff 可查看儀表盤與排班；Admin 可查看全部主要入口', () => {
    expect(hasPermission('Staff', 'view:dashboard')).toBe(true)
    expect(hasPermission('Staff', 'view:work-plan-compose')).toBe(false)
    expect(hasPermission('Staff', 'view:work-session-plans')).toBe(true)
    expect(hasPermission('Staff', 'view:service-forms')).toBe(true)
    expect(hasPermission('Staff', 'view:historical-documents')).toBe(true)
    expect(hasPermission('Admin', 'view:historical-documents')).toBe(true)
    expect(hasPermission('Staff', 'view:work-analysis-review')).toBe(false)
    expect(hasPermission('Staff', 'view:ai-report-center')).toBe(false)
    expect(hasPermission('TeamLead', 'view:ai-report-center')).toBe(true)
    expect(hasPermission('Admin', 'view:ai-report-center')).toBe(true)
    expect(hasPermission('Staff', 'view:notification-center')).toBe(true)
    expect(hasPermission('TeamLead', 'view:notification-center')).toBe(true)
    expect(hasPermission('Admin', 'view:notification-center')).toBe(true)
    expect(hasPermission('Staff', 'view:user-manual')).toBe(true)
    expect(hasPermission('TeamLead', 'view:user-manual')).toBe(true)
    expect(hasPermission('Admin', 'view:user-manual')).toBe(true)
    expect(hasPermission('TeamLead', 'view:work-analysis-review')).toBe(true)
    expect(hasPermission('Staff', 'view:shift-start-handover')).toBe(true)
    expect(hasPermission('Staff', 'view:shift-end-handover')).toBe(true)
    expect(hasPermission('Staff', 'view:scheduling')).toBe(true)
    expect(hasPermission('Staff', 'view:rehab-activity-tracking')).toBe(true)
    expect(hasPermission('Staff', 'view:assessment-management')).toBe(true)
    expect(hasPermission('Staff', 'view:system-settings')).toBe(false)
    expect(hasPermission('TeamLead', 'view:system-settings')).toBe(true)
    expect(hasPermission('Admin', 'view:system-settings')).toBe(true)
    expect(hasPermission('TeamLead', 'view:assessment-management')).toBe(true)
    expect(hasPermission('Admin', 'view:assessment-management')).toBe(true)
    expect(hasPermission('Admin', 'view:rehab-activity-tracking')).toBe(true)
    expect(hasPermission('Staff', 'view:residents')).toBe(false)
    expect(hasPermission('TeamLead', 'view:work-session-plans')).toBe(true)
    expect(hasPermission('TeamLead', 'view:work-plan-compose')).toBe(true)
    expect(hasPermission('Admin', 'view:dashboard')).toBe(true)
    expect(hasPermission('Admin', 'view:work-session-plans')).toBe(true)
    expect(hasPermission('Admin', 'view:service-forms')).toBe(true)
    expect(hasPermission('Admin', 'view:work-plan-compose')).toBe(true)
    expect(hasPermission('Admin', 'view:scheduling')).toBe(true)
    expect(hasPermission('Admin', 'view:residents')).toBe(true)
    expect(hasPermission('Admin', 'view:staff-import')).toBe(true)
    expect(hasPermission('Admin', 'view:activity-sessions-import')).toBe(true)
  })

  it('審批規則：需有審批權限且不可審批自己', () => {
    expect(canApproveForm('Staff', 'staff-1', 'staff-2')).toBe(false)
    expect(canApproveForm('TeamLead', 'lead-1', 'staff-2')).toBe(true)
    expect(canApproveForm('TeamLead', 'lead-1', 'lead-1')).toBe(false)
    expect(canApproveForm('Admin', 'admin-1', 'admin-1')).toBe(false)
  })
})
