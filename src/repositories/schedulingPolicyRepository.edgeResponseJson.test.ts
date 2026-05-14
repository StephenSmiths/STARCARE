/** PDF 02【16】Seq 29：Edge 回應 body 解析失敗包裝（與 `fetch` 連線訊息一致）。 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EdgeSchedulingPolicyRepository } from './schedulingPolicyRepository'

vi.mock('./edgeFunctionHeaders', () => ({
  buildEdgeInvokeHeaders: vi.fn(async () => ({
    Authorization: 'Bearer test-token',
    apikey: 'anon',
    'Content-Type': 'application/json',
  })),
}))

describe('EdgeSchedulingPolicyRepository 回應 JSON 解析', () => {
  const repo = new EdgeSchedulingPolicyRepository({
    supabaseUrl: 'https://example.supabase.co',
    anonKey: 'anon-key',
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const badJsonResponse = {
    ok: true,
    json: () => Promise.reject(new SyntaxError('invalid json')),
  }

  it.each([
    ['getCurrentBundle', () => repo.getCurrentBundle()],
    ['listPolicyVersionSummaries', () => repo.listPolicyVersionSummaries()],
    ['validateBundle', () => repo.validateBundle({ x: 1 })],
    ['commitBundle', () => repo.commitBundle({}, 'idem-json')],
  ] as const)('%s：response.json 拒絕時包裝連線訊息', async (_name, call) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(badJsonResponse))
    await expect(call()).rejects.toThrow('無法連線至後端，請檢查網路或 Supabase 設定。')
  })
})
