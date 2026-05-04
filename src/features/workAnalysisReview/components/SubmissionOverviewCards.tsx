import { uiTokens } from '../../shared/ui/uiTokens'
import type { FormSubmissionOverview } from '../services/workAnalysisReviewSummaryService'

type Props = { overview: FormSubmissionOverview }

/** PDF 02【7】提交概況卡片 */
export const SubmissionOverviewCards = ({ overview }: Props) => (
  <section className={uiTokens.surfaceCardCompact}>
    <h2 className={uiTokens.pageSectionHeading}>提交概況</h2>
    <p className={uiTokens.sectionHelp}>資料來源：本地服務表單存檔（Seq 17）；正式版應對齊後端報表。</p>
    <dl className={uiTokens.layoutGridGap3Mt4Sm2Lg3}>
      <div className={uiTokens.submissionStatTile}>
        <dt className={uiTokens.textSubtleXs}>總筆數</dt>
        <dd className={uiTokens.statDdXlSlate900}>{overview.total}</dd>
      </div>
      <div className={uiTokens.submissionStatTile}>
        <dt className={uiTokens.textSubtleXs}>草稿</dt>
        <dd className={uiTokens.statDdXlAmber800}>{overview.draft}</dd>
      </div>
      <div className={uiTokens.submissionStatTileViolet}>
        <dt className={uiTokens.textSubtleXsViolet700}>待審</dt>
        <dd className={uiTokens.statDdXlViolet900}>{overview.submitted}</dd>
      </div>
      <div className={uiTokens.submissionStatTile}>
        <dt className={uiTokens.textSubtleXs}>已核准</dt>
        <dd className={uiTokens.statDdXlEmerald800}>{overview.approved}</dd>
      </div>
      <div className={uiTokens.submissionStatTile}>
        <dt className={uiTokens.textSubtleXs}>退回重改</dt>
        <dd className={uiTokens.statDdXlRed800}>{overview.rejectedNeedsRevision}</dd>
      </div>
      <div className={uiTokens.submissionStatTile}>
        <dt className={uiTokens.textSubtleXs}>待審涉及填表人</dt>
        <dd className={uiTokens.statDdXlSlate900}>{overview.pendingOwnerCount}</dd>
      </div>
    </dl>
  </section>
)
