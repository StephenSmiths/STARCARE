/** PDF 02【11】Team Lead AI 報告生命週期（骨架） */
export type AiReportLifecycleStatus = 'DRAFT' | 'ADOPTED' | 'DISTRIBUTED'

/** 本地報告列；正式環境應入庫並軟刪除 */
export interface AiReportRecord {
  id: string
  title: string
  /** 純文字／Markdown 占位；真正 AI 輸出應經 Edge 審核後寫入 */
  bodyText: string
  status: AiReportLifecycleStatus
  createdByActorId: string
  createdAt: string
  updatedAt: string
  adoptedAt: string | null
  distributedAt: string | null
}
