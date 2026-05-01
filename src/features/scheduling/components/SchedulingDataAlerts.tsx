import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'

interface SchedulingDataAlertsProps {
  loadError: string
  saveError: string
  saveSuccess: boolean
  complianceAlerts: SchedulingComplianceAlert[]
}

/** 載入／儲存 API 錯誤與成功提示 */
export const SchedulingDataAlerts = ({
  loadError,
  saveError,
  saveSuccess,
  complianceAlerts,
}: SchedulingDataAlertsProps) => {
  return (
    <div className="space-y-2">
      {complianceAlerts.map((alert) => (
        <div
          key={`${alert.code}-${alert.residentId}`}
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <span className="mr-2 rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">
            高優先
          </span>
          {alert.message}
        </div>
      ))}
      {loadError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{loadError}</div>
      ) : null}
      {saveError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{saveError}</div>
      ) : null}
      {saveSuccess ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          排班結果已成功儲存，審計紀錄已寫入。
        </div>
      ) : null}
    </div>
  )
}
