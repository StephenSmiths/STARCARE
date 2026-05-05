/**
 * 全站 UI 約束：儀表／院友／表格／Modal／審核列表等（擴充段）。
 * 與 `base` 組合之鍵見 **`extendedComposites`**。
 * 分段定義：`extendedFeaturePanels`、`extendedLayoutPrimitives`（單檔 ≤200 行）。
 */
import { uiTokensExtendedFeaturePanels } from './extendedFeaturePanels'
import { uiTokensExtendedLayoutPrimitives } from './extendedLayoutPrimitives'

export const uiTokensExtended = {
  ...uiTokensExtendedFeaturePanels,
  ...uiTokensExtendedLayoutPrimitives,
} as const
