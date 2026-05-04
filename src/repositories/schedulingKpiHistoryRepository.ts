import type { SchedulingKpiRunRecord } from '../services/schedulingKpiService'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'

export interface SchedulingKpiHistoryQuery {
  limit?: number
  from?: string
  to?: string
  actorId?: string
}

export interface SchedulingKpiHistoryRepository {
  listHistory: (facilityId: string, query?: SchedulingKpiHistoryQuery) => Promise<SchedulingKpiRunRecord[]>
  appendRecord: (facilityId: string, record: SchedulingKpiRunRecord) => Promise<void>
  clearHistory: (facilityId: string) => Promise<void>
}

export class InMemorySchedulingKpiHistoryRepository implements SchedulingKpiHistoryRepository {
  private readonly rows: SchedulingKpiRunRecord[] = []

  async listHistory(_facilityId: string, query?: SchedulingKpiHistoryQuery): Promise<SchedulingKpiRunRecord[]> {
    const limit = Math.min(Math.max(query?.limit ?? 10, 1), 50)
    const fromMs = query?.from ? new Date(query.from).getTime() : Number.NEGATIVE_INFINITY
    const toMs = query?.to ? new Date(query.to).getTime() : Number.POSITIVE_INFINITY
    return this.rows
      .filter((item) => {
        const ranAtMs = new Date(item.ranAt).getTime()
        return ranAtMs >= fromMs && ranAtMs <= toMs
      })
      .slice(0, limit)
      .map((item) => ({ ...item, kpis: { ...item.kpis } }))
  }

  async appendRecord(_facilityId: string, record: SchedulingKpiRunRecord): Promise<void> {
    this.rows.unshift({ ...record, kpis: { ...record.kpis } })
    this.rows.splice(10)
  }

  async clearHistory(facilityId: string): Promise<void> {
    void facilityId
    this.rows.splice(0)
  }
}

interface EdgeConfig {
  supabaseUrl: string
  anonKey: string
}

type EdgeListRow = {
  ran_at: string
  coverage_rate: number
  conflict_rate_per_100: number
  average_assignments_per_resident: number
  under_target_rate: number
  resident_count: number
  assignment_count: number
  conflict_count: number
  actor_id?: string
}

const mapEdgeRow = (row: EdgeListRow): SchedulingKpiRunRecord => ({
  ranAt: row.ran_at,
  kpis: {
    coverageRate: row.coverage_rate,
    conflictRatePer100: row.conflict_rate_per_100,
    averageAssignmentsPerResident: row.average_assignments_per_resident,
    underTargetRate: row.under_target_rate,
  },
  residentCount: row.resident_count,
  assignmentCount: row.assignment_count,
  conflictCount: row.conflict_count,
  actorId: row.actor_id,
})

export class EdgeSchedulingKpiHistoryRepository implements SchedulingKpiHistoryRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: EdgeConfig) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  async listHistory(facilityId: string, query?: SchedulingKpiHistoryQuery): Promise<SchedulingKpiRunRecord[]> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const search = new URLSearchParams({
      facility_id: facilityId,
      limit: String(query?.limit ?? 10),
    })
    if (query?.from) search.set('from', query.from)
    if (query?.to) search.set('to', query.to)
    if (query?.actorId) search.set('actor_id', query.actorId)
    const response = await fetch(
      `${this.supabaseUrl}/functions/v1/scheduling-kpi-history-list?${search.toString()}`,
      { headers },
    )
    if (!response.ok) throw new Error(`無法讀取 KPI 歷史（HTTP ${response.status}）`)
    const data = (await response.json()) as { rows?: EdgeListRow[] }
    return (data.rows ?? []).map(mapEdgeRow)
  }

  async appendRecord(facilityId: string, record: SchedulingKpiRunRecord): Promise<void> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const response = await fetch(`${this.supabaseUrl}/functions/v1/scheduling-kpi-history-upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        facilityId,
        record: {
          ranAt: record.ranAt,
          coverageRate: record.kpis.coverageRate,
          conflictRatePer100: record.kpis.conflictRatePer100,
          averageAssignmentsPerResident: record.kpis.averageAssignmentsPerResident,
          underTargetRate: record.kpis.underTargetRate,
          residentCount: record.residentCount,
          assignmentCount: record.assignmentCount,
          conflictCount: record.conflictCount,
        },
      }),
    })
    if (!response.ok) throw new Error(`無法儲存 KPI 歷史（HTTP ${response.status}）`)
  }

  async clearHistory(facilityId: string): Promise<void> {
    const headers = await buildEdgeInvokeHeaders(this.anonKey)
    const response = await fetch(`${this.supabaseUrl}/functions/v1/scheduling-kpi-history-clear`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ facilityId }),
    })
    if (!response.ok) throw new Error(`無法清除 KPI 歷史（HTTP ${response.status}）`)
  }
}

export const createSchedulingKpiHistoryRepository = (): SchedulingKpiHistoryRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) {
    return new InMemorySchedulingKpiHistoryRepository()
  }
  return new EdgeSchedulingKpiHistoryRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
