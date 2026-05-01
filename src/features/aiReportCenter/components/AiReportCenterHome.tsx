import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { uiTokens } from '../../shared/ui/uiTokens'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { useAiReportCenterWorkspace } from '../hooks/useAiReportCenterWorkspace'
import { AiReportComposer } from './AiReportComposer'
import { AiReportList } from './AiReportList'

/** PDF 02【11】AI 報告中心（Team Lead／Admin） */
export const AiReportCenterHome = () => {
  const ws = useAiReportCenterWorkspace()

  return (
    <div className={uiTokens.stackVertical}>
      <p className="text-sm text-slate-600">
        生成為占位文案；編輯後採用鎖定，再發放標記完成。AI 推理與對象發送後端接上後取代占位。
      </p>
      <div className="flex gap-2">
        <button type="button" className={uiTokens.btnSecondary} onClick={() => ws.reload()}>
          重新載入
        </button>
      </div>
      <AiReportComposer
        titleInput={ws.titleInput}
        onTitleChange={ws.setTitleInput}
        onGenerate={() => ws.generateDraft()}
      />
      {ws.error ? <p className="text-sm text-red-700">{ws.error}</p> : null}
      <AiReportList
        rows={ws.reports}
        editId={ws.editId}
        editBody={ws.editBody}
        onEditBody={ws.setEditBody}
        onOpenDraft={ws.openDraftEditor}
        onSaveBody={() => ws.saveDraftBody()}
        onAdopt={(id) => ws.adopt(id)}
        onDistribute={(id) => ws.distribute(id)}
      />
      <AuditTrailPanel
        title="報告中心審計"
        help="含 AI_REPORT_CENTER_* 動作。"
        auditTrail={globalAuditTrailService.list()}
      />
    </div>
  )
}
