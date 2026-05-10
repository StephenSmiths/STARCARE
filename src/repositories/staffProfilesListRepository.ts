import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
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

/** 與 `schedulingSessionRepository` 預設時段 staffId 對齊，供無 Supabase 預覽／E2E 總覽列。 */
const DEMO_MEMORY_STAFF_PROFILES: StaffProfileListRow[] = [
  {
    id: 'staff-ot-1',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    displayName: '王姑娘 OT',
    roleType: 'OT',
    serviceScope: 'Subsidized_Rehab',
  },
  {
    id: 'staff-ot-2',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    displayName: '李先生 PTA',
    roleType: 'PTA',
    serviceScope: 'Subsidized_Rehab',
  },
  {
    id: 'staff-ot-3',
    facilityId: STARCARE_DEFAULT_FACILITY_ID,
    displayName: '張姑娘 OT',
    roleType: 'OT',
    serviceScope: 'Subsidized_Rehab',
  },
]

export interface StaffProfilesListRepository {
  listStaffProfiles: (facilityId?: string) => Promise<StaffProfileListRow[]>
}

class InMemoryStaffProfilesListRepository implements StaffProfilesListRepository {
  async listStaffProfiles(facilityId?: string): Promise<StaffProfileListRow[]> {
    if (facilityId && facilityId !== STARCARE_DEFAULT_FACILITY_ID) {
      return []
    }
    return DEMO_MEMORY_STAFF_PROFILES.map((row) => ({ ...row }))
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
