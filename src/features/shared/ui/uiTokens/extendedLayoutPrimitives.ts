/**
 * 擴充 UI tokens：通用版面／間距／flex／grid／表格骨架／字級輔助（子檔分段 ≤200 行）。
 * 功能區塊類見 **`extendedFeaturePanels`**。
 */
import { uiTokensExtendedLayoutPrimitivesSpacingFlexGrid } from './extendedLayoutPrimitivesSpacingFlexGrid'
import { uiTokensExtendedLayoutPrimitivesTypographyImport } from './extendedLayoutPrimitivesTypographyImport'

export const uiTokensExtendedLayoutPrimitives = {
  ...uiTokensExtendedLayoutPrimitivesSpacingFlexGrid,
  ...uiTokensExtendedLayoutPrimitivesTypographyImport,
} as const
