import { uiTokens } from '../../shared/ui/uiTokens'
import type { FormSubmissionOverview } from '../services/workAnalysisReviewSummaryService'

type Props = { overview: FormSubmissionOverview }

/** PDF 02【7】提交概況卡片 */
export const SubmissionOverviewCards = ({ overview }: Props) => (
  <section className={uiTokens.surfaceCardCompact}>
    <h2 className={uiTokens.pageSectionHeading}>提交概況</h2>
    <p className={uiTokens.sectionHelp}>資料來源：本地服務表單存檔（Seq 17）；正式版應對齊後端報表。</p>
    <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <dt className="text-xs text-slate-500">總筆數</dt>
        <dd className="text-xl font-semibold text-slate-900">{overview.total}</dd>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <dt className="text-xs text-slate-500">草稿</dt>
        <dd className="text-xl font-semibold text-amber-800">{overview.draft}</dd>
      </div>
      <div className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2">
        <dt className="text-xs text-violet-700">待審</dt>
        <dd className="text-xl font-semibold text-violet-900">{overview.submitted}</dd>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <dt className="text-xs text-slate-500">已核准</dt>
        <dd className="text-xl font-semibold text-emerald-800">{overview.approved}</dd>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <dt className="text-xs text-slate-500">退回重改</dt>
        <dd className="text-xl font-semibold text-red-800">{overview.rejectedNeedsRevision}</dd>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <dt className="text-xs text-slate-500">待審涉及填表人</dt>
        <dd className="text-xl font-semibold text-slate-900">{overview.pendingOwnerCount}</dd>
      </div>
    </dl>
  </section>
)
