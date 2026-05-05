import type { User } from '@supabase/supabase-js'
import type { StarcareRole } from './authPermissionTypes'

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
