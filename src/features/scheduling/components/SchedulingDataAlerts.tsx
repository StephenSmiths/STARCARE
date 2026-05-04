import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'
import { uiTokens } from '../../shared/ui/uiTokens'

interface SchedulingDataAlertsProps {
  loadError: string
  saveError: string
  saveSuccess: boolean
  complianceAlerts: SchedulingComplianceAlert[]
  /** 員工主檔職類載入失敗；時段仍可用，SC 僅治療師規則暫不依職類檢查 */
  staffProfilesLoadDegraded?: boolean
}

/** 載入／儲存 API 錯誤與成功提示 */
export const SchedulingDataAlerts = ({
  loadError,
  saveError,
  saveSuccess,
  complianceAlerts,
  staffProfilesLoadDegraded = false,
}: SchedulingDataAlertsProps) => {
  const staffProfilesMessage =
    '員工主檔職類（staff-profiles-list）暫時無法載入；活動時段仍可使用。若已啟用「SC 僅治療師」將暫無法依職類檢查，請待主檔 API 恢復後重新整理本頁。'
  return (
    <div className={uiTokens.layoutSpaceY2}>
      {staffProfilesLoadDegraded ? (
        <div className={uiTokens.bannerInfo} role="status">
          {staffProfilesMessage}
        </div>
      ) : null}
      {complianceAlerts.map((alert) => (
        <div key={`${alert.code}-${alert.residentId}`} className={uiTokens.bannerWarn}>
          <span className={uiTokens.badgeUrgent}>高優先</span>
          {alert.message}
        </div>
      ))}
      {loadError ? <div className={uiTokens.bannerDanger}>{loadError}</div> : null}
      {saveError ? <div className={uiTokens.bannerDanger}>{saveError}</div> : null}
      {saveSuccess ? (
        <div className={uiTokens.bannerSuccess}>排班結果已成功儲存，審計紀錄已寫入。</div>
      ) : null}
    </div>
  )
}
