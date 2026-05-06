/**
 * Gate A 自動產物 Markdown 頁尾：與 go-live、README、status §5 互鏈（繁中）。
 * 供 `gate-a-update-latest-pointer`、doctor／report 等共用，避免字串發散與 refresh 後不一致。
 */

/** 全案收尾長鏈＋ status §5／commands-appendix（不含「此檔為固定入口」）。 */
export function gateAStandardCloseoutBlockquotes() {
  return [
    '> **全案收尾與證據留痕**：見 **`docs/go-live-checklist.md`** 開首 **全案收尾與證據留痕**（**`README.md`**「專案收尾」、**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））。',
    '> **收證指令／旗標細部**：**`docs/gate-a-status-2026-05-06.md`** **§5**、**`docs/gate-a-status-2026-05-06-commands-appendix.md`**。',
  ]
}

/** `docs/evidence/gate-a-latest.md` 專用之頁尾三行。 */
export function gateALatestMarkdownFooterLines() {
  return ['> 此檔為固定入口，便於在文件／群組貼單一連結。', ...gateAStandardCloseoutBlockquotes()]
}
