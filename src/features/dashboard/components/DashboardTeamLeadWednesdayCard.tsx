import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'
import { uiTokens } from '../../shared/ui/uiTokens'

type Props = {
  alerts: SchedulingComplianceAlert[]
}

const isWednesdayLocal = (): boolean => new Date().getDay() === 3

/** PDF 02【1】／01 §4.1：TeamLead／Admin 於儀表盤看週三資助復康零次提醒（Seq 8） */
export const DashboardTeamLeadWednesdayCard = ({ alerts }: Props) => {
  const wed = isWednesdayLocal()
  return (
    <section className={`${uiTokens.surfaceCardCompact} border-amber-100 bg-amber-50/40`}>
      <h3 className="text-sm font-semibold text-amber-950">合規：週三資助復康零次提醒（TeamLead／Admin）</h3>
      <p className="mt-1 text-xs text-slate-700">
        01 §4.1：週三若甲一或院舍券院友之資助復康本週完成仍為 0 次，應高優先跟進。完整清單與 CSV 請至
        <a href="#scheduling" className="mx-1 font-medium text-violet-800 underline">
          智能排班
        </a>
        頁匯出。
      </p>
      {!wed ? (
        <p className="mt-2 text-xs text-slate-600">今日非週三；週三登入時此處會自動帶入符合條件之名單預覽。</p>
      ) : alerts.length === 0 ? (
        <p className="mt-2 text-xs text-slate-600">本週三目前無符合條件之零次提醒（或尚無院友資料）。</p>
      ) : (
        <ul className="mt-2 max-h-40 list-disc space-y-1 overflow-y-auto pl-5 text-xs text-slate-900">
          {alerts.map((a) => (
            <li key={a.residentId}>
              <span className="font-medium">{a.residentName}</span>
              <span className="ml-1 text-slate-600">（{a.fundingType}）</span>
            </li>
          ))}
        </ul>
      )}
      {wed && alerts.length > 0 ? (
        <p className="mt-2 text-[11px] font-medium text-amber-900">共 {alerts.length} 筆高優先項目</p>
      ) : null}
    </section>
  )
}
