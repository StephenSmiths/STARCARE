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
    <section className={uiTokens.dashboardWednesdayPanel}>
      <h3 className={uiTokens.dashboardWednesdayTitle}>合規：週三資助復康零次提醒（TeamLead／Admin）</h3>
      <p className={uiTokens.dashboardWednesdayIntro}>
        01 §4.1：週三若甲一或院舍券院友之資助復康本週完成仍為 0 次，應高優先跟進。完整清單與 CSV 請至
        <a href="#scheduling" className={uiTokens.hashLinkProse}>
          智能排班
        </a>
        頁匯出。
      </p>
      {!wed ? (
        <p className={uiTokens.dashboardMutedNote}>今日非週三；週三登入時此處會自動帶入符合條件之名單預覽。</p>
      ) : alerts.length === 0 ? (
        <p className={uiTokens.dashboardMutedNote}>本週三目前無符合條件之零次提醒（或尚無院友資料）。</p>
      ) : (
        <ul className={uiTokens.dashboardWednesdayList}>
          {alerts.map((a) => (
            <li key={a.residentId}>
              <span className={uiTokens.textWeightMedium}>{a.residentName}</span>
              <span className={uiTokens.textSubtleMl1Slate600}>（{a.fundingType}）</span>
            </li>
          ))}
        </ul>
      )}
      {wed && alerts.length > 0 ? (
        <p className={uiTokens.dashboardWednesdayFooterCount}>共 {alerts.length} 筆高優先項目</p>
      ) : null}
    </section>
  )
}
