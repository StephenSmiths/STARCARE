import { uiTokens } from '../../shared/ui/uiTokens'
import { useWorkPlanComposer } from '../hooks/useWorkPlanComposer'
import { WorkPlanSopStepper } from './WorkPlanSopStepper'

/** PDF 02【2】日期／員工／工作節欄位、預覽、儲存即發布時段（Seq 14） */
export const WorkPlanComposerPanel = () => {
  const {
    staffRows,
    activities,
    metaLoading,
    metaError,
    drafts,
    sessionDate,
    setSessionDate,
    staffProfileId,
    setStaffProfileId,
    timeSlot,
    setTimeSlot,
    capacity,
    setCapacity,
    serviceType,
    setServiceType,
    formError,
    addDraft,
    removeDraft,
    commitDrafts,
    commitError,
    commitSuccess,
    isCommitting,
  } = useWorkPlanComposer()

  const rehabCount = activities.filter((a) => a.serviceType === 'Subsidized_Rehab').length
  const dementiaCount = activities.filter((a) => a.serviceType === 'Dementia_Care').length

  if (metaLoading) {
    return <p className={uiTokens.moduleDescription}>載入工作計劃表單…</p>
  }

  if (metaError) {
    return <p className={uiTokens.inlineDangerCompact}>{metaError}</p>
  }

  return (
    <div className={uiTokens.stackVertical}>
      <WorkPlanSopStepper
        sessionDate={sessionDate}
        staffProfileId={staffProfileId}
        timeSlot={timeSlot}
        capacity={capacity}
        draftsCount={drafts.length}
        commitSuccess={commitSuccess}
        isCommitting={isCommitting}
      />
      <p className={uiTokens.sectionHelp}>
        選擇日期與員工後加入預覽；儲存後將寫入活動時段主檔（等同指派該員工於該時段承接工作節）。活動項目暫依服務類型自動對應主檔第一筆。
      </p>
      <p className={uiTokens.textSubtleXs}>
        已載入活動主檔：資助復康 {rehabCount} 筆、認知 {dementiaCount} 筆
      </p>

      <div className={uiTokens.composerFieldGrid}>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>日期</span>
          <input
            type="date"
            className={uiTokens.formInput}
            value={sessionDate}
            onChange={(event) => setSessionDate(event.target.value)}
          />
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>員工</span>
          <select
            className={uiTokens.formSelect}
            value={staffProfileId}
            onChange={(event) => setStaffProfileId(event.target.value)}
          >
            <option value="">請選擇</option>
            {staffRows.map((row) => (
              <option key={row.staffId} value={row.staffId}>
                {row.roleType ? `${row.staffName}（${row.roleType}）` : row.staffName} · {row.staffId}
              </option>
            ))}
          </select>
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>時段</span>
          <input
            className={uiTokens.formInput}
            value={timeSlot}
            onChange={(event) => setTimeSlot(event.target.value)}
            placeholder="09:00"
          />
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>名額</span>
          <input
            type="number"
            min={1}
            className={uiTokens.formInput}
            value={capacity}
            onChange={(event) => setCapacity(Number(event.target.value))}
          />
        </label>
        <label className={uiTokens.formFieldStackSmColSpan2Lg1}>
          <span className={uiTokens.formLabel}>服務類型（01 §3 軌道）</span>
          <select
            className={uiTokens.formSelect}
            value={serviceType}
            onChange={(event) =>
              setServiceType(event.target.value as 'Subsidized_Rehab' | 'Dementia_Care')
            }
          >
            <option value="Subsidized_Rehab">資助復康服務</option>
            <option value="Dementia_Care">認知障礙症服務</option>
          </select>
        </label>
      </div>

      {formError ? <p className={uiTokens.formInlineError}>{formError}</p> : null}

      <div className={uiTokens.layoutFlexWrapGap2}>
        <button type="button" className={uiTokens.btnSecondary} onClick={addDraft}>
          加入預覽
        </button>
        <button
          type="button"
          className={uiTokens.btnPrimary}
          disabled={drafts.length === 0 || isCommitting}
          onClick={() => void commitDrafts()}
        >
          {isCommitting ? '儲存中…' : '儲存並發布時段'}
        </button>
      </div>

      {commitError ? <p className={uiTokens.formInlineError}>{commitError}</p> : null}
      {commitSuccess ? <p className={uiTokens.inlineSuccessText}>{commitSuccess}</p> : null}

      <div className={uiTokens.composerPreviewShell}>
        <h3 className={uiTokens.blockHeading}>預覽列表</h3>
        {drafts.length === 0 ? (
          <p className={uiTokens.blockHelpMt2}>尚無列；請填妥上方欄位後按「加入預覽」。</p>
        ) : (
          <ul className={uiTokens.composerDraftList}>
            {drafts.map((row, index) => (
              <li key={`${row.sessionDate}-${row.staffProfileId}-${row.timeSlot}-${index}`} className={uiTokens.layoutFlexWrapBetweenGap2Py2}>
                <span>
                  {row.sessionDate} · {row.staffDisplayName || row.staffProfileId} · {row.timeSlot} · 名額{' '}
                  {row.capacity} ·{' '}
                  {row.serviceType === 'Subsidized_Rehab' ? '資助復康' : '認知'}
                </span>
                <button type="button" className={uiTokens.btnDangerOutline} onClick={() => removeDraft(index)}>
                  移除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
