import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

/** 對齊 public.staff_profiles.role_type（匯入／DB 權威） */
export type StaffProfileListRow = {
  id: string
  facilityId: string
  displayName: string
  roleType: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  serviceScope: 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'
}

export interface StaffProfilesListRepository {
  listStaffProfiles: (facilityId?: string) => Promise<StaffProfileListRow[]>
}

class InMemoryStaffProfilesListRepository implements StaffProfilesListRepository {
  async listStaffProfiles(): Promise<StaffProfileListRow[]> {
    return []
  }
}

class EdgeStaffProfilesListRepository implements StaffProfilesListRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async listStaffProfiles(facilityId?: string): Promise<StaffProfileListRow[]> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const query = facilityId ? `?facilityId=${encodeURIComponent(facilityId)}` : ''
    const response = await fetch(`${this.supabaseUrl}/functions/v1/staff-profiles-list${query}`, { headers })
    if (!response.ok) throw new Error(`載入員工主檔失敗（HTTP ${response.status}）`)
    return (await response.json()) as StaffProfileListRow[]
  }
}

export const createStaffProfilesListRepository = (): StaffProfilesListRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemoryStaffProfilesListRepository()
  }
  return new EdgeStaffProfilesListRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
