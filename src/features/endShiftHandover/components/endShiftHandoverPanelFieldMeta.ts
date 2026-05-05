import type { EndShiftHandoverFields } from '../types/endShiftHandover'

export type EndShiftHandoverTextBlockKey = Exclude<keyof EndShiftHandoverFields, 'signatureName'>

/** ①～⑤ 文字區塊（對齊 PDF 02【6】） */
export const END_SHIFT_HANDOVER_TEXT_BLOCKS: Array<{
  key: EndShiftHandoverTextBlockKey
  label: string
  placeholder: string
}> = [
  { key: 'dataOverview', label: '① 數據概覽', placeholder: '服務量、達標摘要、異常…' },
  { key: 'followUps', label: '② 跟進', placeholder: '未完成項目／待追蹤院友…' },
  { key: 'newItems', label: '③ 新增事項', placeholder: '本更新增須交接事項…' },
  { key: 'reminders', label: '④ 提醒', placeholder: '對下一更／主管之重點提醒…' },
  { key: 'reportSummary', label: '⑤ 報告', placeholder: '簡要報告或附件索引…' },
]
