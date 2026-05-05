/**
 * 與 `base` 組字：meta／間距／堆疊／搜尋窄欄／模組說明／列表外殼／灰調確認卡。
 * 表單輸入與 stat 字級見 **`extendedCompositesFormsInputs`**。
 */
import { uiTokensBase } from './base'

export const uiTokensExtendedCompositesFormsSpacing = {
  metaChipMl2: `${uiTokensBase.metaChip} ml-2`,
  textMutedBodyMl2: 'ml-2 text-slate-600',
  hashLinkAccentMl2: 'ml-2 text-violet-700 underline',
  textSubtleXsMl2Slate400: 'ml-2 text-xs text-slate-400',
  residentListPagerMetaMl2: 'ml-2 text-slate-500',
  formFieldStackSmColSpan2: `${uiTokensBase.formFieldStack} sm:col-span-2`,
  formFieldStackSmColSpan2Lg1: `${uiTokensBase.formFieldStack} sm:col-span-2 lg:col-span-1`,
  formToggleLabelMt4: `${uiTokensBase.formToggleLabel} mt-4`,
  stackVerticalMt3: `${uiTokensBase.stackVertical} mt-3`,
  stackVerticalMt4: `${uiTokensBase.stackVertical} mt-4`,
  handoverHomeContentWidth: `mx-auto w-full max-w-5xl ${uiTokensBase.stackVertical}`,
  surfaceCardCompactDimmed: `${uiTokensBase.surfaceCardCompact} opacity-70`,
  schedulingHistoryUndoSection: `${uiTokensBase.surfaceCardCompact} border-slate-100 bg-slate-50`,
  formInputSearchNarrow: `${uiTokensBase.formInput} max-w-xs sm:max-w-[14rem]`,
  formSelectAutoMin8rem: `${uiTokensBase.formSelect} w-auto min-w-[8rem]`,
  moduleDescriptionSlate700: `${uiTokensBase.moduleDescription} text-slate-700`,
  moduleDescriptionMt2Slate700: `${uiTokensBase.moduleDescription} mt-2 text-slate-700`,
  listDivideShellMt4TextSm: 'mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 text-sm',
  textMutedBodyXs: 'text-xs text-slate-600',
  textSubtleXsMl2: 'ml-2 text-xs text-slate-500',
  textSubtleXsMono: 'font-mono text-xs text-slate-500',
  rosterConfirmChoiceCardMuted: `${uiTokensBase.rosterConfirmChoiceCard} opacity-60`,
} as const
