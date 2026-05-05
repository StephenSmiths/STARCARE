/**
 * 排班頁工具列／過濾／KPI 趨勢區：歷史文件、KPI 篩選、資助標籤（段二；複合字串自 `uiTokensBase`）。
 */
import { uiTokensBase } from './base'

export const uiTokensSchedulingSurfacesTablesTrendToolbars = {
  historicalDocumentsToolbarShell: `${uiTokensBase.surfaceCardCompact} flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end`,
  historicalDocumentsFilterFieldDate: `${uiTokensBase.formFieldStack} min-w-[10rem]`,
  historicalDocumentsFilterFieldKeyword: `${uiTokensBase.formFieldStack} min-w-[12rem] flex-1`,
  historicalDocumentsToolbarHelpFullWidth: `${uiTokensBase.blockHelp} w-full`,
  schedulingKpiTrendFilterInset: `mt-2 ${uiTokensBase.panelMutedInset}`,
  schedulingKpiTrendFilterSummary: 'mb-2 text-slate-600',
  schedulingKpiTrendFilterGrid: 'grid gap-2 lg:grid-cols-4',
  schedulingKpiTrendDateInput: `${uiTokensBase.formInput} px-2 py-1 text-xs`,
  schedulingKpiTrendActorSelect: `${uiTokensBase.formSelect} px-2 py-1 text-xs`,
  schedulingKpiTrendIntroLine: 'mt-1 text-xs text-slate-500',
  schedulingKpiTrendToolbarBtnWarn: `text-xs font-medium ${uiTokensBase.btnSecondaryWarn} px-3 py-1.5 disabled:opacity-50`,
  schedulingKpiTrendToolbarBtnSecondary: `text-xs font-medium ${uiTokensBase.btnSecondary} px-3 py-1.5`,
  schedulingKpiTrendToolbarBtnDanger: `text-xs font-medium ${uiTokensBase.btnDangerOutline} px-3 py-1.5`,
  schedulingKpiTrendEmptyHint: 'mt-3 text-xs text-slate-500',
  schedulingKpiTrendTableArea: 'mt-3 max-h-56 overflow-auto text-xs',
  residentTableToolbarSearchInput: `${uiTokensBase.formInput} w-56 py-1.5 text-sm`,
  residentTableToolbarSelect: `${uiTokensBase.formSelect} py-1.5 text-sm`,
  /** 院友表資助類別標籤（整段 class，依 FundingType 擇一） */
  residentTableFundingBadgeGradeA:
    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset bg-blue-100 text-blue-800 ring-blue-600/20',
  residentTableFundingBadgeVoucher:
    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  residentTableFundingBadgePrivate:
    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset bg-slate-100 text-slate-700 ring-slate-500/15',
} as const
