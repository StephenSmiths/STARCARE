/**
 * 全站最小 UI 約束（Tailwind class 片段）。
 * 實際鍵值定義於 `uiTokens/base`、`extended`、`extendedComposites`、`schedulingSurfaces`（單檔不超過 200 行）；調整視覺時改對應區段檔。
 */
import { uiTokensBase } from './uiTokens/base'
import { uiTokensExtended } from './uiTokens/extended'
import { uiTokensExtendedComposites } from './uiTokens/extendedComposites'
import { uiTokensSchedulingSurfaces } from './uiTokens/schedulingSurfaces'

export const uiTokens = {
  ...uiTokensBase,
  ...uiTokensExtended,
  ...uiTokensExtendedComposites,
  ...uiTokensSchedulingSurfaces,
} as const
