/**
 * 擴充 UI tokens：表格／Modal／表單／審核／Auth／交更／排班五步／Composer 等工作流表面（子檔分段 ≤200 行）。
 * 儀表與院友清單見 **`extendedFeaturePanelsDashboardResidents`**。
 */
import { uiTokensExtendedFeaturePanelsTablesWorkflowAuthComposer } from './extendedFeaturePanelsTablesWorkflowAuthComposer'
import { uiTokensExtendedFeaturePanelsTablesWorkflowTablesFormsReview } from './extendedFeaturePanelsTablesWorkflowTablesFormsReview'

export const uiTokensExtendedFeaturePanelsTablesWorkflow = {
  ...uiTokensExtendedFeaturePanelsTablesWorkflowTablesFormsReview,
  ...uiTokensExtendedFeaturePanelsTablesWorkflowAuthComposer,
} as const
