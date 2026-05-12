import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import { samplePolicyVersionSummary } from './schedulingPolicyRepository.fixtures'
import { EdgeSchedulingPolicyRepository } from './schedulingPolicyRepository'

vi.mock('./edgeFunctionHeaders', () => ({
  buildEdgeInvokeHeaders: vi.fn(async () => ({
    Authorization: 'Bearer test-token',
    apikey: 'anon',
    'Content-Type': 'application/json',
  })),
}))

describe('EdgeSchedulingPolicyRepository.listPolicyVersionSummaries', () => {
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

  it('呼叫 scheduling-policy-versions-list 並帶 facilityId、limit', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ versions: [samplePolicyVersionSummary] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const rows = await repo.listPolicyVersionSummaries('custom-facility', 10)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = String(fetchMock.mock.calls[0][0])
    expect(url).toContain('/functions/v1/scheduling-policy-versions-list?')
    expect(url).toContain(`facilityId=${encodeURIComponent('custom-facility')}`)
    expect(url).toContain('limit=10')
    expect(rows).toEqual([samplePolicyVersionSummary])
  })

  it('預設院舍與 limit 50', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ versions: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await repo.listPolicyVersionSummaries()

    const url = String(fetchMock.mock.calls[0][0])
    expect(url).toContain(`facilityId=${encodeURIComponent(STARCARE_DEFAULT_FACILITY_ID)}`)
    expect(url).toContain('limit=50')
  })

  it('若無 versions 欄位則回傳空陣列', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }),
    )
    expect(await repo.listPolicyVersionSummaries()).toEqual([])
  })

  it('非 OK 時拋錯', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    )
    await expect(repo.listPolicyVersionSummaries()).rejects.toThrow('404')
  })
})
