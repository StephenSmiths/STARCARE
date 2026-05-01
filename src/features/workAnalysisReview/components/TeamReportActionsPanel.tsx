import { useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import type { FormSubmissionOverview } from '../services/workAnalysisReviewSummaryService'
import { buildTeamReportPlainText } from '../services/workAnalysisReviewSummaryService'

type Props = {
  overview: FormSubmissionOverview
  pendingReview: ServiceFormRecord[]
}

/** PDF 02【7】團隊報告：產生純文字摘要供複製 */
export const TeamReportActionsPanel = ({ overview, pendingReview }: Props) => {
  const [busy, setBusy] = useState(false)

  const runCopy = async () => {
    const text = buildTeamReportPlainText(overview, pendingReview)
    setBusy(true)
    try {
      await navigator.clipboard.writeText(text)
      window.alert('已複製團隊報告摘要至剪貼簿')
    } catch {
      window.prompt('請手動複製下列文字：', text)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>團隊報告</h2>
      <p className={uiTokens.sectionHelp}>將提交概況與待審清單彙整為一段文字，便於貼至郵件或內部文件。</p>
      <button type="button" className={uiTokens.btnSecondary} disabled={busy} onClick={() => void runCopy()}>
        複製報告摘要到剪貼簿
      </button>
    </section>
  )
}
