/**
 * 與 `base` 組字：資料表 cell、五步 Stepper、通知徽章、排班側欄、根版面與表單抽屜層。
 * 表單／統計複合類見 **`extendedCompositesFormsAndMetrics`**。
 */
import { uiTokensBase } from './base'

export const uiTokensExtendedCompositesTablesShellWorkflow = {
  /** 院友單筆表單：格線與核取列 */
  residentFormGrid: 'grid gap-3 text-sm',
  residentFormGridMt3: 'mt-3 grid gap-3 text-sm',
  residentFormCheckboxLabel: `flex items-center gap-2 ${uiTokensBase.formLabel}`,
  /** 歷史文件／評估管理：表格外殼與儲存格 */
  tableCompactTh: 'border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700',
  historicalDocumentsTableWrap: 'overflow-x-auto rounded-lg border border-slate-200',
  historicalDocumentsTd:
    'max-w-[14rem] border-b border-slate-100 px-3 py-2 text-sm text-slate-800',
  historicalDocumentsTdNarrative:
    'max-w-[14rem] border-b border-slate-100 px-3 py-2 text-sm text-slate-800 whitespace-pre-wrap',
  historicalDocumentsTdMonoId:
    'max-w-[14rem] border-b border-slate-100 px-3 py-2 font-mono text-xs text-slate-800',
  assessmentTableWrapMt2: 'mt-2 overflow-x-auto rounded-lg border border-slate-200',
  assessmentTableTd: 'border-b border-slate-100 px-3 py-2 text-sm text-slate-800',
  /** 工作計劃五步：標題與步驟卡／提示色（天藍主題） */
  workPlanStepperTitle: `${uiTokensBase.blockHeading} text-sky-950`,
  workPlanStepCardActive:
    'flex h-full flex-col rounded-lg px-3 py-2 text-xs bg-sky-600 text-white shadow-md',
  workPlanStepCardDone:
    'flex h-full flex-col rounded-lg px-3 py-2 text-xs bg-emerald-100 text-emerald-900',
  workPlanStepCardPending:
    'flex h-full flex-col rounded-lg px-3 py-2 text-xs bg-white text-slate-600 ring-1 ring-slate-200',
  workPlanStepHintComplete: 'mt-1 leading-snug text-emerald-800',
  workPlanStepHintActive: 'mt-1 leading-snug text-sky-100',
  workPlanStepHintIdle: 'mt-1 leading-snug text-slate-500',
  /** 通知中心：嚴重度標籤（整段 class，避免模板拼色） */
  notificationSeverityBadgeHigh: 'rounded-full px-2 py-0.5 text-xs bg-red-100 text-red-700',
  notificationSeverityBadgeMedium: 'rounded-full px-2 py-0.5 text-xs bg-amber-100 text-amber-700',
  notificationSeverityBadgeLow: 'rounded-full px-2 py-0.5 text-xs bg-slate-100 text-slate-700',
  /** 排班側欄：小螢幕位移與導覽列組合態 */
  sidebarShellMobileOpen: `${uiTokensBase.sidebarShell} translate-x-0`,
  sidebarShellMobileClosed: `${uiTokensBase.sidebarShell} -translate-x-full md:translate-x-0`,
  sidebarNavLinkRowActive: `${uiTokensBase.sidebarNavLink} ${uiTokensBase.sidebarNavLinkActive}`,
  sidebarNavLinkRowInactive: `${uiTokensBase.sidebarNavLink} ${uiTokensBase.sidebarNavLinkInactive}`,
  /** 根版面：主內容捲動區（含頂欄留白） */
  appMainContentArea: `mx-auto w-full max-w-6xl flex-1 overflow-auto p-4 md:p-6 lg:p-8 ${uiTokensBase.mainWithMobileNavPad}`,
  /** 根應用：工作階段載入中全螢幕 */
  appAuthSessionLoadingRoot: 'flex min-h-screen items-center justify-center bg-slate-100 text-slate-600',
  /** 響應式表單抽屜：全螢幕視窗層 */
  formSheetViewportRoot: 'fixed inset-0 z-[100]',
  /** 表單標題列左側（標題長字省略） */
  formSheetTitleShrinkWrap: 'min-w-0',
} as const
