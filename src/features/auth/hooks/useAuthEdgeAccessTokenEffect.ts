import type { SupabaseClient } from '@supabase/supabase-js'
import { useLayoutEffect } from 'react'
import { registerEdgeAccessTokenGetter } from '../../../repositories/edgeAuth'

/** Edge 呼叫須於 layout 階段綁定 access_token getter（避免首屏競態）。 */
export const useAuthEdgeAccessTokenEffect = (supabase: SupabaseClient | null) => {
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
}
