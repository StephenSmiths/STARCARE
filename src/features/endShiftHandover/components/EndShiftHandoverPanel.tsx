import { uiTokens } from '../../shared/ui/uiTokens'
import type { EndShiftHandoverWorkspace } from '../hooks/useEndShiftHandoverWorkspace'
import { useEndShiftHandoverPanel } from '../hooks/useEndShiftHandoverPanel'
import { EndShiftHandoverHistoryAside } from './EndShiftHandoverHistoryAside'
import { END_SHIFT_HANDOVER_TEXT_BLOCKS } from './endShiftHandoverPanelFieldMeta'
import { EndShiftHandoverMyRecordsList } from './EndShiftHandoverMyRecordsList'

/** PDF 02【6】收工交更表單 */
export const EndShiftHandoverPanel = ({ workspace }: { workspace: EndShiftHandoverWorkspace }) => {
  const vm = useEndShiftHandoverPanel(workspace)

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
              disabled={vm.readOnly}
              value={vm.shiftDate}
              onChange={(event) => vm.setShiftDate(event.target.value)}
            />
          </label>
          {END_SHIFT_HANDOVER_TEXT_BLOCKS.map(({ key, label, placeholder }) => (
            <label key={key} className={uiTokens.formFieldStack}>
              <span className={uiTokens.formLabel}>{label}</span>
              <textarea
                className={uiTokens.formTextarea}
                readOnly={vm.readOnly}
                value={vm.fields[key]}
                onChange={(event) => vm.patchField(key, event.target.value)}
                placeholder={placeholder}
              />
            </label>
          ))}
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
              提交交更紀錄
            </button>
            <button type="button" className={uiTokens.btnCompact} onClick={vm.resetEmpty}>
              新增一筆
            </button>
          </div>
        </div>

        <EndShiftHandoverHistoryAside submittedHistory={workspace.submittedHistory} onSelect={vm.loadRow} />
      </div>

      <EndShiftHandoverMyRecordsList records={vm.myRecords} onLoadRow={vm.loadRow} />
    </section>
  )
}
