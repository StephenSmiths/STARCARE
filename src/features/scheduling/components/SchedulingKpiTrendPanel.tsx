import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingKpiHistoryFilter } from '../hooks/useSchedulingKpiHistory'
import { uiTokens } from '../../shared/ui/uiTokens'
import { formatDeltaDecimal, formatDeltaPercentPoints } from '../utils/schedulingKpiTrendFormat'
import { SchedulingKpiTrendFilterBar } from './SchedulingKpiTrendFilterBar'

interface SchedulingKpiTrendPanelProps {
  history: SchedulingKpiRunRecord[]
  onDownloadCsv?: () => void
  onClearHistory?: () => void
  syncError?: string
  syncNotice?: string
  hasPendingSync?: boolean
  onRetrySync?: () => void
  isRetryingSync?: boolean
  currentFilter?: SchedulingKpiHistoryFilter
  onApplyFilter?: (filter: SchedulingKpiHistoryFilter) => void
  onResetFilter?: () => void
  isApplyingFilter?: boolean
}

const formatTime = (iso: string): string => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString()
}

/** Phase 4 Day 2/3：最近排班 KPI 趨勢（最多顯示 10 次；Day 3 支援本機持久化與 CSV 匯出） */
export const SchedulingKpiTrendPanel = ({
  history,
  onDownloadCsv,
  onClearHistory,
  syncError,
  syncNotice,
  hasPendingSync,
  onRetrySync,
  isRetryingSync,
  currentFilter,
  onApplyFilter,
  onResetFilter,
  isApplyingFilter,
}: SchedulingKpiTrendPanelProps) => {
  return (
    <div className={uiTokens.surfaceCardCompact}>
      <div className={uiTokens.panelHeaderSplit}>
        <div>
          <h3 className={uiTokens.panelTitleSm}>排班 KPI 趨勢</h3>
          <p className={uiTokens.schedulingKpiTrendIntroLine}>
            由上而下為新至舊；Δ 為與上一次快照之差（覆蓋率、平均指派上升為正向；待補齊比例、衝突率下降為較佳）。
          </p>
          <p className={uiTokens.schedulingKpiTrendIntroLine}>資料存於本機瀏覽器，可用下方按鈕匯出 CSV 留存。</p>
          <SchedulingKpiTrendFilterBar
            history={history}
            currentFilter={currentFilter}
            onApplyFilter={onApplyFilter}
            onResetFilter={onResetFilter}
            isApplyingFilter={isApplyingFilter}
          />
          {syncError ? (
            <div className={uiTokens.inlineNoticeWarn}>
              <p>{syncError}</p>
              {hasPendingSync ? <p className={uiTokens.blockHelp}>系統偵測到待同步項目。</p> : null}
            </div>
          ) : null}
          {syncNotice ? (
            <div className={uiTokens.inlineNoticeSuccess}>
              <p>{syncNotice}</p>
            </div>
          ) : null}
        </div>
        <div className={uiTokens.layoutFlexGap2}>
          {onRetrySync ? (
            <button
              type="button"
              className={uiTokens.schedulingKpiTrendToolbarBtnWarn}
              onClick={() => onRetrySync()}
              disabled={isRetryingSync}
            >
              {isRetryingSync ? '同步重試中...' : '重試同步'}
            </button>
          ) : null}
          {onDownloadCsv ? (
            <button
              type="button"
              className={uiTokens.schedulingKpiTrendToolbarBtnSecondary}
              onClick={() => onDownloadCsv()}
            >
              下載 KPI 趨勢 CSV
            </button>
          ) : null}
          {onClearHistory ? (
            <button
              type="button"
              className={uiTokens.schedulingKpiTrendToolbarBtnDanger}
              onClick={() => onClearHistory()}
            >
              清除歷史
            </button>
          ) : null}
        </div>
      </div>
      {history.length === 0 ? (
        <p className={uiTokens.schedulingKpiTrendEmptyHint}>目前沒有符合條件的趨勢資料。</p>
      ) : (
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
                    <td className={uiTokens.tableCellNowrap}>{formatTime(row.ranAt)}</td>
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
      )}
    </div>
  )
}
