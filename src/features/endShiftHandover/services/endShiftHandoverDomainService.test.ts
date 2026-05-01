/** @vitest-environment happy-dom */
import { describe, expect, it, beforeEach } from 'vitest'
import { saveEndShiftHandovers } from '../../../services/endShiftHandoverStorage'
import { submitEndShiftHandover, upsertEndShiftHandoverDraft } from './endShiftHandoverDomainService'

const fullFields = () => ({
  dataOverview: '今日服務 12 人次',
  followUps: '院友甲跌倒追蹤',
  newItems: '新增復康器材清點',
  reminders: '明日 OT 請假',
  reportSummary: '附件見共享資料夾',
  signatureName: '張大同',
})

describe('endShiftHandoverDomainService (PDF 02【6】)', () => {
  beforeEach(() => {
    saveEndShiftHandovers([])
  })

  it('提交前：簽名不可空白', () => {
    const draft = upsertEndShiftHandoverDraft(
      'actor-x',
      '2026-05-02',
      { ...fullFields(), signatureName: '' },
      null,
    )
    expect(() => submitEndShiftHandover('actor-x', draft)).toThrow(/簽名/)
  })

  it('非本人不可提交', () => {
    const draft = upsertEndShiftHandoverDraft('actor-x', '2026-05-02', fullFields(), null)
    expect(() => submitEndShiftHandover('other', draft)).toThrow(/無權/)
  })

  it('提交後不可再草稿更新', () => {
    const draft = upsertEndShiftHandoverDraft('actor-x', '2026-05-02', fullFields(), null)
    submitEndShiftHandover('actor-x', draft)
    expect(() =>
      upsertEndShiftHandoverDraft('actor-x', '2026-05-03', fullFields(), draft.id),
    ).toThrow(/不可再修改/)
  })
})
