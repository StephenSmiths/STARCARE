import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
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
  /** PDF 02【16】P1：治療師小組活動每日上限（facility_policy_numeric_limits；與 scheduling-policy-current-get.numericLimits 同源；scheduling_rules 無對應欄）。 */
  therapistGroupSessionsDailyCap: number
  /** PDF 02【16】P1：治療助理小組活動每日上限（同上）。 */
  assistantGroupSessionsDailyCap: number
}

export interface SchedulingRulesRepository {
  getRules: (facilityId?: string) => Promise<SchedulingRules | null>
}

class InMemorySchedulingRulesRepository implements SchedulingRulesRepository {
  async getRules(facilityId: string = STARCARE_DEFAULT_FACILITY_ID): Promise<SchedulingRules> {
    return {
      facilityId,
      enableSubsidizedRehab: true,
      enableDementiaCare: true,
      dailySameServiceLimit: 1,
      minGapDaysSameService: 1,
      scPriorityEnabled: true,
      allowScTherapistOnly: true,
      groupCapacityLimit: 6,
      therapistGroupSessionsDailyCap: 8,
      assistantGroupSessionsDailyCap: 8,
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

  async getRules(facilityId: string = STARCARE_DEFAULT_FACILITY_ID): Promise<SchedulingRules | null> {
    let response: Response
    // 與 `EdgeSchedulingSessionRepository.listSessions` 一致：連線失敗包裝；「請先登入」原樣上拋。
    try {
      const headers = await buildEdgeInvokeHeaders(this.anonKey)
      response = await fetch(
        `${this.supabaseUrl}/functions/v1/scheduling-rules-get?facilityId=${encodeURIComponent(facilityId)}`,
        { headers },
      )
    } catch (error) {
      if (error instanceof Error && error.message === '請先登入') {
        throw error
      }
      throw new Error('無法連線載入排班規則，請檢查網路或 Supabase 設定。', { cause: error })
    }
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
