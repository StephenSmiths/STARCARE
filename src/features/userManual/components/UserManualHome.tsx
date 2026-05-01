import { uiTokens } from '../../shared/ui/uiTokens'

const manualSections = [
  {
    title: '快速上手',
    items: [
      '先於「員工管理」與「院友管理」確認基礎資料，再進入排班與工作計劃。',
      '排班相關操作建議依序：導入資料 → 預檢 → 確認提交，避免重覆提交。',
    ],
  },
  {
    title: '閉環流程建議',
    items: [
      '工作計劃 / 服務表單 / 交更：請依頁面狀態流（草稿、提交、審核）操作。',
      '評估管理與通知中心可用於追蹤逾期與已執行事件，形成日常巡檢閉環。',
    ],
  },
  {
    title: '文件參考',
    items: [
      'docs/business-logic.md（條文整理）',
      'docs/pdf-sequenced-gap-checklist.md（交付缺口追蹤）',
      'docs/rbac-seq1-verification-checklist.md（權限抽測）',
    ],
  },
]

/** PDF 02【15】用戶手冊（骨架）：站內操作指引與文件入口 */
export const UserManualHome = () => (
  <div className={uiTokens.stackVertical}>
    <p className="text-sm text-slate-600">
      此頁提供站內操作摘要；正式交付版可再補圖文教學、角色分章節與常見問題。
    </p>
    {manualSections.map((section) => (
      <section key={section.title} className={uiTokens.surfaceCardCompact}>
        <h2 className={uiTokens.blockHeading}>{section.title}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    ))}
  </div>
)
