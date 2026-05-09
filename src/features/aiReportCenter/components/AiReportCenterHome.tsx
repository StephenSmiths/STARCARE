import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { ListSectionPanel } from '../../shared/components/ListSectionPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useAiReportCenterWorkspace } from '../hooks/useAiReportCenterWorkspace'
import { AiReportComposer } from './AiReportComposer'
import { AiReportList } from './AiReportList'

/** PDF 02【11】AI 報告中心（Team Lead／Admin） */
export const AiReportCenterHome = () => {
  const auditTrail = useAuditTrailList()
  const ws = useAiReportCenterWorkspace()

  return (
    <div className={uiTokens.stackVertical}>
      <p className={uiTokens.textBodySubtleSm}>
        生成為占位文案；編輯後採用鎖定，再發放標記完成。AI 推理與對象發送後端接上後取代占位。
      </p>
      <div className={uiTokens.layoutFlexGap2}>
        <button type="button" className={uiTokens.btnSecondary} onClick={() => ws.reload()}>
          重新載入
        </button>
      </div>
      <ListSectionPanel title="報告草稿生成" defaultExpanded>
        <AiReportComposer
          titleInput={ws.titleInput}
          onTitleChange={ws.setTitleInput}
          onGenerate={() => ws.generateDraft()}
        />
      </ListSectionPanel>
      {ws.error ? <p className={uiTokens.formInlineError}>{ws.error}</p> : null}
      <ListSectionPanel title="報告清單" summary={`${ws.reports.length} 筆`} defaultExpanded={false}>
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
      </ListSectionPanel>
      <AuditTrailPanel
        title="報告中心審計"
        help="含 AI_REPORT_CENTER_* 動作。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
