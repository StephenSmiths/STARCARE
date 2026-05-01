import type { User } from '@supabase/supabase-js'

export type StarcareRole = 'Admin' | 'TeamLead' | 'Staff'
export type AuthPermission =
  | 'view:dashboard'
  /** PDF 02【2】創建工作計劃（TeamLead／Admin；Staff 不可） */
  | 'view:work-plan-compose'
  /** PDF 02【4】我的工作計劃／團隊計劃 */
  | 'view:work-session-plans'
  /** PDF 02【5】填寫／審核服務表單 */
  | 'view:service-forms'
  /** PDF 02【10】歷史文件（僅 APPROVED） */
  | 'view:historical-documents'
  /** PDF 02【7】智能工作分析／表單審核（TeamLead／Admin） */
  | 'view:work-analysis-review'
  /** PDF 02【11】AI 報告中心（TeamLead／Admin） */
  | 'view:ai-report-center'
  /** PDF 02【14】通知中心 */
  | 'view:notification-center'
  /** PDF 02【15】用戶手冊 */
  | 'view:user-manual'
  /** PDF 02【5b】開工接更 */
  | 'view:shift-start-handover'
  /** PDF 02【6】收工交更 */
  | 'view:shift-end-handover'
  | 'view:scheduling'
  /** PDF 02【8】復康活動追蹤（兩軌） */
  | 'view:rehab-activity-tracking'
  /** PDF 02【9】評估管理（Staff 可登錄無需院友管理頁） */
  | 'view:assessment-management'
  /** PDF 02【16】Seq 29：院舍系統設定（Admin／TeamLead） */
  | 'view:system-settings'
  | 'view:residents'
  | 'view:staff-import'
  | 'view:activity-sessions-import'
  | 'action:approve-form'

const PERMISSIONS_BY_ROLE: Record<StarcareRole, AuthPermission[]> = {
  Admin: [
    'view:dashboard',
    'view:work-plan-compose',
    'view:work-session-plans',
    'view:service-forms',
    'view:historical-documents',
    'view:work-analysis-review',
    'view:ai-report-center',
    'view:notification-center',
    'view:user-manual',
    'view:shift-start-handover',
    'view:shift-end-handover',
    'view:scheduling',
    'view:rehab-activity-tracking',
    'view:assessment-management',
    'view:system-settings',
    'view:residents',
    'view:staff-import',
    'view:activity-sessions-import',
    'action:approve-form',
  ],
  TeamLead: [
    'view:dashboard',
    'view:work-plan-compose',
    'view:work-session-plans',
    'view:service-forms',
    'view:historical-documents',
    'view:work-analysis-review',
    'view:ai-report-center',
    'view:notification-center',
    'view:user-manual',
    'view:shift-start-handover',
    'view:shift-end-handover',
    'view:scheduling',
    'view:rehab-activity-tracking',
    'view:assessment-management',
    'view:system-settings',
    'view:residents',
    'view:staff-import',
    'view:activity-sessions-import',
    'action:approve-form',
  ],
  Staff: [
    'view:dashboard',
    'view:work-session-plans',
    'view:service-forms',
    'view:historical-documents',
    'view:notification-center',
    'view:user-manual',
    'view:shift-start-handover',
    'view:shift-end-handover',
    'view:scheduling',
    'view:rehab-activity-tracking',
    'view:assessment-management',
  ],
}

const toRole = (raw: unknown): StarcareRole | null => {
  if (typeof raw !== 'string') return null
  const normalized = raw.trim().toLowerCase()
  if (normalized === 'admin') return 'Admin'
  if (normalized === 'teamlead' || normalized === 'team_lead') return 'TeamLead'
  if (normalized === 'staff') return 'Staff'
  return null
}

/**
 * 角色來源優先序：
 * 1) app_metadata.starcare_role（Supabase 建議位置）
 * 2) user_metadata.starcare_role（兼容歷史資料）
 * 3) 未設定 Supabase 時回傳 TeamLead（本機 demo）
 * 4) 其餘預設 Staff（最小權限）
 */
export const resolveStarcareRole = (user: User | null, isConfigured: boolean): StarcareRole => {
  const appRole = toRole(user?.app_metadata?.starcare_role)
  if (appRole) return appRole
  const userRole = toRole(user?.user_metadata?.starcare_role)
  if (userRole) return userRole
  if (!isConfigured) return 'TeamLead'
  return 'Staff'
}

export const hasPermission = (role: StarcareRole, permission: AuthPermission): boolean =>
  PERMISSIONS_BY_ROLE[role].includes(permission)

/**
 * 01 §1：Staff 不可審批自己；TeamLead/Admin 亦不可審批自己。
 */
export const canApproveForm = (role: StarcareRole, actorId: string, formOwnerId: string): boolean => {
  if (!hasPermission(role, 'action:approve-form')) return false
  return actorId !== formOwnerId
}
