import { useMemo, useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { EndShiftHandoverWorkspace } from '../hooks/useEndShiftHandoverWorkspace'
import type { EndShiftHandoverFields, EndShiftHandoverRecord } from '../types/endShiftHandover'
import { EndShiftHandoverHistoryAside } from './EndShiftHandoverHistoryAside'
import { emptyEndShiftFields, todayYmd } from './endShiftHandoverPanelUtils'

type TextKey = Exclude<keyof EndShiftHandoverFields, 'signatureName'>

const TEXT_BLOCKS: Array<{ key: TextKey; label: string; placeholder: string }> = [
  { key: 'dataOverview', label: '① 數據概覽', placeholder: '服務量、達標摘要、異常…' },
  { key: 'followUps', label: '② 跟進', placeholder: '未完成項目／待追蹤院友…' },
  { key: 'newItems', label: '③ 新增事項', placeholder: '本更新增須交接事項…' },
  { key: 'reminders', label: '④ 提醒', placeholder: '對下一更／主管之重點提醒…' },
  { key: 'reportSummary', label: '⑤ 報告', placeholder: '簡要報告或附件索引…' },
]

/** PDF 02【6】收工交更表單 */
export const EndShiftHandoverPanel = ({ workspace }: { workspace: EndShiftHandoverWorkspace }) => {
  const [shiftDate, setShiftDate] = useState(todayYmd())
  const [fields, setFields] = useState<EndShiftHandoverFields>(() => emptyEndShiftFields())
  const [editingId, setEditingId] = useState<string | null>(null)

  const myRecords = useMemo(
    () => workspace.records.filter((row) => row.actorId === workspace.actorId),
    [workspace.records, workspace.actorId],
  )

  const loaded = editingId ? myRecords.find((row) => row.id === editingId) ?? null : null
  const readOnly = loaded?.status === 'SUBMITTED'

  const patchField = (key: keyof EndShiftHandoverFields, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }))

  const loadRow = (row: EndShiftHandoverRecord) => {
    setEditingId(row.id)
    setShiftDate(row.shiftDate)
    setFields({
      dataOverview: row.dataOverview,
      followUps: row.followUps,
      newItems: row.newItems,
      reminders: row.reminders,
      reportSummary: row.reportSummary,
      signatureName: row.signatureName,
    })
  }

  const resetEmpty = () => {
    setEditingId(null)
    setShiftDate(todayYmd())
    setFields(emptyEndShiftFields())
  }

  const runSaveDraft = () => {
    try {
      const saved = workspace.saveDraft(shiftDate, fields, editingId)
      setEditingId(saved.id)
      window.alert('草稿已儲存')
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '儲存失敗')
    }
  }

  const runSubmit = () => {
    const record = loaded ?? myRecords.find((row) => row.id === editingId)
    if (!record || record.status !== 'DRAFT') {
      window.alert('請先儲存草稿')
      return
    }
    try {
      workspace.submitRecord({ ...record, ...fields, shiftDate })
      window.alert('交更紀錄已提交')
      resetEmpty()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '提交失敗')
    }
  }

  const canSubmit = loaded?.status === 'DRAFT'

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>收工交更（PDF 02【6】）</h2>
      <p className={uiTokens.sectionHelp}>填寫五類摘要並簽名後提交；提交後鎖定不可編輯。</p>

      <div className={uiTokens.handoverEditorGrid}>
        <div className={uiTokens.layoutGridGap3}>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>收工／交班日期</span>
            <input
              type="date"
              className={uiTokens.formInput}
              disabled={readOnly}
              value={shiftDate}
              onChange={(event) => setShiftDate(event.target.value)}
            />
          </label>
          {TEXT_BLOCKS.map(({ key, label, placeholder }) => (
            <label key={key} className={uiTokens.formFieldStack}>
              <span className={uiTokens.formLabel}>{label}</span>
              <textarea
                className={uiTokens.formTextarea}
                readOnly={readOnly}
                value={fields[key]}
                onChange={(event) => patchField(key, event.target.value)}
                placeholder={placeholder}
              />
            </label>
          ))}
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>⑥ 簽名（姓名）</span>
            <input
              type="text"
              className={uiTokens.formInput}
              readOnly={readOnly}
              value={fields.signatureName}
              onChange={(event) => patchField('signatureName', event.target.value)}
              placeholder="請輸入全名"
            />
          </label>
          <div className={uiTokens.layoutFlexWrapGap2}>
            <button type="button" className={uiTokens.btnSecondary} disabled={readOnly} onClick={runSaveDraft}>
              儲存草稿
            </button>
            <button type="button" className={uiTokens.btnPrimary} disabled={!canSubmit || readOnly} onClick={runSubmit}>
              提交交更紀錄
            </button>
            <button type="button" className={uiTokens.btnCompact} onClick={resetEmpty}>
              新增一筆
            </button>
          </div>
        </div>

        <EndShiftHandoverHistoryAside submittedHistory={workspace.submittedHistory} onSelect={loadRow} />
      </div>

      <div className={uiTokens.layoutSpacerMt8}>
        <h3 className={uiTokens.blockHeading}>我的草稿與紀錄</h3>
        {myRecords.length === 0 ? (
          <p className={uiTokens.recordsEmptyHint}>尚無紀錄。</p>
        ) : (
          <ul className={uiTokens.myFormsList}>
            {myRecords.map((row) => (
              <li key={row.id} className={uiTokens.myFormsListRow}>
                <div>
                  <span className={uiTokens.textWeightMedium}>{row.shiftDate}</span>
                  <span className={uiTokens.metaChipMl2}>
                    {row.status === 'DRAFT' ? '草稿' : '已提交'}
                  </span>
                </div>
                <button type="button" className={uiTokens.linkDownload} onClick={() => loadRow(row)}>
                  {row.status === 'SUBMITTED' ? '檢視' : '載入'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
