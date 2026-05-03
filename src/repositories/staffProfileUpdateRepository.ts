import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type StaffProfileUpdatePayload = {
  staffId: string
  displayName: string
  roleType: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  serviceScope: 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'
  actorId: string
}

export interface StaffProfileUpdateRepository {
  updateStaffProfile: (payload: StaffProfileUpdatePayload) => Promise<void>
}

class InMemoryStaffProfileUpdateRepository implements StaffProfileUpdateRepository {
  async updateStaffProfile(_payload: StaffProfileUpdatePayload): Promise<void> {
    void _payload
  }
}

class EdgeStaffProfileUpdateRepository implements StaffProfileUpdateRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async updateStaffProfile(payload: StaffProfileUpdatePayload): Promise<void> {
    const key = `staff-profile-update:${payload.staffId}:${crypto.randomUUID()}`
    const headers = await buildEdgeInvokeHeaders(this.anonKey, key)
    const response = await fetch(`${this.supabaseUrl}/functions/v1/staff-profile-update`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: payload.staffId,
        display_name: payload.displayName,
        role_type: payload.roleType,
        service_scope: payload.serviceScope,
        actorId: payload.actorId,
      }),
    })
    if (!response.ok) {
      const text = await response.text()
      let msg = `更新員工主檔失敗（HTTP ${response.status}）`
      try {
        const j = JSON.parse(text) as { error?: string }
        if (typeof j.error === 'string' && j.error) msg = j.error
      } catch {
        if (text) msg = text
      }
      throw new Error(msg)
    }
  }
}

export const createStaffProfileUpdateRepository = (): StaffProfileUpdateRepository => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env ?? {}
  if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
    return new EdgeStaffProfileUpdateRepository({
      supabaseUrl: env.VITE_SUPABASE_URL,
      anonKey: env.VITE_SUPABASE_ANON_KEY,
    })
  }
  return new InMemoryStaffProfileUpdateRepository()
}
