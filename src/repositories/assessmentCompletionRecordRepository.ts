import type { AssessmentCompletionRecord } from '../features/assessmentManagement/types/assessmentManagement'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'
import {
  mapAssessmentCompletionRecordRow,
  toAssessmentCompletionAppendPayload,
  type AssessmentCompletionRecordRow,
} from './assessmentCompletionRecordMapper'

/** PDF 02【9】：讀寫庫內評估完成紀錄（Seq 22） */
export interface AssessmentCompletionRecordRepository {
  listActive: () => Promise<AssessmentCompletionRecord[]>
  append: (records: AssessmentCompletionRecord[]) => Promise<void>
}

class EmptyAssessmentCompletionRecordRepository implements AssessmentCompletionRecordRepository {
  async listActive(): Promise<AssessmentCompletionRecord[]> {
    return []
  }

  async append(): Promise<void> {
    /* 無 Supabase：僅本機 assessmentCompletionStorage */
  }
}

class EdgeAssessmentCompletionRecordRepository implements AssessmentCompletionRecordRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(supabaseUrl: string, anonKey: string) {
    this.supabaseUrl = supabaseUrl
    this.anonKey = anonKey
  }

  async listActive(): Promise<AssessmentCompletionRecord[]> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const res = await fetch(`${this.supabaseUrl}/functions/v1/assessment-completion-records-list`, {
      headers,
    })
    if (!res.ok) throw new Error(`assessment-completion-records-list HTTP ${res.status}`)
    const data = (await res.json()) as { records?: AssessmentCompletionRecordRow[] }
    return (data.records ?? []).map(mapAssessmentCompletionRecordRow)
  }

  async append(records: AssessmentCompletionRecord[]): Promise<void> {
    if (records.length === 0) return
    const idem = crypto.randomUUID()
    const headers = await buildEdgeInvokeHeaders(this.anonKey, idem)
    const res = await fetch(`${this.supabaseUrl}/functions/v1/assessment-completion-records-append`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ records: records.map(toAssessmentCompletionAppendPayload) }),
    })
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!res.ok) {
      throw new Error(data.error ?? `assessment-completion-records-append HTTP ${res.status}`)
    }
    if (data.ok !== true) {
      throw new Error(data.error ?? 'assessment-completion-records-append 回應異常')
    }
  }
}

export const createAssessmentCompletionRecordRepository = (): AssessmentCompletionRecordRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new EmptyAssessmentCompletionRecordRepository()
  }
  return new EdgeAssessmentCompletionRecordRepository(creds.supabaseUrl, creds.anonKey)
}

export const assessmentCompletionRecordRepository = createAssessmentCompletionRecordRepository()
