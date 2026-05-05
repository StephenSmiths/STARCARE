export type StarcareRole = 'Admin' | 'TeamLead' | 'Staff'
export type AuthPermission =
  | 'view:dashboard'
  /** PDF 02【2】創建工作計劃（TeamLead／Admin；Staff 不可） */
  | 'view:work-plan-compose'
  /** PDF 02【4】我的工作計劃／團隊計劃 */
  | 'view:work-session-plans'
  /** PDF 02【5】填寫／審核服務表單 */
  | 'view:service-forms'
  /** PDF 02【10】歷史文件（僅 APPROVED） */
  | 'view:historical-documents'
  /** PDF 02【7】智能工作分析／表單審核（TeamLead／Admin） */
  | 'view:work-analysis-review'
  /** PDF 02【11】AI 報告中心（TeamLead／Admin） */
  | 'view:ai-report-center'
  /** PDF 02【14】通知中心 */
  | 'view:notification-center'
  /** PDF 02【15】用戶手冊 */
  | 'view:user-manual'
  /** PDF 02【5b】開工接更 */
  | 'view:shift-start-handover'
  /** PDF 02【6】收工交更 */
  | 'view:shift-end-handover'
  | 'view:scheduling'
  /** PDF 02【8】復康活動追蹤（兩軌） */
  | 'view:rehab-activity-tracking'
  /** PDF 02【9】評估管理（Staff 可登錄無需院友管理頁） */
  | 'view:assessment-management'
  /** PDF 02【16】Seq 29：院舍系統設定（Admin／TeamLead） */
  | 'view:system-settings'
  | 'view:residents'
  | 'view:staff-import'
  | 'view:activity-sessions-import'
  | 'action:approve-form'
