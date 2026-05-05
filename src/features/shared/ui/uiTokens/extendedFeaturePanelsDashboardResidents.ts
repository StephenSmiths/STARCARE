/**
 * 擴充 UI tokens：儀表、院友 KPI／匯入預檢／清單與工具列（子檔分段 ≤200 行）。
 * 表格、Modal、審核、Auth、Composer 等見 **`extendedFeaturePanelsTablesWorkflow`**。
 */
import { uiTokensExtendedFeaturePanelsDashboardSurfaces } from './extendedFeaturePanelsDashboardSurfaces'
import { uiTokensExtendedFeaturePanelsResidentsSurfaces } from './extendedFeaturePanelsResidentsSurfaces'

export const uiTokensExtendedFeaturePanelsDashboardResidents = {
  ...uiTokensExtendedFeaturePanelsDashboardSurfaces,
  ...uiTokensExtendedFeaturePanelsResidentsSurfaces,
} as const
