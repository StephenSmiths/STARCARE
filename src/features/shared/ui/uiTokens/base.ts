/**
 * 全站 UI 約束：版型、表單、按鈕、側欄、表單抽屜（基礎段；子檔分段 ≤200 行）。
 */
import { uiTokensBaseFormsControls } from './baseFormsControls'
import { uiTokensBaseTypographyLayout } from './baseTypographyLayout'

export const uiTokensBase = {
  ...uiTokensBaseTypographyLayout,
  ...uiTokensBaseFormsControls,
} as const
