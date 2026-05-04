import { isSupabaseBrowserConfigured } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type StaffSkill = {
  id: string
  facilityId: string
  staffProfileId: string
  activityId: string
}

export interface StaffSkillsRepository {
  listStaffSkills: (facilityId?: string) => Promise<StaffSkill[]>
}

class InMemoryStaffSkillsRepository implements StaffSkillsRepository {
  async listStaffSkills(): Promise<StaffSkill[]> {
    return []
  }
}

class EdgeStaffSkillsRepository implements StaffSkillsRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async listStaffSkills(facilityId?: string): Promise<StaffSkill[]> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const query = facilityId ? `?facilityId=${encodeURIComponent(facilityId)}` : ''
    const response = await fetch(`${this.supabaseUrl}/functions/v1/staff-skills-list${query}`, { headers })
    if (!response.ok) throw new Error(`載入員工技能失敗（HTTP ${response.status}）`)
    return (await response.json()) as StaffSkill[]
  }
}

export const createStaffSkillsRepository = (): StaffSkillsRepository => {
  if (!isSupabaseBrowserConfigured()) {
    return new InMemoryStaffSkillsRepository()
  }
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}
  const supabaseUrl = env.VITE_SUPABASE_URL
  const anonKey = env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) {
    return new InMemoryStaffSkillsRepository()
  }
  return new EdgeStaffSkillsRepository({ supabaseUrl, anonKey })
}
