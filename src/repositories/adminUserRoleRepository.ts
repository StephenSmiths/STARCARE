import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type AdminSetUserRolePayload = {
  /** 與 targetEmail 擇一；Auth 使用者 UUID */
  targetUserId?: string
  targetEmail?: string
  role: 'staff' | 'teamlead' | 'admin'
}

export interface AdminUserRoleRepository {
  setUserRole: (payload: AdminSetUserRolePayload) => Promise<{ targetUserId: string; role: string }>
}

class InMemoryAdminUserRoleRepository implements AdminUserRoleRepository {
  async setUserRole(payload: AdminSetUserRolePayload): Promise<{ targetUserId: string; role: string }> {
    return { targetUserId: payload.targetUserId ?? '00000000-0000-4000-8000-000000000000', role: payload.role }
  }
}

class EdgeAdminUserRoleRepository implements AdminUserRoleRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async setUserRole(payload: AdminSetUserRolePayload): Promise<{ targetUserId: string; role: string }> {
    const key = `admin-user-role-set:${payload.targetUserId ?? payload.targetEmail ?? ''}:${crypto.randomUUID()}`
    const headers = await buildEdgeInvokeHeaders(this.anonKey, key)
    const response = await fetch(`${this.supabaseUrl}/functions/v1/admin-user-role-set`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        targetUserId: payload.targetUserId,
        targetEmail: payload.targetEmail,
        role: payload.role,
      }),
    })
    const text = await response.text()
    if (!response.ok) {
      let msg = `變更角色失敗（HTTP ${response.status}）`
      try {
        const j = JSON.parse(text) as { error?: string }
        if (typeof j.error === 'string' && j.error) msg = j.error
      } catch {
        if (text) msg = text
      }
      throw new Error(msg)
    }
    try {
      const j = JSON.parse(text) as { targetUserId?: string; role?: string }
      if (typeof j.targetUserId === 'string' && typeof j.role === 'string') {
        return { targetUserId: j.targetUserId, role: j.role }
      }
    } catch {
      /* 忽略 */
    }
    throw new Error('變更角色回應格式異常')
  }
}

export const createAdminUserRoleRepository = (): AdminUserRoleRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemoryAdminUserRoleRepository()
  }
  return new EdgeAdminUserRoleRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
