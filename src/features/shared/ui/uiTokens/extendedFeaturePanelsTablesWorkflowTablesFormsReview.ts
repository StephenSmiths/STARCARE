/**
 * 擴充 UI tokens：表格／Modal／表單格／審核佇列／空狀態（工作流表面段一）。
 */
export const uiTokensExtendedFeaturePanelsTablesWorkflowTablesFormsReview = {
  btnPager:
    'rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50',
  modalBackdrop: 'fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center',
  modalPanelSheetMd:
    'max-h-[90vh] w-full max-w-md overflow-auto rounded-t-xl border border-slate-200 bg-white p-4 shadow-xl sm:rounded-xl',
  formFooterActions: 'mt-4 flex justify-end gap-2',
  tableScrollShort: 'mt-3 max-h-56 overflow-auto',
  tableScrollTall: 'mt-2 max-h-64 overflow-auto',
  tableCompact: 'min-w-full text-left text-xs',
  tableHeadSticky: 'sticky top-0 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500',
  tableBodyDivided: 'divide-y divide-slate-100 text-slate-700',
  tableCell: 'px-2 py-2',
  tableCellNowrapMuted: 'whitespace-nowrap px-2 py-2 text-slate-600',
  formGridTwoCol: 'mt-4 grid gap-3 sm:grid-cols-2',
  formToolbarRow: 'mt-4 flex flex-wrap gap-2',
  myFormsList: 'mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 text-sm',
  myFormsListRow: 'flex flex-wrap items-center justify-between gap-2 px-3 py-2',
  reviewQueueStack: 'mt-4 space-y-4',
  reviewQueueItem: 'rounded-lg border border-slate-200 p-3 text-sm',
  reviewQueueTitle: 'font-medium text-slate-900',
  reviewQueueNarrative: 'mt-2 whitespace-pre-wrap text-slate-700',
  reviewActionRow: 'mt-3 flex flex-wrap gap-2',
  reviewRejectBlock: 'mt-3 space-y-2',
  emptyStateMuted: 'mt-3 text-sm text-slate-500',
  /** 列表下灰底空狀態一行（活動時段列表等） */
  emptyInlineMutedBox: 'mt-2 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-500',
} as const
