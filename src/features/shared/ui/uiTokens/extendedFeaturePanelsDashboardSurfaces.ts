/**
 * 擴充 UI tokens：儀表快捷／流程說明／統計磚／週三提醒等工作流表面。
 */
export const uiTokensExtendedFeaturePanelsDashboardSurfaces = {
  dashboardQuickLinksCard: 'rounded-md border border-slate-200 bg-white p-4 text-xs text-slate-600',
  dashboardQuickLinksTitle: 'font-medium text-slate-800',
  hashLinkAccent: 'text-violet-700 underline',
  dashboardFlowPanel: 'rounded-xl border border-violet-200 bg-violet-50/50 p-5 shadow-sm',
  dashboardFlowTitle: 'text-sm font-semibold text-violet-950',
  dashboardFlowIntro: 'mt-1 text-xs text-slate-600',
  dashboardFlowOrderedList: 'mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-800',
  hashLinkProse: 'mx-1 font-medium text-violet-800 underline',
  dashboardStatTile: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm',
  dashboardStatTileLabel: 'text-[11px] font-medium uppercase tracking-wide text-slate-500',
  dashboardStatTileValue: 'mt-1 text-2xl font-semibold text-slate-900',
  dashboardStatTileHint: 'mt-1 text-[11px] text-slate-400',
  dashboardLoadingPanel:
    'rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600',
  dashboardWednesdayPanel: 'rounded-xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm',
  dashboardWednesdayTitle: 'text-sm font-semibold text-amber-950',
  dashboardWednesdayIntro: 'mt-1 text-xs text-slate-700',
  dashboardMutedNote: 'mt-2 text-xs text-slate-600',
  dashboardWednesdayList: 'mt-2 max-h-40 list-disc space-y-1 overflow-y-auto pl-5 text-xs text-slate-900',
  dashboardWednesdayFooterCount: 'mt-2 text-[11px] font-medium text-amber-900',
} as const
