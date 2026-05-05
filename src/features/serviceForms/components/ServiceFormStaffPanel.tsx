import { uiTokens } from '../../shared/ui/uiTokens'
import type { ServiceFormsWorkspace } from '../hooks/useServiceFormsWorkspace'
import { useServiceFormStaffPanel } from '../hooks/useServiceFormStaffPanel'
import { ServiceFormMyFormsList } from './ServiceFormMyFormsList'

export const ServiceFormStaffPanel = ({ workspace }: { workspace: ServiceFormsWorkspace }) => {
  const vm = useServiceFormStaffPanel(workspace)

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>填寫服務表單（Staff）</h2>
      <p className={uiTokens.sectionHelp}>
        01 §2.1／§2.2：僅<strong>已接收</strong>工作節可提交；核准後鎖定不可編輯。
        <a href="#work-session-plans" className={uiTokens.hashLinkAccentMl2}>
          前往工作計劃接收班次
        </a>
      </p>
      {workspace.staffProfileId === null ? (
        <p className={uiTokens.textUrgentHintMt2}>請設定 starcare_staff_profile_id 以載入您的已接收班次。</p>
      ) : null}
      {vm.sessionsOfDay.length === 0 ? (
        <p className={uiTokens.blockHelpMt2}>此日期無「已接收」工作節（或尚未於工作計劃按接收）。</p>
      ) : null}

      <div className={uiTokens.formGridTwoCol}>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>服務日期</span>
          <input
            type="date"
            className={uiTokens.formInput}
            disabled={vm.readOnly}
            value={vm.selectedDate}
            onChange={(event) => vm.setSelectedDate(event.target.value)}
          />
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>工作節（已接收）</span>
          <select
            className={uiTokens.formSelect}
            disabled={vm.readOnly}
            value={vm.sessionId}
            onChange={(event) => vm.setSessionId(event.target.value)}
          >
            <option value="">請選擇</option>
            {vm.sessionsOfDay.map((item) => (
              <option key={item.id} value={item.id}>
                {item.timeSlot} · {item.serviceType === 'Dementia_Service' ? '認知' : '復康'} · {item.id.slice(0, 12)}…
              </option>
            ))}
          </select>
        </label>
        <label className={uiTokens.formFieldStackSmColSpan2}>
          <span className={uiTokens.formLabel}>院友</span>
          <select
            className={uiTokens.formSelect}
            disabled={vm.readOnly}
            value={vm.residentId}
            onChange={(event) => vm.setResidentId(event.target.value)}
          >
            <option value="">請選擇</option>
            {workspace.residents.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}（{item.bedNumber}）
              </option>
            ))}
          </select>
        </label>
        <label className={uiTokens.formFieldStackSmColSpan2}>
          <span className={uiTokens.formLabel}>服務紀要</span>
          <textarea
            className={uiTokens.formTextarea}
            readOnly={vm.readOnly}
            value={vm.narrative}
            onChange={(event) => vm.setNarrative(event.target.value)}
            placeholder="簡述本次服務內容…"
          />
        </label>
      </div>
      <div className={uiTokens.formToolbarRow}>
        <button type="button" className={uiTokens.btnSecondary} disabled={vm.readOnly} onClick={vm.runSaveDraft}>
          儲存草稿
        </button>
        <button
          type="button"
          className={uiTokens.btnPrimary}
          disabled={!vm.canSubmit || vm.readOnly}
          onClick={vm.runSubmit}
        >
          提交審核
        </button>
        <button type="button" className={uiTokens.btnCompact} onClick={vm.resetEmpty}>
          清空表單
        </button>
      </div>

      <div className={uiTokens.layoutSpacerMt8}>
        <h3 className={uiTokens.blockHeading}>我的表單</h3>
        <p className={uiTokens.helpFinePrint}>01 §5：非核准表單可軟刪除（本機＋資料庫 is_deleted）。</p>
        <ServiceFormMyFormsList forms={workspace.myForms} onLoadForm={vm.loadForm} onSoftDelete={vm.runSoftDelete} />
      </div>
    </section>
  )
}
