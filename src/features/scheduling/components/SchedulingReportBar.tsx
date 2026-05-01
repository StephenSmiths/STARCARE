interface SchedulingReportBarProps {
  onDownloadCsv: () => void
  onDownloadAlertsCsv: () => void
  disabled: boolean
  alertDisabled: boolean
}

/** 合規報表（CSV）下載列 */
export const SchedulingReportBar = ({
  onDownloadCsv,
  onDownloadAlertsCsv,
  disabled,
  alertDisabled,
}: SchedulingReportBarProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-800">報表與核銷</p>
        <p className="text-xs text-slate-500">可匯出本週合規摘要，以及週三 0 次高優先提醒清單。</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onDownloadCsv}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          下載本週合規報表
        </button>
        <button
          type="button"
          disabled={alertDisabled}
          onClick={onDownloadAlertsCsv}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          下載週三提醒清單
        </button>
      </div>
    </div>
  )
}
