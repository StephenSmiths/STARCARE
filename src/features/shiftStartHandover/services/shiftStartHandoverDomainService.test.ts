/** @vitest-environment happy-dom */
import { describe, expect, it, beforeEach } from 'vitest'
import { saveShiftStartHandovers } from '../../../services/shiftStartHandoverStorage'
import { submitShiftStartHandover, upsertShiftStartHandoverDraft } from './shiftStartHandoverDomainService'

const fullFields = () => ({
  representativeNote: '代表確認',
  departmentOverview: '部門三人當班',
  facilityInfoAcknowledgement: '院舍資訊已閱',
  precautionsAcknowledgement: '防滑注意',
  signatureName: '李小華',
})

describe('shiftStartHandoverDomainService (PDF 02【5b】)', () => {
  beforeEach(() => {
    saveShiftStartHandovers([])
  })

  it('提交前校驗：簽名不可空白', () => {
    const draft = upsertShiftStartHandoverDraft(
      'actor-a',
      '2026-05-01',
      { ...fullFields(), signatureName: '' },
      null,
    )
    expect(() => submitShiftStartHandover('actor-a', draft)).toThrow(/簽名/)
  })

  it('非本人不可提交', () => {
    const draft = upsertShiftStartHandoverDraft('actor-a', '2026-05-01', fullFields(), null)
    expect(() => submitShiftStartHandover('other', draft)).toThrow(/無權/)
  })

  it('完整欄位可提交為 SUBMITTED，且提交後不可再草稿更新', () => {
    const draft = upsertShiftStartHandoverDraft('actor-a', '2026-05-01', fullFields(), null)
    submitShiftStartHandover('actor-a', draft)
    expect(() =>
      upsertShiftStartHandoverDraft('actor-a', '2026-05-02', fullFields(), draft.id),
    ).toThrow(/不可再修改/)
  })
})
