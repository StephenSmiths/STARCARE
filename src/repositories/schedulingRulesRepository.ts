import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type SchedulingRules = {
  facilityId: string
  enableSubsidizedRehab: boolean
  enableDementiaCare: boolean
  dailySameServiceLimit: number
  minGapDaysSameService: number
  scPriorityEnabled: boolean
  allowScTherapistOnly: boolean
  groupCapacityLimit: number
}

export interface SchedulingRulesRepository {
  getRules: (facilityId?: string) => Promise<SchedulingRules | null>
}

class InMemorySchedulingRulesRepository implements SchedulingRulesRepository {
  async getRules(facilityId = 'facility-main'): Promise<SchedulingRules> {
    return {
      facilityId,
      enableSubsidizedRehab: true,
      enableDementiaCare: true,
      dailySameServiceLimit: 1,
      minGapDaysSameService: 1,
      scPriorityEnabled: true,
      allowScTherapistOnly: true,
      groupCapacityLimit: 6,
    }
  }
}

class EdgeSchedulingRulesRepository implements SchedulingRulesRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async getRules(facilityId = 'facility-main'): Promise<SchedulingRules | null> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const response = await fetch(
      `${this.supabaseUrl}/functions/v1/scheduling-rules-get?facilityId=${encodeURIComponent(facilityId)}`,
      { headers },
    )
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`載入排班規則失敗（HTTP ${response.status}）`)
    return (await response.json()) as SchedulingRules
  }
}

export const createSchedulingRulesRepository = (): SchedulingRulesRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemorySchedulingRulesRepository()
  }
  return new EdgeSchedulingRulesRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
