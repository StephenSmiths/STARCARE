import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'
import type {
  PolicyCommitResponse,
  PolicyValidateResponse,
  SchedulingPolicyBundle,
  SchedulingPolicyVersionSummary,
} from './schedulingPolicyTypes'

export interface SchedulingPolicyRepository {
  getCurrentBundle: (facilityId?: string) => Promise<SchedulingPolicyBundle | null>
  listPolicyVersionSummaries: (facilityId?: string, limit?: number) => Promise<SchedulingPolicyVersionSummary[]>
  validateBundle: (body: Record<string, unknown>) => Promise<PolicyValidateResponse>
  commitBundle: (body: Record<string, unknown>, idempotencyKey: string) => Promise<PolicyCommitResponse>
}

export class InMemorySchedulingPolicyRepository implements SchedulingPolicyRepository {
  async getCurrentBundle(facilityId?: string): Promise<SchedulingPolicyBundle | null> {
    void facilityId
    return null
  }

  async listPolicyVersionSummaries(facilityId?: string, limit?: number): Promise<SchedulingPolicyVersionSummary[]> {
    void facilityId
    void limit
    return []
  }

  async validateBundle(body: Record<string, unknown>): Promise<PolicyValidateResponse> {
    void body
    return { ok: false, errors: [{ code: 'NO_EDGE', message: '未設定 Supabase，無法驗證政策版本' }] }
  }

  async commitBundle(body: Record<string, unknown>, idempotencyKey: string): Promise<PolicyCommitResponse> {
    void body
    void idempotencyKey
    return { ok: false, error: '未設定 Supabase，無法提交政策版本' }
  }
}

export class EdgeSchedulingPolicyRepository implements SchedulingPolicyRepository {
  private readonly supabaseUrl: string
  private readonly anonKey: string

  constructor(config: { supabaseUrl: string; anonKey: string }) {
    this.supabaseUrl = config.supabaseUrl
    this.anonKey = config.anonKey
  }

  /** 與排班域其他 Edge Repository 一致：`fetch`／`response.json()` 連線或解析失敗包裝；「請先登入」原樣上拋。 */
  private throwIfNetworkFailure(error: unknown): never {
    if (error instanceof Error && error.message === '請先登入') {
      throw error
    }
    throw new Error('無法連線至後端，請檢查網路或 Supabase 設定。', { cause: error })
  }

  async getCurrentBundle(facilityId: string = STARCARE_DEFAULT_FACILITY_ID): Promise<SchedulingPolicyBundle | null> {
    let response: Response
    try {
      const headers = await buildEdgeInvokeHeaders(this.anonKey)
      const url = `${this.supabaseUrl}/functions/v1/scheduling-policy-current-get?facilityId=${encodeURIComponent(facilityId)}`
      response = await fetch(url, { headers })
    } catch (error) {
      this.throwIfNetworkFailure(error)
    }
    if (!response.ok) throw new Error(`載入院舍政策失敗（HTTP ${response.status}）`)
    try {
      return (await response.json()) as SchedulingPolicyBundle
    } catch (error) {
      this.throwIfNetworkFailure(error)
    }
  }

  async listPolicyVersionSummaries(
    facilityId: string = STARCARE_DEFAULT_FACILITY_ID,
    limit = 50,
  ): Promise<SchedulingPolicyVersionSummary[]> {
    let response: Response
    try {
      const headers = await buildEdgeInvokeHeaders(this.anonKey)
      const q = new URLSearchParams({
        facilityId,
        limit: String(limit),
      })
      const url = `${this.supabaseUrl}/functions/v1/scheduling-policy-versions-list?${q.toString()}`
      response = await fetch(url, { headers })
    } catch (error) {
      this.throwIfNetworkFailure(error)
    }
    if (!response.ok) throw new Error(`載入政策版本列表失敗（HTTP ${response.status}）`)
    try {
      const data = (await response.json()) as { versions?: SchedulingPolicyVersionSummary[] }
      return Array.isArray(data.versions) ? data.versions : []
    } catch (error) {
      this.throwIfNetworkFailure(error)
    }
  }

  async validateBundle(body: Record<string, unknown>): Promise<PolicyValidateResponse> {
    let response: Response
    try {
      const headers = await buildEdgeInvokeHeaders(this.anonKey)
      response = await fetch(`${this.supabaseUrl}/functions/v1/scheduling-policy-version-validate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
    } catch (error) {
      this.throwIfNetworkFailure(error)
    }
    if (!response.ok) throw new Error(`驗證政策失敗（HTTP ${response.status}）`)
    try {
      return (await response.json()) as PolicyValidateResponse
    } catch (error) {
      this.throwIfNetworkFailure(error)
    }
  }

  async commitBundle(body: Record<string, unknown>, idempotencyKey: string): Promise<PolicyCommitResponse> {
    let response: Response
    let data: PolicyCommitResponse & {
      errors?: { code: string; message: string }[]
      error?: string
    }
    try {
      const headers = await buildEdgeInvokeHeaders(this.anonKey, idempotencyKey)
      response = await fetch(`${this.supabaseUrl}/functions/v1/scheduling-policy-version-commit`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
      data = (await response.json()) as PolicyCommitResponse & {
        errors?: { code: string; message: string }[]
        error?: string
      }
    } catch (error) {
      this.throwIfNetworkFailure(error)
    }
    if (response.status === 409) {
      return {
        ok: false,
        policyVersionId: data.policyVersionId,
        error: String(data.error ?? 'idempotency 衝突'),
      }
    }
    if (response.ok && data.ok === true && typeof data.policyVersionId === 'string') {
      return { ok: true, policyVersionId: data.policyVersionId }
    }
    if (data.errors && Array.isArray(data.errors)) {
      return { ok: false, errors: data.errors }
    }
    return { ok: false, error: data.error ?? `提交失敗（HTTP ${response.status}）` }
  }
}

export const createSchedulingPolicyRepository = (): SchedulingPolicyRepository => {
  const creds = getSupabaseBrowserCredentials()
  if (!creds) return new InMemorySchedulingPolicyRepository()
  return new EdgeSchedulingPolicyRepository({ supabaseUrl: creds.supabaseUrl, anonKey: creds.anonKey })
}
