/**
 * 排班頁院友指派表、復康軌跡表、儀表統計格、歷史文件工具列、KPI 趨勢過濾與資助標籤（子檔分段 ≤200 行）。
 * 應用殼／五步 Stepper／報表工具列見 **`schedulingSurfacesWorkflow`**。
 */
import { uiTokensSchedulingSurfacesTablesTrendDataTables } from './schedulingSurfacesTablesTrendDataTables'
import { uiTokensSchedulingSurfacesTablesTrendToolbars } from './schedulingSurfacesTablesTrendToolbars'

export const uiTokensSchedulingSurfacesTablesTrend = {
  ...uiTokensSchedulingSurfacesTablesTrendDataTables,
  ...uiTokensSchedulingSurfacesTablesTrendToolbars,
} as const
