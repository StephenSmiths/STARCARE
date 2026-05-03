import type { User } from '@supabase/supabase-js'

/**
 * 將登入身分對應至 staff_profiles.id，供「我的工作計劃」／服務表單篩選。
 * 優先序：user_metadata → app_metadata → JWT sub（若後端將 profile id 設為與 user id 一致）。
 * 未登入且 **未設定 Supabase**（本機 demo／Playwright）：回傳 `staff-ot-1`，與 `schedulingSessionRepository` 預設時段一致（Seq 3）。
 */
export const resolveStaffProfileIdForWorkPlans = (user: User | null, isConfigured: boolean): string | null => {
  if (user) {
    const fromUserMeta =
      typeof user.user_metadata?.starcare_staff_profile_id === 'string'
        ? user.user_metadata.starcare_staff_profile_id.trim()
        : ''
    if (fromUserMeta) return fromUserMeta
    const fromAppMeta =
      typeof user.app_metadata?.starcare_staff_profile_id === 'string'
        ? user.app_metadata.starcare_staff_profile_id.trim()
        : ''
    if (fromAppMeta) return fromAppMeta
    return user.id ?? null
  }
  if (!isConfigured) return 'staff-ot-1'
  return null
}
