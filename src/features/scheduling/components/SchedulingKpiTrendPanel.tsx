import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingKpiHistoryFilter } from '../hooks/useSchedulingKpiHistory'
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">排班 KPI 趨勢</h3>
          <p className="mt-1 text-xs text-slate-500">
            由上而下為新至舊；Δ 為與上一次快照之差（覆蓋率、平均指派上升為正向；待補齊比例、衝突率下降為較佳）。
          </p>
          <p className="mt-1 text-xs text-slate-500">資料存於本機瀏覽器，可用下方按鈕匯出 CSV 留存。</p>
          <SchedulingKpiTrendFilterBar
            history={history}
            currentFilter={currentFilter}
            onApplyFilter={onApplyFilter}
            onResetFilter={onResetFilter}
            isApplyingFilter={isApplyingFilter}
          />
          {syncError ? (
            <div className="mt-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <p>{syncError}</p>
              {hasPendingSync ? <p className="mt-1">系統偵測到待同步項目。</p> : null}
            </div>
          ) : null}
          {syncNotice ? (
            <div className="mt-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              <p>{syncNotice}</p>
            </div>
          ) : null}
        </div>
        <div className="flex gap-2">
          {onRetrySync ? (
            <button
              type="button"
              className="rounded border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-50 disabled:opacity-50"
              onClick={() => onRetrySync()}
              disabled={isRetryingSync}
            >
              {isRetryingSync ? '同步重試中...' : '重試同步'}
            </button>
          ) : null}
          {onDownloadCsv ? (
            <button
              type="button"
              className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => onDownloadCsv()}
            >
              下載 KPI 趨勢 CSV
            </button>
          ) : null}
          {onClearHistory ? (
            <button
              type="button"
              className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
              onClick={() => onClearHistory()}
            >
              清除歷史
            </button>
          ) : null}
        </div>
      </div>
      {history.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">目前沒有符合條件的趨勢資料。</p>
      ) : (
        <div className="mt-3 max-h-56 overflow-auto text-xs">
          <table className="min-w-full text-left">
            <thead className="sticky top-0 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-2 py-2">時間</th>
                <th className="px-2 py-2">覆蓋率</th>
                <th className="px-2 py-2">Δ</th>
                <th className="px-2 py-2">衝突率/百</th>
                <th className="px-2 py-2">Δ</th>
                <th className="px-2 py-2">均值指派</th>
                <th className="px-2 py-2">Δ</th>
                <th className="px-2 py-2">待補齊%</th>
                <th className="px-2 py-2">Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((row, index) => {
                const prev = history[index + 1]
                const k = row.kpis
                const p = prev?.kpis
                return (
                  <tr key={`${row.ranAt}-${index}`} className="text-slate-700">
                    <td className="whitespace-nowrap px-2 py-2">{formatTime(row.ranAt)}</td>
                    <td className="px-2 py-2">{k.coverageRate.toFixed(1)}%</td>
                    <td className="px-2 py-2 text-slate-600">
                      {formatDeltaPercentPoints(k.coverageRate, p?.coverageRate)}
                    </td>
                    <td className="px-2 py-2">{k.conflictRatePer100.toFixed(1)}%</td>
                    <td className="px-2 py-2 text-slate-600">
                      {formatDeltaPercentPoints(k.conflictRatePer100, p?.conflictRatePer100)}
                    </td>
                    <td className="px-2 py-2">{k.averageAssignmentsPerResident.toFixed(2)}</td>
                    <td className="px-2 py-2 text-slate-600">
                      {formatDeltaDecimal(k.averageAssignmentsPerResident, p?.averageAssignmentsPerResident)}
                    </td>
                    <td className="px-2 py-2">{k.underTargetRate.toFixed(1)}%</td>
                    <td className="px-2 py-2 text-slate-600">
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
