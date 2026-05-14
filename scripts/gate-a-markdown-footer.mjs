/**
 * Gate A 自動產物 Markdown 頁尾：與 go-live、README、status、附錄互鏈（繁中）。
 * 變更字串時須同步 **`docs/pdf03-cursorrules-alignment.md`** §4 與 **`docs/pdf-sequenced-gap-checklist-revision-log.md`**（見專案 `.cursorrules`）。
 *
 * **Export 契約**
 * - **`gateAStandardCloseoutBlockquotes`**：多數取證／同步腳本之 **stdout** 或落檔 Markdown 末段共用兩行 blockquote（第二行併 **人工／strict-http／keep=1** 互鏈人工表開首與 **go-live** §0.1）。
 * - **`gateALatestMarkdownFooterLines`**：寫入 **`docs/evidence/gate-a-latest.md`** 檔尾（「固定入口」一行＋**`gateAStandardCloseoutBlockquotes`** 兩行＋stdout 頁尾一行）；**`gate-a-update-latest-pointer`** 之終端 stdout 另單附兩行 blockquote（不含「固定入口」）。
 * - **`gateAAutoRefClosingHintLine`**：自動引用 marker 末行、**`decision-mini`** 第四行、**`sync-decision-draft`** mini 區塊末行（併 **人工勾選表**／strict-http／keep=1）；**`gate-a-ref-sync-lib`** 僅替換 marker 內文。
 *
 * **未匯入本檔之腳本**：**`gate-a-http-evidence-auth`** 以 **`stdio: inherit`** 委派 **`gate-a-http-evidence`**（子程序已印頁尾）；**`gate-a-evidence-all`** 為 orchestrator；**`gate-a-generate-decision-mini`** 刻意僅四行＋速查列，不附兩行 blockquote（見各檔首註解）。
 */

/** 全案收尾（第一則 blockquote）＋收證指令／旗標細部並併 **人工／strict-http／keep=1**（第二則；對應 **status** **§5**／**commands-appendix**／人工表開首；不含「此檔為固定入口」）。 */
export function gateAStandardCloseoutBlockquotes() {
  return [
    '> **全案收尾與證據留痕**：見 **`docs/go-live-checklist.md`** 開首 **全案收尾與證據留痕**（**`README.md`**「專案收尾」、**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））。',
    '> **收證指令／旗標細部**：**`docs/gate-a-status-2026-05-06.md`** **§5**、**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`**；**人工／strict-http／keep=1**：**`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（**`docs/go-live-checklist.md`** §0.1）。',
  ]
}

/** `docs/evidence/gate-a-latest.md` 專用之頁尾：固定入口＋標準雙行＋ stdout 維護一行。 */
export function gateALatestMarkdownFooterLines() {
  return [
    '> 此檔為固定入口，便於在文件／群組貼單一連結。',
    ...gateAStandardCloseoutBlockquotes(),
    '> **終端 stdout 頁尾（維護）**：多數 **`gatea:evidence:*`** **`scripts/gate-a-markdown-footer.mjs`**（檔首 **Export 契約**）；**`README.md`**「Gate A 終端頁尾（維護）」列並讀。',
  ]
}

/** 自動引用區塊末行（compact；與上列 blockquotes 同鏈，供 `gate-a-ref-sync-lib`）。 */
export function gateAAutoRefClosingHintLine() {
  return '- **全案收尾與指令速查**：`docs/go-live-checklist.md`（開首長鏈）；`docs/gate-a-status-2026-05-06.md` **§5**／`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`；人工／strict-http／keep=1：`docs/gate-a-manual-evidence-checklist-2026-05-06.md` 開首。'
}
