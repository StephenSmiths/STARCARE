import { uiTokens } from '../../shared/ui/uiTokens'
import { useWorkPlanComposer } from '../hooks/useWorkPlanComposer'
import { WorkPlanComposerDraftPreview } from './WorkPlanComposerDraftPreview'
import { WorkPlanComposerFieldGrid } from './WorkPlanComposerFieldGrid'
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

      <WorkPlanComposerFieldGrid
        sessionDate={sessionDate}
        onSessionDateChange={setSessionDate}
        staffRows={staffRows}
        staffProfileId={staffProfileId}
        onStaffProfileIdChange={setStaffProfileId}
        timeSlot={timeSlot}
        onTimeSlotChange={setTimeSlot}
        capacity={capacity}
        onCapacityChange={setCapacity}
        serviceType={serviceType}
        onServiceTypeChange={setServiceType}
      />

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

      <WorkPlanComposerDraftPreview drafts={drafts} onRemoveDraft={removeDraft} />
    </div>
  )
}
