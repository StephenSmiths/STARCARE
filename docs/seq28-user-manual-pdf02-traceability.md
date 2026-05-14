# Seq 28：用戶手冊（PDF 02【15】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【15】**；條文整理 **`docs/business-logic.md`** §0 文件入口；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **28**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **28**。  
> **上一序號**：**`docs/seq27-notification-center-pdf02-traceability.md`**（通知中心【14】）。  
> **用途**：將 **站內骨架頁、章節結構、E2E 錨點** 與母本「用戶手冊」對表；標示 **正式圖文版、角色分章** 交付缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（第二行併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（strict-http／keep=1；**`docs/go-live-checklist.md`** §0.1）。

---

## 1. 畫面與內容來源

| 項目 | 程式錨點 | 說明 |
|------|----------|------|
| 頁殼 | **`UserManualHome`** | 靜態 **`manualSections`**：**快速上手**、**閉環流程建議**、**文件參考**（`business-logic.md`、`pdf-sequenced-gap-checklist.md`、`rbac-seq1-verification-checklist.md` 等路徑字串）。 |
| 說明文案 | 首段 **`moduleDescription`** | 提示可再補圖文、角色分章、FAQ。 |

**路由**：`view:user-manual`、**`#user-manual`**。

---

## 2. 與審計／通知

- 本頁**無** **`AuditTrailPanel`**（**`e2e/smoke.spec.ts`** 註解：手冊 hash 另測、不含審計區）。

---

## 3. 自動化測試（E2E）

| 測試檔 | 斷言 |
|--------|------|
| **`e2e/smoke.spec.ts`** | **`/#user-manual`**、`heading` **用戶手冊**、**快速上手** |
| **`e2e/auth-login.staff-modules.spec.ts`** | 登入後 **`/#user-manual`** |
| **`e2e/list-section-collapse.spec.ts`** | **`#user-manual`**：先待模組 **`heading` 用戶手冊**（與 smoke 一致），再測 **快速上手** **`ListSectionPanel`** 收合／展開與內文可見 |

---

## 4. 維護閉環

- 變更 **側欄分組說明**、**閉環流程文案**、**文件參考路徑**或 **`UserManualHome`** 章節標題／**`ListSectionPanel`** 預設收合時：同步本檔、**`e2e/list-section-collapse.spec.ts`**（**`#user-manual`**）、**`pdf-sequenced-gap-checklist.md`** Seq 28、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）；並核 **`README.md`**／**`feature-list.md`** 文件表是否需同句更新。
- **下一序號**：系統設定 **Seq 29**（02【16】）— **`docs/seq29-system-settings-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 28 **對照骨架**；與 Seq 27 互鏈。 |
| 2026-05-04 | §4「下一序號」：與 **`seq29-system-settings-pdf02-traceability.md`** 互鏈（舊稿曾誤標 §6）。 |
| 2026-05-09 | §3／§4：**`list-section-collapse`** 與 **`#user-manual`** E2E 錨點及維護句（lazy 載入後再斷言）；**`pdf-sequenced-gap-checklist.md`** 主表 Seq 28 列補 E2E；**Seq 29** 入鏈 **`seq28`** 之節號自誤植 **§6** 更正為 **§4**（主修訂日誌、**`pdf-alignment-p0-backlog`**）。 |
