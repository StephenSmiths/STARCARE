import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

/** 初始 getSession + onAuthStateChange；無客戶端時維持未登入且不轉 loading。 */
export const useAuthSupabaseSession = (supabase: SupabaseClient | null) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(supabase))

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

  return { session, isLoading }
}
