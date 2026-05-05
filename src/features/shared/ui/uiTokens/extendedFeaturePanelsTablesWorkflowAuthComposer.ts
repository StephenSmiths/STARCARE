/**
 * 擴充 UI tokens：Auth／列表／交更／設定／Composer／Stepper／通知等工作流表面（段二）。
 * 段一見 **`extendedFeaturePanelsTablesWorkflowTablesFormsReview`**。
 */
export const uiTokensExtendedFeaturePanelsTablesWorkflowAuthComposer = {
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
} as const
