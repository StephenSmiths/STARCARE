import { describe, expect, it } from 'vitest'
import {
  adoptAiReport,
  distributeAiReport,
  prependAiReportDraft,
  updateAiReportDraftBody,
} from './aiReportCenterDomainService'

describe('aiReportCenterDomainService（PDF 02【11】）', () => {
  it('prependAiReportDraft 建立 DRAFT', () => {
    const { next, created } = prependAiReportDraft('actor-1', '週報', [])
    expect(next).toHaveLength(1)
    expect(created.status).toBe('DRAFT')
    expect(created.title).toBe('週報')
    expect(created.bodyText).toContain('週報')
  })

  it('採用後才可發放', () => {
    const { next: afterCreate } = prependAiReportDraft('a', 'x', [])
    const id = afterCreate[0].id
    expect(() => distributeAiReport('a', id, afterCreate)).toThrow(/採用/)
    const adopted = adoptAiReport('a', id, afterCreate)
    const distributed = distributeAiReport('a', id, adopted)
    expect(distributed[0].status).toBe('DISTRIBUTED')
    expect(distributed[0].distributedAt).toBeTruthy()
  })

  it('非建立者不可編輯草稿', () => {
    const { next } = prependAiReportDraft('owner', 't', [])
    expect(() => updateAiReportDraftBody('other', next[0].id, 'hack', next)).toThrow(/建立者/)
  })

  it('ADOPTED 不可再改內文', () => {
    const { next: draft } = prependAiReportDraft('o', 't', [])
    const id = draft[0].id
    const adopted = adoptAiReport('o', id, draft)
    expect(() => updateAiReportDraftBody('o', id, 'x', adopted)).toThrow(/草稿/)
  })
})
