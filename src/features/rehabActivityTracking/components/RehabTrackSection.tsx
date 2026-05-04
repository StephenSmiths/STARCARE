import { uiTokens } from '../../shared/ui/uiTokens'
import type { RehabActivityTrackSnapshot } from '../services/rehabActivityTrackingSnapshotService'

const dementiaZh = (level: string | undefined): string => {
  if (level === 'Severe') return '重度'
  if (level === 'Moderate') return '中度'
  if (level === 'Mild') return '輕度'
  return '—'
}

type Props = {
  snapshot: RehabActivityTrackSnapshot
  showDementiaColumn: boolean
}

/** PDF 02【8】單軌合規總覽＋完成列表 */
export const RehabTrackSection = ({ snapshot, showDementiaColumn }: Props) => {
  const colSpan = showDementiaColumn ? 5 : 4
  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>{snapshot.trackLabel}</h2>
      <p className={uiTokens.sectionHelp}>
        納入院友 {snapshot.cohortCount} 人｜本週可用時段 {snapshot.sessionCount} 個｜乾跑指派 {snapshot.assignmentCount}{' '}
        筆｜未滿足 {snapshot.conflictCount} 筆｜達標 {snapshot.compliantCount} 人（兩軌分開計算，與 01 §4 一致）。
      </p>
      <div className={uiTokens.rehabTrackTableWrap}>
        <table className={uiTokens.rehabTrackTable}>
          <thead>
            <tr className={uiTokens.rehabTrackTheadRow}>
              <th className={uiTokens.rehabTrackTh}>院友</th>
              {showDementiaColumn ? <th className={uiTokens.rehabTrackTh}>認知嚴重度</th> : null}
              <th className={uiTokens.rehabTrackTh}>週目標</th>
              <th className={uiTokens.rehabTrackTh}>預覽完成</th>
              <th className={uiTokens.rehabTrackTh}>達標</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.rows.length === 0 ? (
              <tr>
                <td className={uiTokens.rehabTrackTdEmpty} colSpan={colSpan}>
                  此軌道目前無納入院友。
                </td>
              </tr>
            ) : (
              snapshot.rows.map((row) => (
                <tr key={row.id} className={uiTokens.rehabTrackRowDivider}>
                  <td className={uiTokens.rehabTrackTdName}>{row.name}</td>
                  {showDementiaColumn ? (
                    <td className={uiTokens.rehabTrackTdMuted}>{dementiaZh(row.dementiaLevel)}</td>
                  ) : null}
                  <td className={uiTokens.rehabTrackTd}>{row.weeklyTarget}</td>
                  <td className={uiTokens.rehabTrackTd}>{row.weeklyCompleted}</td>
                  <td className={uiTokens.rehabTrackTd}>
                    <span
                      className={row.isCompliant ? uiTokens.rehabCompliantPillYes : uiTokens.rehabCompliantPillNo}
                    >
                      {row.isCompliant ? '是' : '否'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
