/** 員工概覽批量軟刪除：雙重確認（PDF 02【13】／防誤觸） */
export type ConfirmStaffBatchSoftDeleteInput = {
  count: number
  /** 是否等於目前清單上全部列（需額外數字確認） */
  isEntireVisibleList: boolean
  sampleNames: string[]
}

export function confirmStaffBatchSoftDelete(input: ConfirmStaffBatchSoftDeleteInput): boolean {
  const { count, isEntireVisibleList, sampleNames } = input
  if (count <= 0) return false

  const preview = sampleNames.slice(0, 5).join('、')
  const tail = count > 5 ? `…等共 ${count} 位` : ''

  const msg =
    `確定要軟刪除已選的 ${count} 位員工？\n\n` +
    `與單筆「軟刪除」相同：主檔、技能、活動時段、可排時段會一併標記為已刪除。\n` +
    `${preview}${tail}\n\n` +
    `此操作無法從本畫面還原。`

  if (!window.confirm(msg)) return false

  if (count >= 2) {
    const typed = window.prompt('請輸入「確認軟刪除」（五個字）以繼續：', '')
    if (typed !== '確認軟刪除') return false
  }

  if (isEntireVisibleList) {
    const n = window.prompt(`您將軟刪除目前清單上的全部 ${count} 位。請輸入數字 ${count} 以確認：`, '')
    if (n !== String(count)) return false
  }

  return true
}
