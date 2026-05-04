import { uiTokens } from '../../shared/ui/uiTokens'

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
    <div className={uiTokens.schedulingReportBarShell}>
      <div>
        <p className={uiTokens.panelTitleSm}>報表與核銷</p>
        <p className={uiTokens.helpFinePrint}>可匯出本週合規摘要，以及週三 0 次高優先提醒清單。</p>
      </div>
      <div className={uiTokens.layoutFlexWrapGap2}>
        <button
          type="button"
          disabled={disabled}
          onClick={onDownloadCsv}
          className={uiTokens.schedulingReportCsvButton}
        >
          下載本週合規報表
        </button>
        <button
          type="button"
          disabled={alertDisabled}
          onClick={onDownloadAlertsCsv}
          className={uiTokens.schedulingReportAlertsButton}
        >
          下載週三提醒清單
        </button>
      </div>
    </div>
  )
}
