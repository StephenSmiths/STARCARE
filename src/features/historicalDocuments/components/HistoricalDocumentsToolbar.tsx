import { uiTokens } from '../../shared/ui/uiTokens'
import type { HistoricalDocumentsWorkspace } from '../hooks/useHistoricalDocumentsWorkspace'

type Props = Pick<
  HistoricalDocumentsWorkspace,
  | 'filters'
  | 'setFilters'
  | 'reload'
  | 'exportCsv'
  | 'isExporting'
  | 'approvedCount'
  | 'rows'
  | 'isLoading'
>

/** PDF 02【10】篩選列與匯出（CSV 含 BOM，Excel 可開） */
export const HistoricalDocumentsToolbar = ({
  filters,
  setFilters,
  reload,
  exportCsv,
  isExporting,
  approvedCount,
  rows,
  isLoading,
}: Props) => (
  <div className={uiTokens.historicalDocumentsToolbarShell}>
    <label className={uiTokens.historicalDocumentsFilterFieldDate}>
      <span className={uiTokens.formLabel}>工作節日起（含）</span>
      <input
        type="date"
        className={uiTokens.formInput}
        disabled={isLoading}
        value={filters.dateFrom}
        onChange={(ev) => setFilters({ ...filters, dateFrom: ev.target.value })}
      />
    </label>
    <label className={uiTokens.historicalDocumentsFilterFieldDate}>
      <span className={uiTokens.formLabel}>工作節日止（含）</span>
      <input
        type="date"
        className={uiTokens.formInput}
        disabled={isLoading}
        value={filters.dateTo}
        onChange={(ev) => setFilters({ ...filters, dateTo: ev.target.value })}
      />
    </label>
    <label className={uiTokens.historicalDocumentsFilterFieldKeyword}>
      <span className={uiTokens.formLabel}>關鍵字（院友／紀要）</span>
      <input
        className={uiTokens.formInput}
        disabled={isLoading}
        value={filters.keyword}
        onChange={(ev) => setFilters({ ...filters, keyword: ev.target.value })}
        placeholder="可留空"
      />
    </label>
    <div className={uiTokens.layoutFlexWrapGap2}>
      <button type="button" className={uiTokens.btnSecondary} disabled={isLoading} onClick={() => void reload()}>
        {isLoading ? '載入中…' : '重新載入'}
      </button>
      <button
        type="button"
        className={uiTokens.btnPrimary}
        disabled={isExporting || isLoading}
        onClick={() => exportCsv()}
      >
        {isExporting ? '匯出中…' : '匯出 Excel（CSV）'}
      </button>
    </div>
    <p className={uiTokens.historicalDocumentsToolbarHelpFullWidth}>
      已核准總數 {approvedCount}；目前篩選 {rows.length} 筆（僅 status=APPROVED）。
    </p>
  </div>
)
