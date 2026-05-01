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
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-2 font-medium">院友</th>
              {showDementiaColumn ? <th className="px-3 py-2 font-medium">認知嚴重度</th> : null}
              <th className="px-3 py-2 font-medium">週目標</th>
              <th className="px-3 py-2 font-medium">預覽完成</th>
              <th className="px-3 py-2 font-medium">達標</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.rows.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-slate-500" colSpan={colSpan}>
                  此軌道目前無納入院友。
                </td>
              </tr>
            ) : (
              snapshot.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">{row.name}</td>
                  {showDementiaColumn ? (
                    <td className="px-3 py-2 text-slate-600">{dementiaZh(row.dementiaLevel)}</td>
                  ) : null}
                  <td className="px-3 py-2">{row.weeklyTarget}</td>
                  <td className="px-3 py-2">{row.weeklyCompleted}</td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        row.isCompliant ? 'rounded bg-emerald-100 px-2 py-0.5 text-emerald-900' : 'rounded bg-amber-100 px-2 py-0.5 text-amber-900'
                      }
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
