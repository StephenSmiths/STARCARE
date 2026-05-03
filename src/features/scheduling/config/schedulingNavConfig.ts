import type { AuthPermission } from '../../auth'

export type SchedulingNavItem = {
  label: string
  href: string
  permission: AuthPermission
}

export type SchedulingNavGroup = {
  /** 側欄分組標題（協助新使用者掃描） */
  heading: string
  items: SchedulingNavItem[]
}

/** 左側導覽分組：流程導向，避免扁平長清單 */
export const SCHEDULING_NAV_GROUPS: SchedulingNavGroup[] = [
  {
    heading: '開始與說明',
    items: [
      { label: '儀表盤', href: '#dashboard', permission: 'view:dashboard' },
      { label: '用戶手冊', href: '#user-manual', permission: 'view:user-manual' },
      { label: '通知中心', href: '#notification-center', permission: 'view:notification-center' },
    ],
  },
  {
    heading: '工作節與表單',
    items: [
      { label: '創建工作計劃', href: '#work-plan', permission: 'view:work-plan-compose' },
      { label: '工作計劃', href: '#work-session-plans', permission: 'view:work-session-plans' },
      { label: '服務表單', href: '#service-forms', permission: 'view:service-forms' },
      { label: '開工接更', href: '#shift-start-handover', permission: 'view:shift-start-handover' },
      { label: '收工交更', href: '#shift-end-handover', permission: 'view:shift-end-handover' },
    ],
  },
  {
    heading: '排班與追蹤',
    items: [
      { label: '智能排班', href: '#scheduling', permission: 'view:scheduling' },
      { label: '復康活動追蹤', href: '#rehab-activity-tracking', permission: 'view:rehab-activity-tracking' },
      { label: '評估管理', href: '#assessment-management', permission: 'view:assessment-management' },
    ],
  },
  {
    heading: '查閱與分析',
    items: [
      { label: '歷史文件', href: '#historical-documents', permission: 'view:historical-documents' },
      { label: '工作分析／審核', href: '#work-analysis-review', permission: 'view:work-analysis-review' },
      { label: 'AI 報告中心', href: '#ai-report-center', permission: 'view:ai-report-center' },
    ],
  },
  {
    heading: '主檔與匯入',
    items: [
      { label: '院友管理', href: '#residents', permission: 'view:residents' },
      { label: '員工管理', href: '#staff-import', permission: 'view:staff-import' },
      { label: '活動時段匯入', href: '#activity-sessions-import', permission: 'view:activity-sessions-import' },
    ],
  },
  {
    heading: '設定',
    items: [{ label: '系統設定', href: '#system-settings', permission: 'view:system-settings' }],
  },
]
