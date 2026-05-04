import { uiTokens } from '../../shared/ui/uiTokens'

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
    <div className={uiTokens.schedulingToolbarMainRow}>
      <div>
        <h2 className={uiTokens.productTitle}>智能排班儀表板</h2>
        <p className={uiTokens.moduleDescription}>
          檢視本週達標概況、院友次數與排班結果；完成流程前兩步後執行 3-Pass 排程與衝突檢索。
        </p>
      </div>
      <button
        type="button"
        title={blocked ? disableRunReason : undefined}
        disabled={blocked}
        onClick={onRunScheduling}
        className={uiTokens.schedulingToolbarRunButton}
      >
        {isRunning ? '排班執行中…' : '啟動智能排班'}
      </button>
    </div>
  )
}
