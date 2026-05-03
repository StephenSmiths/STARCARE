import { useMemo, useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { ServiceFormsWorkspace } from '../hooks/useServiceFormsWorkspace'
import type { ServiceFormRecord } from '../types/serviceForm'
import { todayYmd } from './serviceFormStaffPanelUtils'
import { ServiceFormMyFormsList } from './ServiceFormMyFormsList'

export const ServiceFormStaffPanel = ({ workspace }: { workspace: ServiceFormsWorkspace }) => {
  const [selectedDate, setSelectedDate] = useState(todayYmd())
  const [sessionId, setSessionId] = useState('')
  const [residentId, setResidentId] = useState('')
  const [narrative, setNarrative] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const sessionsOfDay = useMemo(
    () => workspace.acceptedOwnSessions.filter((row) => row.date === selectedDate),
    [workspace.acceptedOwnSessions, selectedDate],
  )

  const selectedSession = workspace.sessions.find((item) => item.id === sessionId) ?? null

  const loadForm = (row: ServiceFormRecord) => {
    setEditingId(row.id)
    setSessionId(row.sessionId)
    setSelectedDate(row.sessionDate)
    setResidentId(row.residentId)
    setNarrative(row.narrative)
  }

  const resetEmpty = () => {
    setEditingId(null)
    setSessionId('')
    setResidentId('')
    setNarrative('')
  }

  const residentName =
    workspace.residents.find((item) => item.id === residentId)?.name ?? ''

  const runSaveDraft = () => {
    if (!selectedSession) {
      window.alert('請選擇已接收之工作節')
      return
    }
    if (!residentId) {
      window.alert('請選擇院友')
      return
    }
    try {
      const saved = workspace.saveDraft(selectedSession, residentId, residentName, narrative, editingId)
      setEditingId(saved.id)
      window.alert('草稿已儲存')
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '儲存失敗')
    }
  }

  const runSoftDelete = async (row: ServiceFormRecord) => {
    if (!window.confirm('確定軟刪除此表單？核准後之紀錄不可刪；刪除後將自清單移除。')) return
    try {
      await workspace.softDelete(row)
      if (editingId === row.id) resetEmpty()
      window.alert('已軟刪除')
      void workspace.reloadContext()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '軟刪除失敗')
    }
  }

  const runSubmit = () => {
    const record = workspace.myForms.find((item) => item.id === editingId)
    const sess = workspace.sessions.find((item) => item.id === sessionId)
    if (!record || !sess) {
      window.alert('請先選擇草稿並確認工作節')
      return
    }
    try {
      workspace.submit(record, sess)
      window.alert('已提交待主管審核')
      void workspace.reloadContext()
      resetEmpty()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '提交失敗')
    }
  }

  const currentDraft =
    editingId !== null ? workspace.myForms.find((item) => item.id === editingId) ?? null : null

  const canSubmit =
    currentDraft &&
    (currentDraft.status === 'DRAFT' || currentDraft.status === 'REJECTED_NEEDS_REVISION')

  const readOnly =
    currentDraft?.status === 'SUBMITTED' ||
    currentDraft?.status === 'APPROVED'

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>填寫服務表單（Staff）</h2>
      <p className={uiTokens.sectionHelp}>
        01 §2.1／§2.2：僅<strong>已接收</strong>工作節可提交；核准後鎖定不可編輯。
        <a href="#work-session-plans" className="ml-2 text-violet-700 underline">
          前往工作計劃接收班次
        </a>
      </p>
      {workspace.staffProfileId === null ? (
        <p className="mt-2 text-xs text-amber-800">請設定 starcare_staff_profile_id 以載入您的已接收班次。</p>
      ) : null}
      {sessionsOfDay.length === 0 ? (
        <p className="mt-2 text-xs text-slate-600">
          此日期無「已接收」工作節（或尚未於工作計劃按接收）。
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>服務日期</span>
          <input
            type="date"
            className={uiTokens.formInput}
            disabled={readOnly}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>工作節（已接收）</span>
          <select
            className={uiTokens.formSelect}
            disabled={readOnly}
            value={sessionId}
            onChange={(event) => setSessionId(event.target.value)}
          >
            <option value="">請選擇</option>
            {sessionsOfDay.map((item) => (
              <option key={item.id} value={item.id}>
                {item.timeSlot} · {item.serviceType === 'Dementia_Service' ? '認知' : '復康'} · {item.id.slice(0, 12)}…
              </option>
            ))}
          </select>
        </label>
        <label className={`${uiTokens.formFieldStack} sm:col-span-2`}>
          <span className={uiTokens.formLabel}>院友</span>
          <select
            className={uiTokens.formSelect}
            disabled={readOnly}
            value={residentId}
            onChange={(event) => setResidentId(event.target.value)}
          >
            <option value="">請選擇</option>
            {workspace.residents.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}（{item.bedNumber}）
              </option>
            ))}
          </select>
        </label>
        <label className={`${uiTokens.formFieldStack} sm:col-span-2`}>
          <span className={uiTokens.formLabel}>服務紀要</span>
          <textarea
            className={uiTokens.formTextarea}
            readOnly={readOnly}
            value={narrative}
            onChange={(event) => setNarrative(event.target.value)}
            placeholder="簡述本次服務內容…"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={uiTokens.btnSecondary} disabled={readOnly} onClick={runSaveDraft}>
          儲存草稿
        </button>
        <button type="button" className={uiTokens.btnPrimary} disabled={!canSubmit || readOnly} onClick={runSubmit}>
          提交審核
        </button>
        <button type="button" className={uiTokens.btnCompact} onClick={resetEmpty}>
          清空表單
        </button>
      </div>

      <div className="mt-8">
        <h3 className={uiTokens.blockHeading}>我的表單</h3>
        <p className="mt-1 text-xs text-slate-500">01 §5：非核准表單可軟刪除（本機＋資料庫 is_deleted）。</p>
        <ServiceFormMyFormsList forms={workspace.myForms} onLoadForm={loadForm} onSoftDelete={runSoftDelete} />
      </div>
    </section>
  )
}
