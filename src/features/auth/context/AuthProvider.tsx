import { useCallback, useMemo, type ReactNode } from 'react'
import { getBrowserSupabaseClient } from '../supabaseBrowserClient'
import { canApproveForm, hasPermission, resolveStarcareRole } from '../permissions'
import { useAuthAuditTrailPersistenceEffect } from '../hooks/useAuthAuditTrailPersistenceEffect'
import { useAuthEdgeAccessTokenEffect } from '../hooks/useAuthEdgeAccessTokenEffect'
import { useAuthHydrateAuditTrailEffect } from '../hooks/useAuthHydrateAuditTrailEffect'
import { useAuthSupabaseSession } from '../hooks/useAuthSupabaseSession'
import { AuthContext, type AuthContextValue } from './authContext'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = useMemo(() => getBrowserSupabaseClient(), [])
  const isConfigured = Boolean(supabase)
  const { session, isLoading } = useAuthSupabaseSession(supabase)

  useAuthAuditTrailPersistenceEffect(supabase)
  useAuthHydrateAuditTrailEffect(supabase, session)
  useAuthEdgeAccessTokenEffect(supabase)

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      if (!supabase) {
        return { error: '未設定 Supabase 環境變數' }
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message ?? null }
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    if (!supabase) {
      return
    }
    await supabase.auth.signOut()
  }, [supabase])

  const role = useMemo(
    () => resolveStarcareRole(session?.user ?? null, isConfigured),
    [session?.user, isConfigured],
  )
  const hasPermissionByRole = useCallback(
    (permission: Parameters<typeof hasPermission>[1]) => hasPermission(role, permission),
    [role],
  )
  const canApproveByRole = useCallback(
    (actorId: string, formOwnerId: string) => canApproveForm(role, actorId, formOwnerId),
    [role],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      role,
      isLoading,
      isConfigured,
      hasPermission: hasPermissionByRole,
      canApproveForm: canApproveByRole,
      signIn,
      signOut,
    }),
    [
      session,
      role,
      isLoading,
      isConfigured,
      hasPermissionByRole,
      canApproveByRole,
      signIn,
      signOut,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
