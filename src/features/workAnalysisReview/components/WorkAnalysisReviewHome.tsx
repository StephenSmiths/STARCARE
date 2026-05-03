import { useMemo } from 'react'
import { ServiceFormReviewPanel } from '../../serviceForms/components/ServiceFormReviewPanel'
import { useServiceFormsWorkspace } from '../../serviceForms/hooks/useServiceFormsWorkspace'
import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { buildFormSubmissionOverview } from '../services/workAnalysisReviewSummaryService'
import { FeedbackAndNotifyStubs } from './FeedbackAndNotifyStubs'
import { SubmissionOverviewCards } from './SubmissionOverviewCards'
import { TeamReportActionsPanel } from './TeamReportActionsPanel'

/** PDF 02【7】智能工作分析／表單審核（主管視角；Staff 無此路由） */
export const WorkAnalysisReviewHome = () => {
  const auditTrail = useAuditTrailList()
  const workspace = useServiceFormsWorkspace()

  const overview = useMemo(
    () => buildFormSubmissionOverview(workspace.allForms),
    [workspace.allForms],
  )

  if (workspace.isLoading) {
    return <p className="text-sm text-slate-600">載入分析模組…</p>
  }

  if (workspace.loadError) {
    return <p className="text-sm text-red-700">{workspace.loadError}</p>
  }

  return (
    <div className={uiTokens.stackVertical}>
      <SubmissionOverviewCards overview={overview} />
      <TeamReportActionsPanel overview={overview} pendingReview={workspace.pendingReview} />
      <ServiceFormReviewPanel workspace={workspace} />
      <FeedbackAndNotifyStubs />
      <AuditTrailPanel
        title="表單與審批相關審計（全域）"
        help="含 FORM_SUBMIT／APPROVE／REJECT_REVISION／SOFT_DELETE 等；與通知中心同源（PDF 02【7】／Seq 20）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
