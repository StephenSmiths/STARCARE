/**
 * 擴充 UI tokens：留白、進階 grid、字級／字重、匯入摘要網格（版面 primitives 段二）。
 */
export const uiTokensExtendedLayoutPrimitivesTypographyImport = {
  layoutSpacerMt8: 'mt-8',
  layoutSpacerMt1: 'mt-1',
  layoutMb4: 'mb-4',
  tableBodyDivideSlate100: 'divide-y divide-slate-100',
  layoutFlexColGap8: 'flex flex-col gap-8',
  layoutGridGap4SmCols3: 'grid gap-4 sm:grid-cols-3',
  layoutGridGap3Mt4Sm2Lg3: 'mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3',
  layoutFlexColGap4Mt4: 'mt-4 flex flex-col gap-4',
  layoutGrid2ColGap2: 'grid grid-cols-2 gap-2',
  layoutSpaceY1Mt2: 'mt-2 space-y-1',
  layoutSpaceY1: 'space-y-1',
  textWeightMedium: 'font-medium',
  textWeightMediumSlate900: 'font-medium text-slate-900',
  textMono: 'font-mono',
  textXsMt1: 'mt-1 text-xs',
  layoutFlexShrink0Gap2: 'flex shrink-0 gap-2',
  /** 匯入批次摘要網格（ImportRunSummaryCard） */
  importRunSummaryMetricsGrid: 'mt-1 grid grid-cols-2 gap-2 sm:grid-cols-5',
  importRunStatSuccess: 'text-emerald-700',
  importRunStatFail: 'text-red-700',
  importRunHistoryScrollList: 'mt-1 max-h-40 space-y-1 overflow-auto',
  /** Stepper 目前步驟標題字重 */
  textWeightSemibold: 'font-semibold',
  /** 內文強調詞左右留白（粗體字詞） */
  proseStrongInset: 'mx-0.5',
  textSemiboldSlate800: 'font-semibold text-slate-800',
  textSemiboldAmber950: 'font-semibold text-amber-950',
  /** 技術名／表名 monospace（小字） */
  textMono11: 'font-mono text-[11px]',
  layoutListItemPy2: 'py-2',
} as const
