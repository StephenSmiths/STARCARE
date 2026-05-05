import type { AuthPermission } from '../features/auth/permissions'

export type ViewId =
  | 'dashboard'
  | 'work-plan'
  | 'work-session-plans'
  | 'service-forms'
  | 'historical-documents'
  | 'work-analysis-review'
  | 'ai-report-center'
  | 'notification-center'
  | 'user-manual'
  | 'shift-start-handover'
  | 'shift-end-handover'
  | 'scheduling'
  | 'rehab-activity-tracking'
  | 'assessment-management'
  | 'system-settings'
  | 'residents'
  | 'staff-import'
  | 'activity-sessions-import'

export type ViewPermission = Extract<AuthPermission, `view:${string}`>

export const VIEW_IDS: ViewId[] = [
  'dashboard',
  'work-plan',
  'work-session-plans',
  'service-forms',
  'historical-documents',
  'work-analysis-review',
  'ai-report-center',
  'notification-center',
  'user-manual',
  'shift-start-handover',
  'shift-end-handover',
  'scheduling',
  'rehab-activity-tracking',
  'assessment-management',
  'system-settings',
  'residents',
  'staff-import',
  'activity-sessions-import',
]

export const VIEW_PERMISSION_MAP: Record<ViewId, ViewPermission> = {
  dashboard: 'view:dashboard',
  'work-plan': 'view:work-plan-compose',
  'work-session-plans': 'view:work-session-plans',
  'service-forms': 'view:service-forms',
  'historical-documents': 'view:historical-documents',
  'work-analysis-review': 'view:work-analysis-review',
  'ai-report-center': 'view:ai-report-center',
  'notification-center': 'view:notification-center',
  'user-manual': 'view:user-manual',
  'shift-start-handover': 'view:shift-start-handover',
  'shift-end-handover': 'view:shift-end-handover',
  scheduling: 'view:scheduling',
  'rehab-activity-tracking': 'view:rehab-activity-tracking',
  'assessment-management': 'view:assessment-management',
  'system-settings': 'view:system-settings',
  residents: 'view:residents',
  'staff-import': 'view:staff-import',
  'activity-sessions-import': 'view:activity-sessions-import',
}

const HASH_TO_VIEW: Record<string, ViewId> = {
  '#dashboard': 'dashboard',
  '#work-plan': 'work-plan',
  '#work-session-plans': 'work-session-plans',
  '#service-forms': 'service-forms',
  '#historical-documents': 'historical-documents',
  '#work-analysis-review': 'work-analysis-review',
  '#ai-report-center': 'ai-report-center',
  '#notification-center': 'notification-center',
  '#user-manual': 'user-manual',
  '#shift-start-handover': 'shift-start-handover',
  '#shift-end-handover': 'shift-end-handover',
  '#scheduling': 'scheduling',
  '#rehab-activity-tracking': 'rehab-activity-tracking',
  '#assessment-management': 'assessment-management',
  '#system-settings': 'system-settings',
  '#residents': 'residents',
  '#staff-import': 'staff-import',
  '#activity-sessions-import': 'activity-sessions-import',
}

export const getViewFromHash = (hash: string): ViewId => HASH_TO_VIEW[hash] ?? 'dashboard'

const VIEW_TITLES: Record<ViewId, string> = {
  dashboard: '儀表盤',
  'work-plan': '創建工作計劃',
  'work-session-plans': '工作計劃',
  'service-forms': '服務表單',
  'historical-documents': '歷史文件',
  'work-analysis-review': '工作分析／表單審核',
  'ai-report-center': 'AI 報告中心',
  'notification-center': '通知中心',
  'user-manual': '用戶手冊',
  'shift-start-handover': '開工接更',
  'shift-end-handover': '收工交更',
  scheduling: '智能排班',
  'rehab-activity-tracking': '復康活動追蹤',
  'assessment-management': '評估管理',
  'system-settings': '系統設定',
  residents: '院友管理',
  'staff-import': '員工管理',
  'activity-sessions-import': '活動時段匯入',
}

export const getViewTitle = (view: ViewId): string => VIEW_TITLES[view] ?? '儀表盤'

