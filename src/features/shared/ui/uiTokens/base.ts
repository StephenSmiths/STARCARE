/**
 * 全站 UI 約束：版型、表單、按鈕、側欄、表單抽屜（基礎段）。
 */
export const uiTokensBase = {
  stackVertical: 'flex flex-col gap-6',
  masthead: 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
  productTitle: 'text-2xl font-bold tracking-tight text-slate-900',
  moduleKicker: 'mt-2 text-xs font-medium uppercase tracking-wide text-slate-500',
  moduleTitle: 'mt-1 text-xl font-semibold text-slate-900',
  moduleDescription: 'mt-2 text-sm text-slate-600',
  surfaceCard: 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
  surfaceCardCompact: 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm',
  pageSectionHeading: 'text-xl font-semibold text-slate-900',
  blockHeading: 'text-base font-semibold text-slate-900',
  blockHelp: 'mt-1 text-xs text-slate-600',
  sectionHelp: 'mt-2 text-sm text-slate-600',
  formLabel: 'text-sm font-medium text-slate-700',
  formInput: 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
  formTextarea:
    'min-h-[4rem] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
  formSelect: 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900',
  formFieldStack: 'flex flex-col gap-1',
  btnPrimary:
    'rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50',
  btnSecondary:
    'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50',
  btnAccent:
    'rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60',
  btnSuccess:
    'rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60',
  btnDangerOutline: 'rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50',
  btnCompact: 'rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50',
  linkDownload: 'rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50',
  mobileTopBar:
    'fixed top-0 left-0 right-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-3 backdrop-blur md:hidden',
  mainWithMobileNavPad: 'pt-14 md:pt-0',
  bannerInfo: 'rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900',
  bannerWarn: 'rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900',
  bannerDanger: 'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800',
  bannerSuccess: 'rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800',
  badgeUrgent: 'mr-2 rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900',
  calloutOk: 'rounded-xl border border-slate-200 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-800',
  calloutWarn: 'rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900',
  btnSecondaryWarn:
    'rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50',
  panelMutedInset: 'rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs',
  surfaceCardCompactWarn: 'rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm',
  surfaceTableShell: 'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
  inlineNoticeWarn: 'mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800',
  inlineNoticeSuccess: 'mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800',
  rosterConfirmChoiceCard:
    'flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700',
  textUrgentHint: 'text-xs text-amber-800',
  sidebarMutedButton:
    'w-full rounded-lg border border-slate-600 px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-800',
  sidebarShell:
    'flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-slate-100 fixed bottom-0 left-0 top-14 z-50 transition-transform duration-200 ease-out md:static md:top-auto md:z-auto md:h-auto md:translate-x-0',
  sidebarHeader: 'border-b border-slate-800 px-5 py-6',
  sidebarBrandKicker: 'text-xs font-medium uppercase tracking-wider text-violet-300',
  sidebarBrandTitle: 'mt-1 text-lg font-semibold text-white',
  sidebarBrandHint: 'mt-2 text-[11px] leading-relaxed text-slate-400',
  sidebarNavGroupLabel: 'mb-1.5 px-3 text-[11px] font-semibold tracking-wide text-slate-500',
  sidebarNavLink: 'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
  sidebarNavLinkActive: 'bg-violet-600/20 text-violet-200 ring-1 ring-violet-500/40',
  sidebarNavLinkInactive: 'text-slate-300 hover:bg-slate-800 hover:text-white',
  sidebarFooter: 'border-t border-slate-800 p-4 text-xs text-slate-500',
  sidebarUserEmail: 'truncate text-slate-400',
  sidebarRoleLine: 'text-[11px] uppercase tracking-wide text-violet-300',
  mobileNavBackdrop: 'fixed inset-x-0 bottom-0 top-14 z-40 bg-slate-900/50 md:hidden',
  mobileTopBarTitle: 'text-sm font-semibold text-slate-800',
  auditTrailPanel: 'rounded-md bg-slate-50 p-3 text-xs text-slate-600',
  metaChip: 'rounded bg-slate-200 px-2 py-0.5 text-[11px] text-slate-700',
  emptyStatePill: 'rounded border border-slate-200 bg-white px-2 py-1 text-slate-500',
  panelTitleSm: 'text-sm font-semibold text-slate-800',
  helpFinePrint: 'mt-1 text-[11px] text-slate-500',
  importRunSummaryShell: 'mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700',
  importRunHistoryShell: 'mt-2 rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-700',
  importRunHistoryRow: 'rounded bg-slate-50 px-2 py-1',
  formSheetBackdrop: 'absolute inset-0 z-0 bg-slate-900/40',
  formSheetPanel:
    'absolute inset-0 z-10 flex max-h-[100dvh] flex-col bg-white shadow-xl md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-lg',
  formSheetHeader: 'flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-3',
  formSheetTitle: 'truncate text-lg font-semibold text-slate-900',
  formSheetDescription: 'mt-1 text-xs text-slate-600',
  formSheetBody: 'min-h-0 flex-1 overflow-y-auto px-4 py-3',
  /** 表單內核取方塊與文字並排（工作計劃「全部日期」等） */
  formCheckboxRow: 'flex items-center gap-2 text-sm text-slate-700',
  /** 行內後端欄位鍵（metadata 鍵名等） */
  inlineKbd: 'mx-1 rounded bg-slate-100 px-1 font-mono text-xs',
  /** 系統設定等：核取方塊與長句標籤（字色較深） */
  formToggleLabel: 'flex cursor-pointer items-center gap-2 text-sm text-slate-800',
} as const
