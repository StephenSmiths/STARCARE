/**
 * 全站 UI 複合片段（與 `base` 組字或固定色階）；分段見子檔（單檔 ≤200 行）。
 */
import { uiTokensExtendedCompositesFormsAndMetrics } from './extendedCompositesFormsAndMetrics'
import { uiTokensExtendedCompositesTablesShellWorkflow } from './extendedCompositesTablesShellWorkflow'

export const uiTokensExtendedComposites = {
  ...uiTokensExtendedCompositesFormsAndMetrics,
  ...uiTokensExtendedCompositesTablesShellWorkflow,
} as const
