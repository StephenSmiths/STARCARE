# Seq 35：母本 03 與工程規範對照（`.cursorrules`／`pdf03`）骨架

> **對照**：客戶 PDF **`docs/pdf/03-STARCARE-工程規範-Closed-Loop.pdf`**（**03**）；條文整理與矩陣 **`docs/pdf03-cursorrules-alignment.md`**；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **35**；P0 **`docs/pdf-alignment-p0-backlog.md`** C 區。  
> **上一序號（02 鏈）**：**`docs/seq29-system-settings-pdf02-traceability.md`**（系統設定【16】）；**修訂表** **`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**。  
> **用途**：將 **「與 `.cursorrules` 並讀；衝突時簽核 PDF 優先」** 與 **換版差異重跑** 對表；供換版後填 **頁碼／差異表／簽核**。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。
> Gate A 人工證據與 **HTTP 嚴格取證**／**`npm run gatea:evidence:refresh:strict-http`**／**`--keep=1`**：**`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（**`docs/go-live-checklist.md`** §0.1）。

---

## 1. 權威文件與閉環

| 檔案 | 角色 |
|------|------|
| **`docs/pdf03-cursorrules-alignment.md`** | **03** 與 **`.cursorrules`** 對照矩陣；**§3** PR 檢核（含 **Seq 29【16】政策 validate／commit**）；**§4** **維護閉環**（含修訂日誌寫入 **`pdf-sequenced-gap-checklist-revision-log.md`**） |
| **`/.cursorrules`** | 專案工程鐵律（與 **03** 並讀；爭議以 **簽核 PDF** 為準） |

---

## 2. 驗收缺口（待簽核）

| 項目 | 現況 | 關閉對表條件 |
|------|------|--------------|
| PDF 換版 | 矩陣已建 | 客戶換版後 **重跑差異**並 **簽核** |
| 衝突裁定 | 敘述已定 | 若有 **03 vs 01** 未解議題，併入 **Seq 36** ADR 流程 |

---

## 3. 維護閉環

- **03** 或 **`.cursorrules`** 改版：先更新 **`pdf03-cursorrules-alignment.md`**，再寫 **`pdf-sequenced-gap-checklist-revision-log.md`**；並核 **本檔**、**`pdf-sequenced-gap-checklist.md`** Seq **35**。
- 變更 **`pdf03-cursorrules-alignment.md`** §3 **Seq 29【16】政策 validate／commit 與錯誤 UX** PR 檢核或 §4 **Seq 29** 維護句（**`schedulingPolicyRepository.*.test.ts`** 等）時：視需要核 **`docs/seq29-system-settings-pdf02-traceability.md`** §4／§5 與 **`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**（與 **上一序號（02 鏈）** 互鏈）。
- **下一序號**：排班邏輯權威 **Seq 36**（03＋01）— **`docs/seq36-adr0001-scheduling-logic-placement-traceability.md`**。

---

| 日期 | 說明 |
|------|------|
| 2026-05-09 | 人工段補 **`--keep=1`**；與 **`go-live-checklist.md`** §0.1、**`README`** 開首／專案收尾表、**`pdf-sequenced-gap-checklist.md`**「**全案收尾執行與證據留痕**」句對齊。 |
| 2026-05-09 | **§4**：**`gate-a-markdown-footer.mjs`** **`gateAStandardCloseoutBlockquotes`**／**`gateAAutoRefClosingHintLine`** 併 **人工勾選表**；**`pdf03`** §4 **Gate A** 維護項括註與 **`pdf-sequenced-gap-checklist-revision-log.md`** 同日列。 |
| 2026-05-09 | **人工表** 開首第二則 blockquote 與 **`gateAStandardCloseoutBlockquotes`** 第二行對齊；**`README`**「Gate A 終端頁尾」、**`.cursorrules`** §3 stdout 敘述同補。 |
| 2026-05-09 | **`gate-a-evidence-fill-template`**／**`gate-a-evidence-capture`** 開首互鏈與 stdout 句同上列 **人工表** 對齊。 |
| 2026-05-09 | **`commands-appendix`**：**inherit**／**`latest`**／**`docs-sync`**／**`decision-sync`** stdout 段與 **`decision-mini`** 括註對齊 **`gate-a-markdown-footer`**（**`gateAStandardCloseoutBlockquotes`**／**`gateAAutoRefClosingHintLine`**）；**`go-live`** §0.1、**`feature-list`** §8 第 25 點。 |
| 2026-05-09 | **`gate-a-status`** 主檔／**人工表**／**fill-template**／**`decision-draft`** 開首 stdout 句；**`decision-draft`** mini 標題；**`gate-a-evidence-all`**／**`gate-a-markdown-footer`** 註解。 |
| 2026-05-09 | **`business-logic.md`** §0 Gate A 段：stdout 維護句補 **`gateAStandardCloseoutBlockquotes`**（第二行併人工表鏈）；**`business-logic-revision-log.md`** 同日列。 |
| 2026-05-14 | 開首「全案收尾」長段後增一行：**Gate A 人工**／**`npm run gatea:evidence:refresh:strict-http`** 互鏈 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首與 **`docs/go-live-checklist.md`** §0.1。 |
| 2026-05-09 | **主表**：**`pdf-sequenced-gap-checklist.md`** §C Seq **35**「與現況對照」列補 **`pdf03`** **§3**／**§4** 與 **`seq35`** **§1**／**§3**／**`seq29`** 敘述；**`pdf-sequenced-gap-checklist-revision-log.md`** **註** 併 **§C** 括註。 |
| 2026-05-09 | §1：權威表 **`pdf03`** 列補 **§3** PR 檢核與 **§4** 維護閉環分述；**`seq29-system-settings-pdf02-traceability.md`** 開首 **CI** 句併 **本檔** §3。 |
| 2026-05-09 | §3：補 **pdf03** §3／§4 **Seq 29** 政策 **Vitest** PR 檢核與 **`seq29`** 主檔／修訂表互鏈（**02 鏈**→**03**）。 |
| 2026-05-04 | 初版：Seq 35 **對照骨架**；與 Seq 29（02 末序）互鏈。 |
