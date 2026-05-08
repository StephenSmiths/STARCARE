import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type StaffCreatePayload = {
  actorId: string
  id?: string
  displayName: string
  roleType: 'PT' | 'PTA' | 'OT' | 'OTA'
  gender: '男' | '女'
  phone: string
  email: string
}

export interface StaffCreateRepository {
  createStaff: (payload: StaffCreatePayload) => Promise<{ ok: true; id: string }>
}

class EdgeStaffCreateRepository implements StaffCreateRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async createStaff(payload: StaffCreatePayload): Promise<{ ok: true; id: string }> {
    const headers = await buildEdgeInvokeHeaders(
      this.anonKey,
      `staff-create:${payload.actorId}:${crypto.randomUUID()}`,
    )
    const response = await fetch(`${this.supabaseUrl}/functions/v1/staff-create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        actorId: payload.actorId,
        id: payload.id?.trim() || undefined,
        display_name: payload.displayName.trim(),
        role_type: payload.roleType,
        gender: payload.gender,
        phone: payload.phone.trim(),
        email: payload.email.trim(),
      }),
    })
    const body = (await response.json()) as { ok?: boolean; id?: string; error?: string }
    if (!response.ok) {
      throw new Error(body.error ?? `新增員工失敗（HTTP ${response.status}）`)
    }
    if (!body.ok || !body.id) throw new Error('新增員工回應異常')
    return { ok: true, id: body.id }
  }
}

class InMemoryStaffCreateRepository implements StaffCreateRepository {
  async createStaff(payload: StaffCreatePayload): Promise<{ ok: true; id: string }> {
    return { ok: true, id: payload.id?.trim() || `staff-${crypto.randomUUID()}` }
  }
}

export const createStaffCreateRepository = (): StaffCreateRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) return new InMemoryStaffCreateRepository()
  return new EdgeStaffCreateRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
