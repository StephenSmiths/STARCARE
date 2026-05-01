/**
 * 全站最小 UI 約束（Tailwind class 片段）。
 * 調整視覺規範時優先改此檔，再同步各模組引用。
 */
export const uiTokens = {
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
  formTextarea: 'min-h-[4rem] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
  formSelect: 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900',
  formFieldStack: 'flex flex-col gap-1',
  btnPrimary: 'rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50',
  btnSecondary: 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50',
  btnAccent: 'rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60',
  btnSuccess: 'rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60',
  btnDangerOutline: 'rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50',
  /** 表內次要操作（收合列表等） */
  btnCompact: 'rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50',
  linkDownload: 'rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50',
  mobileTopBar: 'fixed top-0 left-0 right-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-3 backdrop-blur md:hidden',
  mainWithMobileNavPad: 'pt-14 md:pt-0',
} as const
