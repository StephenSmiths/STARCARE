import { useEffect } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createAuditTrailRepository } from '../../../repositories/auditTrailRepository'
import { registerAuditTrailPersistence } from '../../../services/auditTrailService'

/** Supabase 就緒時註冊審計持久化；離線／無設定時解除（對齊 Repository 閉環）。 */
export const useAuthAuditTrailPersistenceEffect = (supabase: SupabaseClient | null) => {
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
}
