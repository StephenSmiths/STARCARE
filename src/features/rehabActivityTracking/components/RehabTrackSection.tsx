import { useState } from 'react'
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

const REHAB_TRACK_DEFAULT_VISIBLE_ROWS = 12

/** PDF 02【8】單軌合規總覽＋完成列表 */
export const RehabTrackSection = ({ snapshot, showDementiaColumn }: Props) => {
  const colSpan = showDementiaColumn ? 5 : 4
  const [showAllRows, setShowAllRows] = useState(false)
  const visibleRows = showAllRows ? snapshot.rows : snapshot.rows.slice(0, REHAB_TRACK_DEFAULT_VISIBLE_ROWS)
  const hasMoreRows = snapshot.rows.length > REHAB_TRACK_DEFAULT_VISIBLE_ROWS

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>{snapshot.trackLabel}</h2>
      <p className={uiTokens.sectionHelp}>
        納入院友 {snapshot.cohortCount} 人｜本週可用時段 {snapshot.sessionCount} 個｜乾跑指派 {snapshot.assignmentCount}{' '}
        筆｜未滿足 {snapshot.conflictCount} 筆｜達標 {snapshot.compliantCount} 人（兩軌分開計算，與 01 §4 一致）。
      </p>
      {snapshot.conflictCount > 0 && snapshot.conflictSampleLines && snapshot.conflictSampleLines.length > 0 ? (
        <details className={`${uiTokens.textSubtleXs} mb-3`}>
          <summary className="cursor-pointer select-none">
            衝突節錄（展示 {snapshot.conflictSampleLines.length}/{snapshot.conflictCount} 筆）
          </summary>
          <ul className="mt-2 list-disc pl-5">
            {snapshot.conflictSampleLines.map((line, i) => (
              <li key={`cf-${i}-${line.slice(0, 24)}`}>{line}</li>
            ))}
          </ul>
          {snapshot.conflictCount > snapshot.conflictSampleLines.length ? (
            <p className="mt-1">其餘 {snapshot.conflictCount - snapshot.conflictSampleLines.length} 筆未列出。</p>
          ) : null}
        </details>
      ) : null}
      {hasMoreRows ? (
        <div className={uiTokens.layoutFlexBetweenGap2}>
          <p className={uiTokens.textSubtleXs}>
            目前顯示 {visibleRows.length} / {snapshot.rows.length} 位院友（先顯示前段清單，避免長表阻塞畫面）。
          </p>
          <button type="button" className={uiTokens.btnCompact} onClick={() => setShowAllRows((v) => !v)}>
            {showAllRows ? '只顯示前段' : '展開全部'}
          </button>
        </div>
      ) : null}
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
              visibleRows.map((row) => (
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
