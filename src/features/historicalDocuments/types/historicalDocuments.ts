/** 列表資料來源：雲端已核准列或本機快取後備 */
export type HistoricalDocumentsDataSource = 'db' | 'local-fallback'

/** PDF 02【10】歷史文件篩選（僅 APPROVED 表單來源） */
export type HistoricalDocumentsFilters = {
  /** YYYY-MM-DD，空字串表示不限制 */
  dateFrom: string
  dateTo: string
  /** 比對院友姓名或紀要（不分大小寫） */
  keyword: string
}
