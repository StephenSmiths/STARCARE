/**
 * 與 `base` 組字：表單／按鈕邊距、數字 stat、稽核篩選、AI Composer、版面堆疊等。
 * 院友表單格線、文件表 cell、五步卡、側欄／根版面見 **`extendedCompositesTablesShellWorkflow`**。
 */
import { uiTokensExtendedCompositesFormsInputs } from './extendedCompositesFormsInputs'
import { uiTokensExtendedCompositesFormsSpacing } from './extendedCompositesFormsSpacing'

export const uiTokensExtendedCompositesFormsAndMetrics = {
  ...uiTokensExtendedCompositesFormsInputs,
  ...uiTokensExtendedCompositesFormsSpacing,
} as const
