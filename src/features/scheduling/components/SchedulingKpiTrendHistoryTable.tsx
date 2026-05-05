import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { uiTokens } from '../../shared/ui/uiTokens'
import { formatDeltaDecimal, formatDeltaPercentPoints, formatKpiTrendRanAtLocal } from '../utils/schedulingKpiTrendFormat'

/** KPI 趨勢快照表格（與上一列計算 Δ） */
export const SchedulingKpiTrendHistoryTable = ({ history }: { history: SchedulingKpiRunRecord[] }) => (
  <div className={uiTokens.schedulingKpiTrendTableArea}>
    <table className={uiTokens.tableCompact}>
      <thead className={uiTokens.tableHeadSticky}>
        <tr>
          <th className={uiTokens.tableCell}>時間</th>
          <th className={uiTokens.tableCell}>覆蓋率</th>
          <th className={uiTokens.tableCell}>Δ</th>
          <th className={uiTokens.tableCell}>衝突率/百</th>
          <th className={uiTokens.tableCell}>Δ</th>
          <th className={uiTokens.tableCell}>均值指派</th>
          <th className={uiTokens.tableCell}>Δ</th>
          <th className={uiTokens.tableCell}>待補齊%</th>
          <th className={uiTokens.tableCell}>Δ</th>
        </tr>
      </thead>
      <tbody className={uiTokens.tableBodyDivided}>
        {history.map((row, index) => {
          const prev = history[index + 1]
          const k = row.kpis
          const p = prev?.kpis
          return (
            <tr key={`${row.ranAt}-${index}`}>
              <td className={uiTokens.tableCellNowrap}>{formatKpiTrendRanAtLocal(row.ranAt)}</td>
              <td className={uiTokens.tableCell}>{k.coverageRate.toFixed(1)}%</td>
              <td className={uiTokens.tableCellNowrapMuted}>
                {formatDeltaPercentPoints(k.coverageRate, p?.coverageRate)}
              </td>
              <td className={uiTokens.tableCell}>{k.conflictRatePer100.toFixed(1)}%</td>
              <td className={uiTokens.tableCellNowrapMuted}>
                {formatDeltaPercentPoints(k.conflictRatePer100, p?.conflictRatePer100)}
              </td>
              <td className={uiTokens.tableCell}>{k.averageAssignmentsPerResident.toFixed(2)}</td>
              <td className={uiTokens.tableCellNowrapMuted}>
                {formatDeltaDecimal(k.averageAssignmentsPerResident, p?.averageAssignmentsPerResident)}
              </td>
              <td className={uiTokens.tableCell}>{k.underTargetRate.toFixed(1)}%</td>
              <td className={uiTokens.tableCellNowrapMuted}>
                {formatDeltaPercentPoints(k.underTargetRate, p?.underTargetRate)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)
