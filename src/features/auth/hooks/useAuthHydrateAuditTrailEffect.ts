import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { hydrateAuditTrailFromRemote } from '../../../services/auditTrailHydrationService'

/** 登入後於微任務 hydrate 審計（與 hydration 服務語意一致）。 */
export const useAuthHydrateAuditTrailEffect = (
  supabase: SupabaseClient | null,
  session: Session | null,
) => {
  useEffect(() => {
    if (!supabase || !session) return
    queueMicrotask(() => {
      void hydrateAuditTrailFromRemote()
    })
  }, [supabase, session])
}
