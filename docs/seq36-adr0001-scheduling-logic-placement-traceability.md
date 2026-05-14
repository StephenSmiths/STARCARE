# Seq 36：排班邏輯權威 ADR（03＋01）對照骨架

> **對照**：母本 **03**（複雜邏輯放置）與 **01**（領域鐵律）；ADR **`docs/adr-0001-scheduling-logic-placement.md`**；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **36**；P0 **`docs/pdf-alignment-p0-backlog.md`** C 區。  
> **上一序號**：**`docs/seq35-pdf03-cursorrules-alignment-traceability.md`**。  
> **用途**：將 **「Edge／DB 優先 vs 現行前端排班 MVP」** 與客戶 **書面確認／豁免** 對表。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（第二行併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（strict-http／keep=1；**`docs/go-live-checklist.md`** §0.1）。

---

## 1. ADR 要點（摘要）

| 主題 | 說明 |
|------|------|
| 現狀 | MVP 以前端排班為權威之過渡 |
| 目標 | 上線後複雜邏輯以 **Edge／DB** 為權威之遷移原則 |
| 與母本 | 需與 **03**、**01** 無 **未解衝突**（或 **書面豁免**） |

---

## 2. 與其他 Seq 關係

| Seq | 關聯 |
|-----|------|
| **Seq 15** | 排班 UI／引擎實作路徑 |
| **Seq 35** | **03** 矩陣與 **`.cursorrules`**；ADR 列於 **`pdf03`** 與 **`README`** 文件表 |

---

## 3. 維護閉環

- 變更 **ADR 狀態**、**遷移里程碑**或 **與 01 條文對照**時：同步 **`pdf03-cursorrules-alignment.md`**（若有矩陣列）、**`pdf-sequenced-gap-checklist.md`** Seq **36**、**`pdf-sequenced-gap-checklist-revision-log.md`**。
- **下一序號**：工程約束收斂 **Seq 37** — **`docs/seq37-pdf03-engineering-constraints-traceability.md`**。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 36 **對照骨架**。 |
