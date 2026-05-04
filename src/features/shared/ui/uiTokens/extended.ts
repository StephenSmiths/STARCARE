/**
 * 全站 UI 約束：儀表／院友／表格／Modal／審核列表等（擴充段）。
 * 與 `base` 組合之鍵見 **`extendedComposites`**。
 */
export const uiTokensExtended = {
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
  /** Supabase Auth 登入全螢幕底與卡片 */
  authSignInRoot: 'flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4',
  authSignInCard: 'w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm',
  /** 登入表單欄位區塊間距 */
  authSignInFormStack: 'mt-6 space-y-4',
  /** 無垂直外距：分牆列表外殼（工作計劃列表等；外層自加 mt-*／text-sm） */
  listDivideShell: 'divide-y divide-slate-100 rounded-lg border border-slate-200',
  workPlanTeamListRow: 'flex flex-wrap items-center gap-3 px-3 py-2 text-sm',
  workPlanMyListRow:
    'flex flex-col gap-2 px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between',
  handoverHistoryAside: 'rounded-lg border border-slate-200 bg-slate-50/80 p-3',
  handoverHistoryScrollList: 'mt-3 max-h-72 space-y-2 overflow-auto text-xs',
  handoverHistoryItemButton:
    'w-full rounded border border-slate-200 bg-white px-2 py-2 text-left hover:bg-violet-50',
  recordsEmptyHint: 'mt-2 text-sm text-slate-500',
  /** 用戶手冊等：條列說明（disc） */
  bulletListDiscSm: 'mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700',
  /** 工作分析提交概況小格（白底） */
  submissionStatTile: 'rounded-lg border border-slate-200 bg-white px-3 py-2',
  submissionStatTileViolet: 'rounded-lg border border-violet-200 bg-violet-50 px-3 py-2',
  /** 概況卡數字本體（另接 text-* 色） */
  statDdXl: 'text-xl font-semibold',
  /** 系統設定：雙欄時間欄位格 */
  settingsFieldGrid: 'mt-4 grid gap-4 sm:grid-cols-2',
  settingsToggleStack: 'mt-4 flex flex-col gap-3',
  /** 排班衝突列表（list-inside 捲動） */
  conflictBulletList: 'mt-2 max-h-48 list-inside list-disc space-y-1 overflow-auto text-xs',
  /** 占位雙欄（回饋／通知等） */
  stubTwoColGrid: 'grid gap-4 md:grid-cols-2',
  /** 單行等寬字＋換行（batch id 等） */
  monoBreakAllNote: 'mt-2 font-mono text-[11px] text-slate-500 break-all',
  /** 院友 KPI 格內數字（另接 text-* 色） */
  statValueLg: 'mt-1 text-lg font-semibold',
  /** 設定儲存成功內聯句 */
  inlineSuccessText: 'text-sm text-emerald-700',
  /** 驗證錯誤內層條列 */
  listDiscInsideTight: 'list-inside list-disc space-y-1',
  /** 工作計劃 Composer：主表單欄位格 */
  composerFieldGrid: 'grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3',
  composerPreviewShell: 'rounded-xl border border-slate-200 bg-slate-50 p-4',
  composerDraftList: 'mt-3 divide-y divide-slate-200 text-sm',
  aiReportBodyPre: 'mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs text-slate-800',
  notificationMetaRow: 'mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500',
  /** 單段載入／表單錯誤（緊湊紅底，工作計劃 meta 等） */
  inlineDangerCompact: 'rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800',
  /** 工作計劃五步 Stepper 外殼（天藍主題） */
  workPlanStepperSection: 'rounded-xl border border-sky-200 bg-sky-50/70 p-4',
  workPlanStepperBadge: 'rounded-full bg-white px-3 py-1 text-xs font-medium text-sky-800 ring-1 ring-sky-200',
  /** 五步進度列標題列／步驟網格（排班／工作計劃共用） */
  stepperHeaderRow: 'flex flex-wrap items-end justify-between gap-2',
  stepperStepsOlGrid: 'mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5',
  /** 接更／交更：主表單＋歷史側欄 */
  handoverEditorGrid: 'mt-4 grid gap-3 lg:grid-cols-[1fr_280px]',
  /** 卡片頂部標題＋工具雙欄（KPI 趨勢等） */
  panelHeaderSplit: 'flex flex-wrap items-start justify-between gap-2',
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
