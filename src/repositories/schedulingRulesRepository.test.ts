/** PDF 02【3】／【16】：排班規則 Edge GET 與工廠（Seq 15；與 prefetchRules／引擎約束載入同源）。 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/supabaseBrowserEnv', () => ({
  getSupabaseBrowserCredentials: vi.fn(),
}))

vi.mock('./edgeFunctionHeaders', () => ({
  buildEdgeInvokeHeaders: vi.fn(),
}))

import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import { getSupabaseBrowserCredentials } from '../services/supabaseBrowserEnv'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'
import { createSchedulingRulesRepository } from './schedulingRulesRepository'

const sampleRules = {
  facilityId: 'fac-edge',
  enableSubsidizedRehab: true,
  enableDementiaCare: false,
  dailySameServiceLimit: 2,
  minGapDaysSameService: 2,
  scPriorityEnabled: false,
  allowScTherapistOnly: false,
  groupCapacityLimit: 4,
  therapistGroupSessionsDailyCap: 3,
  assistantGroupSessionsDailyCap: 4,
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createSchedulingRulesRepository', () => {
  it('無憑證時 getRules 回傳內存預設（可覆寫 facilityId）', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue(null)
    const repo = createSchedulingRulesRepository()
    const rules = await repo.getRules('custom-fac')
    expect(rules).toEqual({
      facilityId: 'custom-fac',
      enableSubsidizedRehab: true,
      enableDementiaCare: true,
      dailySameServiceLimit: 1,
      minGapDaysSameService: 1,
      scPriorityEnabled: true,
      allowScTherapistOnly: true,
      groupCapacityLimit: 6,
      therapistGroupSessionsDailyCap: 8,
      assistantGroupSessionsDailyCap: 8,
    })
  })

  it('無憑證且省略 facilityId 時使用預設院舍 ID', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue(null)
    const repo = createSchedulingRulesRepository()
    const rules = await repo.getRules()
    expect(rules?.facilityId).toBe(STARCARE_DEFAULT_FACILITY_ID)
  })

  it('有憑證時以 Edge GET 載入規則 JSON', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon-key',
    })
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({
      Authorization: 'Bearer t',
      apikey: 'anon',
      'Content-Type': 'application/json',
    })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(sampleRules),
      }),
    )
    const repo = createSchedulingRulesRepository()
    const rules = await repo.getRules('fac-edge')
    expect(rules).toEqual(sampleRules)
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'https://proj.supabase.co/functions/v1/scheduling-rules-get?facilityId=fac-edge',
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })

  it('Edge getRules 遇 404 時回傳 null', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon-key',
    })
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as Record<string, string>)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 404, ok: false }))
    const repo = createSchedulingRulesRepository()
    await expect(repo.getRules('x')).resolves.toBeNull()
  })

  it('Edge getRules 遇 HTTP 非 2xx 時拋錯含狀態碼', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon-key',
    })
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as Record<string, string>)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }))
    const repo = createSchedulingRulesRepository()
    await expect(repo.getRules()).rejects.toThrow('載入排班規則失敗（HTTP 502）')
  })

  it('Edge getRules 若 headers 失敗為請先登入則不呼叫 fetch', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon-key',
    })
    vi.mocked(buildEdgeInvokeHeaders).mockRejectedValue(new Error('請先登入'))
    const fetchFn = vi.fn()
    vi.stubGlobal('fetch', fetchFn)
    const repo = createSchedulingRulesRepository()
    await expect(repo.getRules()).rejects.toThrow('請先登入')
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('Edge getRules 連線失敗時包裝固定中文訊息', async () => {
    vi.mocked(getSupabaseBrowserCredentials).mockReturnValue({
      supabaseUrl: 'https://proj.supabase.co',
      anonKey: 'anon-key',
    })
    vi.mocked(buildEdgeInvokeHeaders).mockResolvedValue({} as Record<string, string>)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const repo = createSchedulingRulesRepository()
    await expect(repo.getRules('fac-net')).rejects.toThrow('無法連線載入排班規則，請檢查網路或 Supabase 設定。')
  })
})
