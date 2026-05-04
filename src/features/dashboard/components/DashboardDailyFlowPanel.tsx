import { useAuth } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'

/**
 * PDF 02【1】：儀表盤上之「建議順序」導引（縮短新手上手時間）
 * 對齊 01 §2 工作節→表單；組長另提示排班／審核入口
 */
export const DashboardDailyFlowPanel = () => {
  const { role, hasPermission } = useAuth()
  const isStaff = role === 'Staff'

  return (
    <section className={uiTokens.dashboardFlowPanel}>
      <h3 className={uiTokens.dashboardFlowTitle}>建議從哪裡開始？</h3>
      <p className={uiTokens.dashboardFlowIntro}>左側選單已分組；多數同仁每日會用到「工作節與表單」區塊。</p>
      <ol className={uiTokens.dashboardFlowOrderedList}>
        <li>先看本頁上方<strong>摘要</strong>，掌握今日概況。</li>
        {hasPermission('view:user-manual') ? (
          <li>
            第一次使用請先開
            <a href="#user-manual" className={uiTokens.hashLinkProse}>
              用戶手冊
            </a>
            （閉環與常用入口）。
          </li>
        ) : null}
        {isStaff ? (
          <>
            {hasPermission('view:work-session-plans') ? (
              <li>
                到「工作計劃」
                <strong className={uiTokens.proseStrongInset}>接收</strong>
                今日工作節（未接收則無法填寫服務表單）。
              </li>
            ) : null}
            {hasPermission('view:service-forms') ? (
              <li>
                到
                <a href="#service-forms" className={uiTokens.hashLinkProse}>
                  服務表單
                </a>
                選日、選節、填寫後提交。
              </li>
            ) : null}
          </>
        ) : (
          <>
            {hasPermission('view:work-plan-compose') || hasPermission('view:work-session-plans') ? (
              <li>
                確認「創建工作計劃」／「工作計劃」已安排，同仁方可接收與填表。
              </li>
            ) : null}
            {hasPermission('view:scheduling') ? (
              <li>
                需要演算班表時，到「智能排班」依步驟載入資料→排班→確認後儲存。
              </li>
            ) : null}
            {hasPermission('view:work-analysis-review') ? (
              <li>
                表單審閱可到
                <a href="#work-analysis-review" className={uiTokens.hashLinkProse}>
                  工作分析／審核
                </a>
                。
              </li>
            ) : null}
          </>
        )}
      </ol>
    </section>
  )
}
