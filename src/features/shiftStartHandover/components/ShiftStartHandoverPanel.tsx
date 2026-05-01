import { useMemo, useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { ShiftStartHandoverWorkspace } from '../hooks/useShiftStartHandoverWorkspace'
import type { ShiftStartHandoverFields, ShiftStartHandoverRecord } from '../types/shiftStartHandover'
import { ShiftStartHandoverHistoryAside } from './ShiftStartHandoverHistoryAside'
import { emptyShiftFields, todayYmd } from './shiftStartHandoverPanelUtils'

/** PDF 02【5b】六步：①～④表單、⑤歷史側欄、⑥簽名 */
export const ShiftStartHandoverPanel = ({ workspace }: { workspace: ShiftStartHandoverWorkspace }) => {
  const [shiftDate, setShiftDate] = useState(todayYmd())
  const [fields, setFields] = useState<ShiftStartHandoverFields>(() => emptyShiftFields())
  const [editingId, setEditingId] = useState<string | null>(null)

  const myRecords = useMemo(
    () => workspace.records.filter((row) => row.actorId === workspace.actorId),
    [workspace.records, workspace.actorId],
  )

  const loaded = editingId ? myRecords.find((row) => row.id === editingId) ?? null : null
  const readOnly = loaded?.status === 'SUBMITTED'

  const patchField = (key: keyof ShiftStartHandoverFields, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }))

  const loadRow = (row: ShiftStartHandoverRecord) => {
    setEditingId(row.id)
    setShiftDate(row.shiftDate)
    setFields({
      representativeNote: row.representativeNote,
      departmentOverview: row.departmentOverview,
      facilityInfoAcknowledgement: row.facilityInfoAcknowledgement,
      precautionsAcknowledgement: row.precautionsAcknowledgement,
      signatureName: row.signatureName,
    })
  }

  const resetEmpty = () => {
    setEditingId(null)
    setShiftDate(todayYmd())
    setFields(emptyShiftFields())
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
      window.alert('接更紀錄已提交')
      resetEmpty()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '提交失敗')
    }
  }

  const canSubmit = loaded?.status === 'DRAFT'

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>開工接更（PDF 02【5b】）</h2>
      <p className={uiTokens.sectionHelp}>
        依 SOP 完成代表確認、部門與院舍資訊、注意事項；提交前請查閱歷史紀錄並簽名。
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-3">
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>開工／接班日期</span>
            <input
              type="date"
              className={uiTokens.formInput}
              disabled={readOnly}
              value={shiftDate}
              onChange={(event) => setShiftDate(event.target.value)}
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>① 代表／承諾</span>
            <textarea
              className={uiTokens.formTextarea}
              readOnly={readOnly}
              value={fields.representativeNote}
              onChange={(event) => patchField('representativeNote', event.target.value)}
              placeholder="值班代表身分與承諾事項…"
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>② 部門概覽</span>
            <textarea
              className={uiTokens.formTextarea}
              readOnly={readOnly}
              value={fields.departmentOverview}
              onChange={(event) => patchField('departmentOverview', event.target.value)}
              placeholder="人力／設備／交班摘要…"
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>③ 院舍資訊</span>
            <textarea
              className={uiTokens.formTextarea}
              readOnly={readOnly}
              value={fields.facilityInfoAcknowledgement}
              onChange={(event) => patchField('facilityInfoAcknowledgement', event.target.value)}
              placeholder="已閱讀並確認院舍動態／床位／設施…"
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>④ 注意事項</span>
            <textarea
              className={uiTokens.formTextarea}
              readOnly={readOnly}
              value={fields.precautionsAcknowledgement}
              onChange={(event) => patchField('precautionsAcknowledgement', event.target.value)}
              placeholder="感染控制／高風險院友／環境安全…"
            />
          </label>
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
          <div className="flex flex-wrap gap-2">
            <button type="button" className={uiTokens.btnSecondary} disabled={readOnly} onClick={runSaveDraft}>
              儲存草稿
            </button>
            <button type="button" className={uiTokens.btnPrimary} disabled={!canSubmit || readOnly} onClick={runSubmit}>
              提交接更紀錄
            </button>
            <button type="button" className={uiTokens.btnCompact} onClick={resetEmpty}>
              新增一筆
            </button>
          </div>
        </div>

        <ShiftStartHandoverHistoryAside submittedHistory={workspace.submittedHistory} onSelect={loadRow} />
      </div>

      <div className="mt-8">
        <h3 className={uiTokens.blockHeading}>我的草稿與紀錄</h3>
        {myRecords.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">尚無紀錄。</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 text-sm">
            {myRecords.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <div>
                  <span className="font-medium">{row.shiftDate}</span>
                  <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs">
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
