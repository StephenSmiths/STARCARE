import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export type ActivitySession = {
  id: string
  facilityId: string
  activityId: string
  staffProfileId: string
  staffName: string
  sessionDate: string
  timeSlot: string
  capacity: number
  serviceType: 'Subsidized_Rehab' | 'Dementia_Care'
  skillMatched?: boolean
}

export interface ActivitySessionRepository {
  listActivitySessions: (params?: {
    facilityId?: string
    fromDate?: string
    toDate?: string
  }) => Promise<ActivitySession[]>
  softDeleteActivitySession: (sessionId: string) => Promise<void>
}

class InMemoryActivitySessionRepository implements ActivitySessionRepository {
  async listActivitySessions(): Promise<ActivitySession[]> {
    return []
  }

  async softDeleteActivitySession(_sessionId: string): Promise<void> {
    void _sessionId
  }
}

class EdgeActivitySessionRepository implements ActivitySessionRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async listActivitySessions(params?: {
    facilityId?: string
    fromDate?: string
    toDate?: string
  }): Promise<ActivitySession[]> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const search = new URLSearchParams()
    if (params?.facilityId) search.set('facilityId', params.facilityId)
    if (params?.fromDate) search.set('fromDate', params.fromDate)
    if (params?.toDate) search.set('toDate', params.toDate)
    const suffix = search.size > 0 ? `?${search.toString()}` : ''
    const response = await fetch(`${this.supabaseUrl}/functions/v1/activity-sessions-list${suffix}`, {
      headers,
    })
    if (!response.ok) throw new Error(`載入活動時段失敗（HTTP ${response.status}）`)
    return (await response.json()) as ActivitySession[]
  }

  async softDeleteActivitySession(sessionId: string): Promise<void> {
    const headers = await buildEdgeInvokeHeaders(
      this.anonKey,
      `activity-session-soft-delete:${sessionId}:${crypto.randomUUID()}`,
    )
    const response = await fetch(`${this.supabaseUrl}/functions/v1/activity-sessions-soft-delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: sessionId, is_deleted: true }),
    })
    if (!response.ok) throw new Error(`活動時段軟刪除失敗（HTTP ${response.status}）`)
  }
}

export const createActivitySessionRepository = (): ActivitySessionRepository => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env ?? {}
  if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
    return new EdgeActivitySessionRepository({
      supabaseUrl: env.VITE_SUPABASE_URL,
      anonKey: env.VITE_SUPABASE_ANON_KEY,
    })
  }
  return new InMemoryActivitySessionRepository()
}
