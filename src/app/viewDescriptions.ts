import type { ViewId } from './viewRouting'

const VIEW_DESCRIPTIONS: Record<ViewId, string> = {
  dashboard: '院友／員工概況、今日活動時段（資助／認知分計）、合規摘要與待辦（PDF 02【1】Seq 13）。',
  'work-plan': '日期、員工與工作節時段；預覽後儲存即發布活動時段（PDF 02【2】Seq 14）。',
  'work-session-plans': '我的工作計劃與團隊計劃：接收／拒絕工作節、主管批量軟刪（PDF 02【4】Seq 16）。',
  'service-forms':
    '選日與工作節、填寫服務紀要、提交審核；主管核准後鎖定（PDF 02【5】／01 §2.2 Seq 17）。',
  'historical-documents': '僅已核准鎖定之服務紀錄：篩選與匯出（CSV／Excel）（PDF 02【10】Seq 23）。',
  'work-analysis-review': '提交概況、團隊報告摘要、待審審批與回饋占位（PDF 02【7】Seq 20）。',
  'ai-report-center':
    'Team Lead：生成占位稿、編輯、採用與發放標記（PDF 02【11】Seq 24）；待接 AI／通知鏈。',
  'notification-center': '通知彙整（審計事件衍生）：未讀、已讀與重整（PDF 02【14】Seq 27）。',
  'user-manual': '站內功能操作摘要與文件入口（PDF 02【15】Seq 28）。',
  'shift-start-handover':
    '代表與部門概覽、院舍資訊、注意事項、歷史查閱與簽名（PDF 02【5b】Seq 18）。',
  'shift-end-handover': '數據概覽、跟進、新增事項、提醒、報告與簽名（PDF 02【6】Seq 19）。',
  scheduling: '排班規則、指派結果與 KPI 作業。',
  'rehab-activity-tracking':
    '兩軌獨立：資助復康與認知服務合規預覽與院友完成列表（PDF 02【8】Seq 21）。',
  'assessment-management':
    '評估到期／逾期追蹤、完成率與 PT／OT 版本紀錄（PDF 02【9】Seq 22）；與 Seq 9 週期估算一致。',
  'system-settings':
    'PDF 02【16】智能排班設定、復康服務基本設定（Seq 29）：「儲存設定」寫本機；已設定 Supabase 時可「政策版本（雲端提交）」至 Edge（P1，Team Lead／Admin）。',
  'user-role-admin':
    '僅 Admin：同步變更他人 public.user_roles 與 Auth app_metadata（PDF 01 §1）；對方須重登入；審計 action 為 USER_RBAC_ROLE_SET。',
  residents: '院友名單、批量／個別建立與審計。',
  'staff-import': '員工概覽與批量匯入。',
  'activity-sessions-import': '活動時段 CSV 預檢與匯入。',
}

export const getModuleDescription = (view: ViewId): string =>
  VIEW_DESCRIPTIONS[view] ?? '活動時段 CSV 預檢與匯入。'
