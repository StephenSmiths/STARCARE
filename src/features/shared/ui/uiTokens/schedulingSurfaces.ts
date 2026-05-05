/**
 * 排班儀表殼層、院友指派表、KPI 趨勢過濾、復康表、儀表統計格；歷史文件篩選列複合樣式。
 * 分段見子檔（單檔 ≤200 行）；複合字串自 `uiTokensBase` 組字。
 */
import { uiTokensSchedulingSurfacesTablesTrend } from './schedulingSurfacesTablesTrend'
import { uiTokensSchedulingSurfacesWorkflow } from './schedulingSurfacesWorkflow'

export const uiTokensSchedulingSurfaces = {
  ...uiTokensSchedulingSurfacesWorkflow,
  ...uiTokensSchedulingSurfacesTablesTrend,
} as const
