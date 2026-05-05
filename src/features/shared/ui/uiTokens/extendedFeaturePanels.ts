/**
 * 擴充 UI tokens：儀表／院友／表格／Modal／審核／Auth／Handover／Composer 等功能區塊彙總。
 * 版面級 primitives 見 **`extendedLayoutPrimitives`**；分段見子檔（單檔 ≤200 行）。
 */
import { uiTokensExtendedFeaturePanelsDashboardResidents } from './extendedFeaturePanelsDashboardResidents'
import { uiTokensExtendedFeaturePanelsTablesWorkflow } from './extendedFeaturePanelsTablesWorkflow'

export const uiTokensExtendedFeaturePanels = {
  ...uiTokensExtendedFeaturePanelsDashboardResidents,
  ...uiTokensExtendedFeaturePanelsTablesWorkflow,
} as const
