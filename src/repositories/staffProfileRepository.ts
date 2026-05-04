import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export interface StaffProfileRepository {
  softDeleteStaffProfile: (staffId: string) => Promise<void>
}

class InMemoryStaffProfileRepository implements StaffProfileRepository {
  async softDeleteStaffProfile(_staffId: string): Promise<void> {
    // 本地 mock：不拋錯即可
    void _staffId
  }
}

class EdgeStaffProfileRepository implements StaffProfileRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async softDeleteStaffProfile(staffId: string): Promise<void> {
    const headers = await buildEdgeInvokeHeaders(
      this.anonKey,
      `staff-soft-delete:${staffId}:${crypto.randomUUID()}`,
    )
    const response = await fetch(`${this.supabaseUrl}/functions/v1/staff-soft-delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: staffId, is_deleted: true }),
    })
    if (!response.ok) throw new Error(`員工軟刪除失敗（HTTP ${response.status}）`)
  }
}

export const createStaffProfileRepository = (): StaffProfileRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemoryStaffProfileRepository()
  }
  return new EdgeStaffProfileRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
