import type { ImportRunSummary } from '../importRunSummary'

interface ImportRunHistoryListProps {
  runs: ImportRunSummary[]
}

const stageLabel = (stage: ImportRunSummary['stage']): string => (stage === 'dry-run' ? '預檢' : '確認匯入')

const formatDuration = (durationMs: number): string => {
  if (durationMs < 1000) return `${durationMs} ms`
  return `${(durationMs / 1000).toFixed(2)} s`
}

const formatTime = (iso: string): string => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString()
}

export const ImportRunHistoryList = ({ runs }: ImportRunHistoryListProps) => {
  if (runs.length === 0) return null
  return (
    <div className="mt-2 rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-700">
      <p className="font-semibold text-slate-800">最近 10 次匯入歷史</p>
      <ul className="mt-1 max-h-40 space-y-1 overflow-auto">
        {runs.map((run, index) => (
          <li key={`${run.ranAt}-${index}`} className="rounded bg-slate-50 px-2 py-1">
            {stageLabel(run.stage)} / 總數 {run.total} / 成功 {run.success} / 失敗 {run.failed} / 耗時{' '}
            {formatDuration(run.durationMs)} / {formatTime(run.ranAt)}
          </li>
        ))}
      </ul>
    </div>
  )
}
