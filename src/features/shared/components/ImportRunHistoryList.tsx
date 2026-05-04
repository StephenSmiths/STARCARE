import type { ImportRunSummary } from '../importRunSummary'
import { uiTokens } from '../ui/uiTokens'

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
    <div className={uiTokens.importRunHistoryShell}>
      <p className={uiTokens.panelTitleSm}>最近 10 次匯入歷史</p>
      <ul className={uiTokens.importRunHistoryScrollList}>
        {runs.map((run, index) => (
          <li key={`${run.ranAt}-${index}`} className={uiTokens.importRunHistoryRow}>
            {stageLabel(run.stage)} / 總數 {run.total} / 成功 {run.success} / 失敗 {run.failed} / 耗時{' '}
            {formatDuration(run.durationMs)} / {formatTime(run.ranAt)}
          </li>
        ))}
      </ul>
    </div>
  )
}
