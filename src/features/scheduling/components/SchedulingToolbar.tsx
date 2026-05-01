interface SchedulingToolbarProps {
  onRunScheduling: () => void
  isRunning: boolean
  /** PDF 02【3】須完成更表確認且有時段／院友 */
  disableRun?: boolean
  disableRunReason?: string
}

/** 標題列與「啟動智能排班」主按鈕 */
export const SchedulingToolbar = ({
  onRunScheduling,
  isRunning,
  disableRun = false,
  disableRunReason,
}: SchedulingToolbarProps) => {
  const blocked = isRunning || disableRun
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">智能排班儀表板</h2>
        <p className="mt-1 text-sm text-slate-600">
          檢視本週達標概況、院友次數與排班結果；完成流程前兩步後執行 3-Pass 排程與衝突檢索。
        </p>
      </div>
      <button
        type="button"
        title={blocked ? disableRunReason : undefined}
        disabled={blocked}
        onClick={onRunScheduling}
        className="ml-auto inline-flex shrink-0 items-center justify-center rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-0"
      >
        {isRunning ? '排班執行中…' : '啟動智能排班'}
      </button>
    </div>
  )
}
