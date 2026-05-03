import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useAssessmentManagementWorkspace } from '../hooks/useAssessmentManagementWorkspace'
import { AssessmentCompletionForm } from './AssessmentCompletionForm'
import { AssessmentManagementTables } from './AssessmentManagementTables'
import { AssessmentSummaryCards } from './AssessmentSummaryCards'

/** PDF 02【9】評估管理（到期／逾期／完成率／PT·OT 版本本地紀錄） */
export const AssessmentManagementHome = () => {
  const auditTrail = useAuditTrailList()
  const {
    residents,
    completions,
    overdueRows,
    dueSoonTasks,
    completionRatePercent,
    loadError,
    isLoading,
    submitError,
    isSubmitting,
    reload,
    submitCompletion,
  } = useAssessmentManagementWorkspace()

  if (isLoading) {
    return <p className="text-sm text-slate-600">載入評估管理資料…</p>
  }

  if (loadError) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-700">{loadError}</p>
        <button type="button" className={uiTokens.btnSecondary} onClick={() => void reload()}>
          重試
        </button>
      </div>
    )
  }

  return (
    <div className={uiTokens.stackVertical}>
      <p className="text-sm text-slate-600">
        週期與待辦規則對齊 Seq 9（入住起每 180 日）；完成紀錄暫存於瀏覽器，正式環境應寫入資料庫並軟刪除。
      </p>
      <AssessmentSummaryCards
        dueSoonCount={dueSoonTasks.length}
        overdueCount={overdueRows.length}
        completionRatePercent={completionRatePercent}
      />
      <AssessmentCompletionForm
        residents={residents}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onSubmit={submitCompletion}
      />
      <AssessmentManagementTables
        overdueRows={overdueRows}
        dueSoonTasks={dueSoonTasks}
        history={completions}
      />
      <AuditTrailPanel
        title="評估相關審計（全域軌跡節錄）"
        help="含 ASSESSMENT_COMPLETION_RECORD；完整軌跡亦見智能排班／院友頁。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
