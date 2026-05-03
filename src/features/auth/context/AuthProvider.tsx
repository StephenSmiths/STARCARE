import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { createAuditTrailRepository } from '../../../repositories/auditTrailRepository'
import { registerEdgeAccessTokenGetter } from '../../../repositories/edgeAuth'
import { hydrateAuditTrailFromRemote } from '../../../services/auditTrailHydrationService'
import { registerAuditTrailPersistence } from '../../../services/auditTrailService'
import { getBrowserSupabaseClient } from '../supabaseBrowserClient'
import { canApproveForm, hasPermission, resolveStarcareRole } from '../permissions'
import { AuthContext, type AuthContextValue } from './authContext'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = useMemo(() => getBrowserSupabaseClient(), [])
  const isConfigured = Boolean(supabase)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(supabase))

  useEffect(() => {
    if (!supabase) {
      registerAuditTrailPersistence(null)
      return () => {
        registerAuditTrailPersistence(null)
      }
    }
    const repo = createAuditTrailRepository()
    registerAuditTrailPersistence((e) => repo.append(e))
    return () => {
      registerAuditTrailPersistence(null)
    }
  }, [supabase])

  useEffect(() => {
    if (!supabase) {
      return
    }
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
      setIsLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, next) => {
      setSession(next)
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    if (!supabase || !session) return
    queueMicrotask(() => {
      void hydrateAuditTrailFromRemote()
    })
  }, [supabase, session])

  useLayoutEffect(() => {
    if (!supabase) {
      registerEdgeAccessTokenGetter(null)
      return () => {
        registerEdgeAccessTokenGetter(null)
      }
    }
    registerEdgeAccessTokenGetter(async () => {
      const { data } = await supabase.auth.getSession()
      return data.session?.access_token ?? null
    })
    return () => {
      registerEdgeAccessTokenGetter(null)
    }
  }, [supabase])

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

  const role = useMemo(() => resolveStarcareRole(session?.user ?? null, isConfigured), [session?.user, isConfigured])
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
    [session, role, isLoading, isConfigured, hasPermissionByRole, canApproveByRole, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
