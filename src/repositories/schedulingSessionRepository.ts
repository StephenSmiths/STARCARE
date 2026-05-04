import type { SchedulingSession } from '../services/schedulingService'
import { isSupabaseBrowserConfigured } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export interface SchedulingSessionRepository {
  listSessions: () => Promise<SchedulingSession[]>
}

const defaultSessions: SchedulingSession[] = [
  {
    id: 'session-1',
    staffId: 'staff-ot-1',
    staffName: '王姑娘 OT',
    date: '2026-04-30',
    timeSlot: '09:00-10:00',
    serviceType: 'Subsidized_Rehab',
    capacity: 1,
    staffRoleType: 'OT',
  },
  {
    id: 'session-2',
    staffId: 'staff-ot-2',
    staffName: '李先生 PTA',
    date: '2026-05-02',
    timeSlot: '09:00-10:00',
    serviceType: 'Subsidized_Rehab',
    capacity: 1,
    staffRoleType: 'PTA',
  },
  {
    id: 'session-3',
    staffId: 'staff-ot-3',
    staffName: '張姑娘 OT',
    date: '2026-05-04',
    timeSlot: '14:00-15:00',
    serviceType: 'Subsidized_Rehab',
    capacity: 1,
    staffRoleType: 'OT',
  },
]

/** 無後端時使用預設可排時段 */
export class InMemorySchedulingSessionRepository implements SchedulingSessionRepository {
  async listSessions(): Promise<SchedulingSession[]> {
    return Promise.resolve(defaultSessions.map((s) => ({ ...s })))
  }
}

interface EdgeConfig {
  supabaseUrl: string
  anonKey: string
}

/** Edge Function：`GET /functions/v1/scheduling-sessions-list` 回傳 SchedulingSession[] */
export class EdgeSchedulingSessionRepository implements SchedulingSessionRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: EdgeConfig) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async listSessions(): Promise<SchedulingSession[]> {
    let response: Response
    try {
      const headers = await buildEdgeInvokeHeaders(this.anonKey)
      response = await fetch(`${this.supabaseUrl}/functions/v1/scheduling-sessions-list`, {
        headers,
      })
    } catch (error) {
      if (error instanceof Error && error.message === '請先登入') {
        throw error
      }
      throw new Error('無法連線載入可排時段，請檢查網路或 Supabase 設定。', { cause: error })
    }
    if (!response.ok) {
      throw new Error(`無法載入可排時段（HTTP ${response.status}）`)
    }
    return (await response.json()) as SchedulingSession[]
  }
}

export const createSchedulingSessionRepository = (): SchedulingSessionRepository => {
  if (!isSupabaseBrowserConfigured()) {
    return new InMemorySchedulingSessionRepository()
  }
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    return new InMemorySchedulingSessionRepository()
  }
  return new EdgeSchedulingSessionRepository({ supabaseUrl: url, anonKey: key })
}
