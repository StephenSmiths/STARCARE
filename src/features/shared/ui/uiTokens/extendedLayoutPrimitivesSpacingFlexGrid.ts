/**
 * 擴充 UI tokens：間距、flex／grid 骨架（版面 primitives 段一）。
 */
export const uiTokensExtendedLayoutPrimitivesSpacingFlexGrid = {
  /** 常用垂直間距（頁內模組堆疊） */
  layoutSpaceY2: 'space-y-2',
  layoutSpaceY3: 'space-y-3',
  layoutSpaceY4: 'space-y-4',
  layoutSpaceY6: 'space-y-6',
  layoutSpaceY8: 'space-y-8',
  /** 常用水平列（工具列／卡片頂列） */
  layoutFlexBetweenGap2: 'flex items-center justify-between gap-2',
  layoutFlexWrapBetweenGap2: 'flex flex-wrap items-center justify-between gap-2',
  layoutFlexWrapBetweenGap2Py2: 'flex flex-wrap items-center justify-between gap-2 py-2',
  layoutFlexWrapGap2: 'flex flex-wrap gap-2',
  layoutFlexGap2: 'flex gap-2',
  /** 儀表快速連結條列 */
  dashboardQuickLinksList: 'mt-2 list-inside list-disc space-y-1',
  /** 段落說明（無頂距，與 `moduleDescription` 區隔） */
  textBodySubtleSm: 'text-sm text-slate-600',
  /** 內聯次要說明（如週三清單括號內資助類別） */
  textSubtleMl1Slate600: 'ml-1 text-slate-600',
  layoutFlexItemsCenterGap2: 'flex items-center gap-2',
  layoutFlexWrapItemsCenterGap2: 'flex flex-wrap items-center gap-2',
  layoutFlexWrapItemsCenterGap2Mt2: 'mt-2 flex flex-wrap items-center gap-2',
  layoutFlexWrapItemsCenterGap2TextXs: 'flex flex-wrap items-center gap-2 text-xs',
  layoutFlexWrapItemsEndGap3Mt4: 'mt-4 flex flex-wrap items-end gap-3',
  layoutFlexGap2Mt2: 'mt-2 flex gap-2',
  /** 資料表基礎（無框線樣式時與 cell token 併用） */
  tableMinWidthCollapse: 'min-w-full border-collapse',
  layoutGridGap3: 'grid gap-3',
} as const
