import type { User } from '@supabase/supabase-js'

/**
 * 將登入身分對應至 staff_profiles.id，供「我的工作計劃」篩選。
 * 優先序：user_metadata → app_metadata → JWT sub（若後端將 profile id 設為與 user id 一致）。
 */
export const resolveStaffProfileIdForWorkPlans = (user: User | null): string | null => {
  if (!user) return null
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
