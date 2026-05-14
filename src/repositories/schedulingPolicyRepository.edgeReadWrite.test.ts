import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import { buildEdgeInvokeHeaders } from './edgeFunctionHeaders'
import { minimalSchedulingPolicyBundle } from './schedulingPolicyRepository.fixtures'
import { EdgeSchedulingPolicyRepository } from './schedulingPolicyRepository'

vi.mock('./edgeFunctionHeaders', () => ({
  buildEdgeInvokeHeaders: vi.fn(async () => ({
    Authorization: 'Bearer test-token',
    apikey: 'anon',
    'Content-Type': 'application/json',
  })),
}))

describe('EdgeSchedulingPolicyRepository（current／validate／commit）', () => {
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

  it('getCurrentBundle 呼叫 scheduling-policy-current-get 並回傳 JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => minimalSchedulingPolicyBundle,
    })
    vi.stubGlobal('fetch', fetchMock)

    const bundle = await repo.getCurrentBundle('fac-x')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = String(fetchMock.mock.calls[0][0])
    expect(url).toContain('/functions/v1/scheduling-policy-current-get?')
    expect(url).toContain(`facilityId=${encodeURIComponent('fac-x')}`)
    expect(bundle).toEqual(minimalSchedulingPolicyBundle)
  })

  it('getCurrentBundle 非 OK 時拋錯', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    )
    await expect(repo.getCurrentBundle()).rejects.toThrow('503')
  })

  it('validateBundle 以 POST 呼叫 scheduling-policy-version-validate', async () => {
    const payload = { facilityId: 'fac-x', foo: 1 }
    const validateResult = { ok: false as const, errors: [{ code: 'E1', message: 'bad' }] }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => validateResult,
    })
    vi.stubGlobal('fetch', fetchMock)

    const out = await repo.validateBundle(payload)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://example.supabase.co/functions/v1/scheduling-policy-version-validate')
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify(payload))
    expect(out).toEqual(validateResult)
  })

  it('validateBundle 非 OK 時拋錯', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    )
    await expect(repo.validateBundle({})).rejects.toThrow('401')
  })

  it('commitBundle 帶 idempotency 並於成功時回傳 policyVersionId', async () => {
    const body = { facilityId: STARCARE_DEFAULT_FACILITY_ID }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, policyVersionId: 'pv-new-1' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const out = await repo.commitBundle(body, 'idem-key-99')

    expect(vi.mocked(buildEdgeInvokeHeaders)).toHaveBeenCalledWith('anon-key', 'idem-key-99')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://example.supabase.co/functions/v1/scheduling-policy-version-commit')
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify(body))
    expect(out).toEqual({ ok: true, policyVersionId: 'pv-new-1' })
  })

  it('commitBundle 遇 409 回傳 ok:false（不拋錯）', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: 'idempotency 衝突', policyVersionId: 'pv-existing' }),
      }),
    )

    const out = await repo.commitBundle({}, 'idem')

    expect(out).toEqual({
      ok: false,
      policyVersionId: 'pv-existing',
      error: 'idempotency 衝突',
    })
  })

  it('commitBundle 回應含 errors 陣列時回傳驗證錯誤', async () => {
    const errors = [{ code: 'R_OVERLAP', message: '區間重疊' }]
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ ok: false, errors }),
      }),
    )

    const out = await repo.commitBundle({}, 'k')

    expect(out).toEqual({ ok: false, errors })
  })

  it('commitBundle 其他失敗時回傳 error 字串', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: '伺服器忙碌' }),
      }),
    )

    const out = await repo.commitBundle({}, 'k')

    expect(out).toEqual({ ok: false, error: '伺服器忙碌' })
  })

  describe('連線包裝', () => {
    it('getCurrentBundle：請先登入時不呼叫 fetch', async () => {
      vi.mocked(buildEdgeInvokeHeaders).mockRejectedValueOnce(new Error('請先登入'))
      const fetchFn = vi.fn()
      vi.stubGlobal('fetch', fetchFn)
      await expect(repo.getCurrentBundle('f')).rejects.toThrow('請先登入')
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('getCurrentBundle：fetch 失敗包裝', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
      await expect(repo.getCurrentBundle()).rejects.toThrow('無法連線至後端，請檢查網路或 Supabase 設定。')
    })

    it('validateBundle：請先登入時不呼叫 fetch', async () => {
      vi.mocked(buildEdgeInvokeHeaders).mockRejectedValueOnce(new Error('請先登入'))
      const fetchFn = vi.fn()
      vi.stubGlobal('fetch', fetchFn)
      await expect(repo.validateBundle({})).rejects.toThrow('請先登入')
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('validateBundle：fetch 失敗包裝', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
      await expect(repo.validateBundle({ a: 1 })).rejects.toThrow('無法連線至後端，請檢查網路或 Supabase 設定。')
    })

    it('commitBundle：請先登入時不呼叫 fetch', async () => {
      vi.mocked(buildEdgeInvokeHeaders).mockRejectedValueOnce(new Error('請先登入'))
      const fetchFn = vi.fn()
      vi.stubGlobal('fetch', fetchFn)
      await expect(repo.commitBundle({}, 'idem-x')).rejects.toThrow('請先登入')
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('commitBundle：fetch 失敗包裝', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
      await expect(repo.commitBundle({}, 'k')).rejects.toThrow('無法連線至後端，請檢查網路或 Supabase 設定。')
    })
  })
})
