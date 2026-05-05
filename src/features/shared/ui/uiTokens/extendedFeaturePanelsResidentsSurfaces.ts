/**
 * 擴充 UI tokens：院友 KPI 磚／CSV 預檢／名單工具列與列表面。
 */
export const uiTokensExtendedFeaturePanelsResidentsSurfaces = {
  residentKpiTileSlate: 'rounded-lg border border-slate-200 bg-slate-50 p-3',
  residentKpiTileAmber: 'rounded-lg border border-amber-200 bg-amber-50 p-3',
  residentKpiTileViolet: 'rounded-lg border border-violet-200 bg-violet-50 p-3',
  residentKpiTileEmerald: 'rounded-lg border border-emerald-200 bg-emerald-50 p-3',
  residentOverviewGrid: 'mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4',
  formInlineError: 'text-sm text-red-600',
  listCalloutAmber: 'mt-2 space-y-1 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900',
  residentImportSection: 'rounded-md border border-slate-200 p-3 text-sm',
  /** 活動時段列表外層（等同 `residentImportSection`＋上距） */
  residentImportSectionMt4: 'mt-4 rounded-md border border-slate-200 p-3 text-sm',
  residentImportStepRow: 'mt-2 flex flex-wrap gap-2 text-xs',
  residentImportStepPill: 'rounded-full bg-slate-100 px-2 py-1 text-slate-700',
  residentDryRunResultShell: 'mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700',
  dryRunStatusPillPass: 'rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-700',
  dryRunStatusPillWarn: 'rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-700',
  listDiscError: 'mt-2 list-disc pl-5 text-xs text-red-700',
  listDiscErrorTight: 'mt-1 list-disc pl-5 text-red-700',
  textSubtleXs: 'text-xs text-slate-500',
  textMutedBody: 'text-slate-600',
  textSuccessSm: 'mt-1 text-emerald-700',
  textCommitSuccess: 'mt-2 text-xs text-emerald-700',
  residentListToolbar: 'mt-4 rounded-md border border-slate-200 p-3',
  residentListToolbarMeta: 'ml-auto text-slate-500',
  residentListScroll: 'mt-3 max-h-[60vh] space-y-2 overflow-auto pr-1',
  residentListRow: 'rounded-md border border-slate-200 p-3 text-sm',
  residentListRowMeta: 'text-slate-600',
  residentListEmptyRow: 'rounded-md border border-slate-200 p-3 text-center text-sm text-slate-500',
  residentListPager: 'mt-2 flex items-center justify-end gap-2 text-xs',
  residentListPagerMeta: 'text-slate-500',
} as const
