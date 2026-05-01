import { useAuth } from './useAuth'

/**
 * 審計用 actor：有 Supabase 且已登入時使用 JWT sub；
 * 本機無後端時維持 demo 代號。
 */
export const useAuthActorId = (): string => {
  const { user, isConfigured } = useAuth()
  if (isConfigured && user?.id) {
    return user.id
  }
  return 'TeamLead_demo'
}
