/** PDF 02【11】占位：後端 AI 接上後替換為實際摘要／引用資料來源 */
export const buildPlaceholderAiReportBody = (title: string): string =>
  [
    `【報告草稿】${title}`,
    '',
    '（骨架）此區將承載 Team Lead 核准前之 AI 生成內容；可編輯後「採用」鎖定版本，再「發放」對外。',
    '',
    `- 生成：占位文字，待接模型與提示詞治理。`,
    `- 編輯／採用：DRAFT → ADOPTED。`,
    `- 發放：ADOPTED → DISTRIBUTED（審計紀錄）。`,
  ].join('\n')
