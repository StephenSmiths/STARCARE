import type { ImportRunSummary } from '../importRunSummary'
import { uiTokens } from '../ui/uiTokens'

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
    <div className={uiTokens.importRunSummaryShell}>
      <p className={uiTokens.panelTitleSm}>
        批次摘要（{summary.stage === 'dry-run' ? '預檢' : '確認匯入'}）
      </p>
      <div className={uiTokens.importRunSummaryMetricsGrid}>
        <p>總數：{summary.total}</p>
        <p className={uiTokens.importRunStatSuccess}>成功：{summary.success}</p>
        <p className={uiTokens.importRunStatFail}>失敗：{summary.failed}</p>
        <p>耗時：{formatDuration(summary.durationMs)}</p>
        <p>批次時間：{formatTime(summary.ranAt)}</p>
      </div>
    </div>
  )
}
