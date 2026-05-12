import { describe, expect, it } from 'vitest'
import { InMemorySchedulingPolicyRepository } from './schedulingPolicyRepository'

describe('InMemorySchedulingPolicyRepository', () => {
  const repo = new InMemorySchedulingPolicyRepository()

  it('getCurrentBundle 恒為 null', async () => {
    expect(await repo.getCurrentBundle()).toBeNull()
    expect(await repo.getCurrentBundle('any-id')).toBeNull()
  })

  it('listPolicyVersionSummaries 恒為空陣列', async () => {
    expect(await repo.listPolicyVersionSummaries()).toEqual([])
    expect(await repo.listPolicyVersionSummaries('x', 3)).toEqual([])
  })

  it('validateBundle 回 NO_EDGE', async () => {
    const out = await repo.validateBundle({ facilityId: 'x' })
    expect(out).toEqual({
      ok: false,
      errors: [{ code: 'NO_EDGE', message: '未設定 Supabase，無法驗證政策版本' }],
    })
  })

  it('commitBundle 回固定錯誤訊息', async () => {
    expect(await repo.commitBundle({}, 'idem')).toEqual({
      ok: false,
      error: '未設定 Supabase，無法提交政策版本',
    })
  })
})
