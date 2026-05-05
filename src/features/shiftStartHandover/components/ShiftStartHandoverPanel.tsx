import { uiTokens } from '../../shared/ui/uiTokens'
import type { ShiftStartHandoverWorkspace } from '../hooks/useShiftStartHandoverWorkspace'
import { useShiftStartHandoverPanel } from '../hooks/useShiftStartHandoverPanel'
import { ShiftStartHandoverHistoryAside } from './ShiftStartHandoverHistoryAside'
import { ShiftStartHandoverMyRecordsList } from './ShiftStartHandoverMyRecordsList'

/** PDF 02【5b】六步：①～④表單、⑤歷史側欄、⑥簽名 */
export const ShiftStartHandoverPanel = ({ workspace }: { workspace: ShiftStartHandoverWorkspace }) => {
  const vm = useShiftStartHandoverPanel(workspace)

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>開工接更（PDF 02【5b】）</h2>
      <p className={uiTokens.sectionHelp}>
        依 SOP 完成代表確認、部門與院舍資訊、注意事項；提交前請查閱歷史紀錄並簽名。
      </p>

      <div className={uiTokens.handoverEditorGrid}>
        <div className={uiTokens.layoutGridGap3}>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>開工／接班日期</span>
            <input
              type="date"
              className={uiTokens.formInput}
              disabled={vm.readOnly}
              value={vm.shiftDate}
              onChange={(event) => vm.setShiftDate(event.target.value)}
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>① 代表／承諾</span>
            <textarea
              className={uiTokens.formTextarea}
              readOnly={vm.readOnly}
              value={vm.fields.representativeNote}
              onChange={(event) => vm.patchField('representativeNote', event.target.value)}
              placeholder="值班代表身分與承諾事項…"
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>② 部門概覽</span>
            <textarea
              className={uiTokens.formTextarea}
              readOnly={vm.readOnly}
              value={vm.fields.departmentOverview}
              onChange={(event) => vm.patchField('departmentOverview', event.target.value)}
              placeholder="人力／設備／交班摘要…"
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>③ 院舍資訊</span>
            <textarea
              className={uiTokens.formTextarea}
              readOnly={vm.readOnly}
              value={vm.fields.facilityInfoAcknowledgement}
              onChange={(event) => vm.patchField('facilityInfoAcknowledgement', event.target.value)}
              placeholder="已閱讀並確認院舍動態／床位／設施…"
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>④ 注意事項</span>
            <textarea
              className={uiTokens.formTextarea}
              readOnly={vm.readOnly}
              value={vm.fields.precautionsAcknowledgement}
              onChange={(event) => vm.patchField('precautionsAcknowledgement', event.target.value)}
              placeholder="感染控制／高風險院友／環境安全…"
            />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>⑥ 簽名（姓名）</span>
            <input
              type="text"
              className={uiTokens.formInput}
              readOnly={vm.readOnly}
              value={vm.fields.signatureName}
              onChange={(event) => vm.patchField('signatureName', event.target.value)}
              placeholder="請輸入全名"
            />
          </label>
          <div className={uiTokens.layoutFlexWrapGap2}>
            <button type="button" className={uiTokens.btnSecondary} disabled={vm.readOnly} onClick={vm.runSaveDraft}>
              儲存草稿
            </button>
            <button
              type="button"
              className={uiTokens.btnPrimary}
              disabled={!vm.canSubmit || vm.readOnly}
              onClick={vm.runSubmit}
            >
              提交接更紀錄
            </button>
            <button type="button" className={uiTokens.btnCompact} onClick={vm.resetEmpty}>
              新增一筆
            </button>
          </div>
        </div>

        <ShiftStartHandoverHistoryAside submittedHistory={workspace.submittedHistory} onSelect={vm.loadRow} />
      </div>

      <ShiftStartHandoverMyRecordsList records={vm.myRecords} onLoadRow={vm.loadRow} />
    </section>
  )
}
