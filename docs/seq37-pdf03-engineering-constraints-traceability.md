# Seq 37：工程約束收斂（閉環／SRP／200 行等）對照骨架

> **對照**：母本 **03** 工程規範；**`docs/pdf03-cursorrules-alignment.md`** **§3**（PR 檢核表）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **37**；P0 **`docs/pdf-alignment-p0-backlog.md`** C 區。  
> **上一序號**：**`docs/seq36-adr0001-scheduling-logic-placement-traceability.md`**。  
> **用途**：將 **新模組閉環、SRP、單檔行數、CI／E2E／Edge 部署連動** 與 **既有碼漸進收斂** 對表；標示 **里程碑或豁免清單** 待治理／客戶簽核。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

---

## 1. 檢核入口（§3 摘要）

| 主題 | 指引位置 |
|------|----------|
| PR 檢核 | **`pdf03-cursorrules-alignment.md`** §3（**`build:demo`**、**`.env.example`**、**`ops:deploy:all`**、**`feature-list.md`** 等） |
| 依賴治理 | **`.github/dependabot.yml`**（npm 週一、上限等，見主檔 Seq 37 敘述） |

---

## 2. 與 Seq 36

- 排班權威變更時：§3 檢核須與 **`adr-0001`**／**Seq 36** 敘述一致。

---

## 3. 維護閉環

- 變更 **§3 檢核表**或 **收斂里程碑**時：同步 **`pdf03`**、**`pdf-sequenced-gap-checklist.md`** Seq **37**、**`pdf-sequenced-gap-checklist-revision-log.md`**。
- **下一序號**：三 PDF 版次 **Seq 38** — **`docs/seq38-pdf-versions-traceability.md`**。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 37 **對照骨架**。 |
