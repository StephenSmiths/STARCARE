import type { Resident } from '../features/residents/types/resident'
import {
  buildAssessmentDueTasks,
  type AssessmentDueTask,
} from '../features/residents/services/assessmentDueTaskService'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

/**
 * PDF 01 §4.3：評估 14 天內到期待辦（Seq 9）。
 * 有 Supabase 設定時優先 **`assessment-due-list`**；失敗或未登入時回退 **`buildAssessmentDueTasks`**。
 */
export interface AssessmentDueTaskRepository {
  listDueWithinLeadDays: (
    residents: Resident[],
    options?: { now?: Date; leadDays?: number },
  ) => Promise<AssessmentDueTask[]>
}

class LocalAdmissionCycleAssessmentDueTaskRepository implements AssessmentDueTaskRepository {
  async listDueWithinLeadDays(
    residents: Resident[],
    options?: { now?: Date; leadDays?: number },
  ): Promise<AssessmentDueTask[]> {
    return buildAssessmentDueTasks(residents, options)
  }
}

class EdgeBackedAssessmentDueTaskRepository implements AssessmentDueTaskRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(supabaseUrl: string, anonKey: string) {
    this.supabaseUrl = supabaseUrl
    this.anonKey = anonKey
  }

  async listDueWithinLeadDays(
    residents: Resident[],
    options?: { now?: Date; leadDays?: number },
  ): Promise<AssessmentDueTask[]> {
    const leadDays = options?.leadDays ?? 14
    try {
      const headers = await buildEdgeInvokeHeaders(this.anonKey)
      const qs = new URLSearchParams({ lead_days: String(leadDays) })
      const res = await fetch(`${this.supabaseUrl}/functions/v1/assessment-due-list?${qs.toString()}`, {
        headers,
      })
      if (!res.ok) throw new Error(`assessment-due-list HTTP ${res.status}`)
      const data = (await res.json()) as { tasks?: AssessmentDueTask[] }
      return data.tasks ?? []
    } catch {
      return buildAssessmentDueTasks(residents, options)
    }
  }
}

export const createAssessmentDueTaskRepository = (): AssessmentDueTaskRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new LocalAdmissionCycleAssessmentDueTaskRepository()
  }
  return new EdgeBackedAssessmentDueTaskRepository(creds.supabaseUrl, creds.anonKey)
}

export const assessmentDueTaskRepository = createAssessmentDueTaskRepository()
