import type { ImportRunSummary } from '../importRunSummary'

interface ImportRunSummaryCardProps {
  summary: ImportRunSummary
}

const formatDuration = (durationMs: number): string => {
  if (durationMs < 1000) return `${durationMs} ms`
  return `${(durationMs / 1000).toFixed(2)} s`
}

const formatTime = (iso: string): string => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString()
}

export const ImportRunSummaryCard = ({ summary }: ImportRunSummaryCardProps) => {
  return (
    <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
      <p className="font-semibold text-slate-800">
        批次摘要（{summary.stage === 'dry-run' ? '預檢' : '確認匯入'}）
      </p>
      <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <p>總數：{summary.total}</p>
        <p className="text-emerald-700">成功：{summary.success}</p>
        <p className="text-red-700">失敗：{summary.failed}</p>
        <p>耗時：{formatDuration(summary.durationMs)}</p>
        <p>批次時間：{formatTime(summary.ranAt)}</p>
      </div>
    </div>
  )
}
