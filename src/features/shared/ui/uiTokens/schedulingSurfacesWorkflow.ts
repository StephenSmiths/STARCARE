/**
 * 排班應用殼層、側欄堆疊、五步 Stepper、工具列／存檔區、統計與 KPI 卡格線。
 * 院友指派表、復康表、歷史文件工具列、KPI 趨勢過濾見 **`schedulingSurfacesTablesTrend`**。
 */
import { uiTokensBase } from './base'

export const uiTokensSchedulingSurfacesWorkflow = {
  schedulingAppShell: 'flex min-h-screen bg-slate-100',
  /** 主內容欄（側欄旁 flex 子層，允許 min-h-0 捲動） */
  schedulingAppMainColumn: 'flex min-h-0 min-w-0 flex-1 flex-col',
  /** 側欄導覽捲動區 */
  sidebarNavScrollStack: 'flex-1 space-y-4 overflow-y-auto p-3',
  /** 側欄單一分組內之連結直向堆疊 */
  sidebarNavItemsStack: 'space-y-1',
  /** 側欄頁尾帳號區塊 */
  sidebarFooterUserStack: 'mb-3 space-y-2',
  schedulingWorkflowStepperSection: 'rounded-xl border border-violet-200 bg-violet-50/60 p-4',
  schedulingWorkflowSessionCountBadge:
    'rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-800 ring-1 ring-violet-200',
  /** 排班五步 Stepper：標題與步驟卡／提示色 */
  schedulingWorkflowStepperTitle: `${uiTokensBase.blockHeading} text-violet-950`,
  schedulingWorkflowStepCardActive:
    'flex h-full flex-col rounded-lg px-3 py-2 text-xs bg-violet-600 text-white shadow-md',
  schedulingWorkflowStepCardDone:
    'flex h-full flex-col rounded-lg px-3 py-2 text-xs bg-emerald-100 text-emerald-900',
  schedulingWorkflowStepCardPending:
    'flex h-full flex-col rounded-lg px-3 py-2 text-xs bg-white text-slate-600 ring-1 ring-slate-200',
  schedulingWorkflowStepHintActive: 'mt-1 leading-snug text-violet-100',
  schedulingWorkflowStepHintIdle: 'mt-1 leading-snug text-slate-500',
  schedulingAssignmentList: 'mt-3 max-h-72 divide-y divide-slate-100 overflow-auto text-sm',
  tableFootNote: 'border-t border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-500',
  schedulingToolbarRunButton:
    'ml-auto inline-flex shrink-0 items-center justify-center rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-0',
  schedulingSavePanelShell:
    'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm',
  schedulingSavePrimaryButton:
    'inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50',
  schedulingReportBarShell:
    'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
  schedulingReportCsvButton:
    'inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50',
  schedulingReportAlertsButton:
    'inline-flex shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50',
  schedulingToolbarMainRow: 'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
  schedulingStatsGrid: 'grid gap-4 sm:grid-cols-3',
  schedulingKpiCardsGrid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-5',
  statCardTitleMuted: 'text-sm font-medium text-slate-500',
  /** KPI 週三警示卡標題（與 `statCardTitleMuted` 成對） */
  schedulingStatCardTitleAmber900: 'text-sm font-medium text-amber-900',
  schedulingStatValue3xl: 'mt-2 text-3xl font-bold tracking-tight text-slate-900',
  schedulingStatValue2xl: 'mt-2 text-2xl font-bold tracking-tight text-slate-900',
  schedulingStatValue2xlAmber900: 'mt-2 text-2xl font-bold tracking-tight text-amber-900',
  schedulingMidweekKpiHintAmber: 'mt-1 text-[11px] text-amber-800',
} as const
