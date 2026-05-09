import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingKpiHistoryFilter } from '../hooks/useSchedulingKpiHistory'
import { uiTokens } from '../../shared/ui/uiTokens'
import { ListSectionPanel } from '../../shared/components/ListSectionPanel'
import { SchedulingKpiTrendFilterBar } from './SchedulingKpiTrendFilterBar'
import { SchedulingKpiTrendHistoryTable } from './SchedulingKpiTrendHistoryTable'

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
      <ListSectionPanel title="KPI 趨勢清單" summary={`${history.length} 筆`} defaultExpanded={false}>
        {history.length === 0 ? (
          <p className={uiTokens.schedulingKpiTrendEmptyHint}>目前沒有符合條件的趨勢資料。</p>
        ) : (
          <SchedulingKpiTrendHistoryTable history={history} />
        )}
      </ListSectionPanel>
    </div>
  )
}
