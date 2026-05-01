import { uiTokens } from '../../shared/ui/uiTokens'

type Props = {
  dueSoonCount: number
  overdueCount: number
  completionRatePercent: number
}

/** PDF 02【9】摘要：14 天內到期、逾期、本週期完成率 */
export const AssessmentSummaryCards = ({ dueSoonCount, overdueCount, completionRatePercent }: Props) => (
  <div className="grid gap-4 sm:grid-cols-3">
    <div className={uiTokens.surfaceCardCompact}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">14 天內到期（估算）</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{dueSoonCount}</p>
      <p className="mt-1 text-xs text-slate-600">對齊 Seq 9：入住日起每 180 日</p>
    </div>
    <div className={uiTokens.surfaceCardCompact}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">逾期（錨點後逾寬限仍缺科）</p>
      <p className="mt-2 text-2xl font-semibold text-red-800">{overdueCount}</p>
      <p className="mt-1 text-xs text-slate-600">錨點後逾 14 天未齊 PT／OT</p>
    </div>
    <div className={uiTokens.surfaceCardCompact}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">本週期完成率</p>
      <p className="mt-2 text-2xl font-semibold text-emerald-800">{completionRatePercent}%</p>
      <p className="mt-1 text-xs text-slate-600">每位院友最近錨點須 PT+OT 皆登錄</p>
    </div>
  </div>
)
