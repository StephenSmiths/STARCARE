import { uiTokens } from '../../shared/ui/uiTokens'

type Props = {
  dueSoonCount: number
  overdueCount: number
  completionRatePercent: number
}

/** PDF 02【9】摘要：14 天內到期、逾期、本週期完成率 */
export const AssessmentSummaryCards = ({ dueSoonCount, overdueCount, completionRatePercent }: Props) => (
  <div className={uiTokens.layoutGridGap4SmCols3}>
    <div className={uiTokens.surfaceCardCompact}>
      <p className={uiTokens.dashboardStatTileLabel}>14 天內到期（估算）</p>
      <p className={uiTokens.dashboardStatTileValue}>{dueSoonCount}</p>
      <p className={uiTokens.blockHelp}>對齊 Seq 9：入住日起每 180 日</p>
    </div>
    <div className={uiTokens.surfaceCardCompact}>
      <p className={uiTokens.dashboardStatTileLabel}>逾期（錨點後逾寬限仍缺科）</p>
      <p className={uiTokens.dashboardStatTileValueRed800}>{overdueCount}</p>
      <p className={uiTokens.blockHelp}>錨點後逾 14 天未齊 PT／OT</p>
    </div>
    <div className={uiTokens.surfaceCardCompact}>
      <p className={uiTokens.dashboardStatTileLabel}>本週期完成率</p>
      <p className={uiTokens.dashboardStatTileValueEmerald800}>{completionRatePercent}%</p>
      <p className={uiTokens.blockHelp}>每位院友最近錨點須 PT+OT 皆登錄</p>
    </div>
  </div>
)
