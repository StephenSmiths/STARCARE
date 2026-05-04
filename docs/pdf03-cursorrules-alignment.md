# PDF `03` 工程規範 × `.cursorrules` 對齊（Seq 35、37）

> **Seq 35**：與 `.cursorrules` 並讀；若與客戶簽核 PDF 衝突，**以 PDF 為準**。  
> **Seq 37**：新模組工程約束（閉環、SRP、200 行、Repository）之 **Code review 檢核表**。

**母本**：`docs/pdf/03-STARCARE-工程規範-Closed-Loop.pdf`  
**內部規範**：專案根目錄 `.cursorrules`  
**與 `business-logic.md` §0**：**`.cursorrules`** §3「部署與驗收閘門」入口見 **`docs/business-logic.md`** §0；變更 **`.cursorrules`** 之同步責任見本文 **§4**。

---

## 1) 條目對照矩陣（摘要）

| 主題 | `.cursorrules` 摘要 | PDF `03` 方向（摘要） | 衝突時 |
|------|----------------------|------------------------|--------|
| 權威來源 | 指向 `docs/business-logic.md` 與 `docs/pdf/` | 客戶簽核文件 | **PDF＞rules 檔** |
| 邏輯放置 | Edge／DB 優先（複雜業務） | 閉環、可稽核 | **見 ADR-0001**（現允許前端試算） |
| 資料存取 | 前端禁直連 Supabase，走 Repository | 一致 | **遵守** |
| 軟刪除 | `is_deleted`／狀態標記 | 資料完整性 | **遵守** |
| 審計 | 關鍵狀態變更寫 Audit | 閉環 | **遵守** |
| 檔案大小 | 單檔 ≤200 行 | 模組化 | **新檔強制**；舊碼漸進 |

---

## 2) 已知「張力」與記錄位置

| 議題 | 說明 | 文件 |
|------|------|------|
| 排班演算在前端 | 與「複雜邏輯優先 Edge／DB」字面上張力 | `docs/adr-0001-scheduling-logic-placement.md` |

---

## 3) Seq 37 — 新模組 Code review 檢核表（PR 用）

審 PR 時勾選（新檔或新 `features/<name>/`）：

- [ ] **閉環**：Input → Logic → Output → 審計／錯誤提示是否可追？  
- [ ] **SRP**：UI 無業務演算；計算在 `Service`／`domain`／Edge。  
- [ ] **≤200 行**：單檔超標則拆分。  
- [ ] **Repository**：前端不直連 Supabase SDK（例外須註記 ADR）。  
- [ ] **軟刪**：無硬刪院友／業務主檔。  
- [ ] **防重複提交**：表單／儲存有 debounce 或鎖。  
- [ ] **註解**：業務邏輯註解標 **PDF 章節或 Seq**（繁中）。  
- [ ] **測試**：網域規則至少一則單元測試（若可測）。  
- [ ] **文件入口**：若變更 CI、E2E 或主要指令，同步 `README.md`（含 **`docs/phase4-day4-delivery-index.md`**／**`docs/phase5-day1-delivery-index.md`** 與 **`acceptance:*`**／**`npm run ci`** 對照列，及 **`docs/stage2-completion-report.md`** 等 **Stage 2／Phase 3** 歷史追溯列）、**`.env.example`**、`docs/feature-list.md` §8 或 `docs/pdf-sequenced-gap-checklist.md` 變更紀錄（與 Seq 3／37）；並視需要對照 **`docs/business-logic.md`** §0 與 **`.cursorrules`** §3「部署與驗收閘門」；**demo 煙霧**與 **`npm run ci`** 以 **`npm run build:demo`** 為準（**`playwright.auth.config.ts`** 可選登入 E2E 仍保留 **`VITE_*`** 建置者除外）。  
- [ ] **新 Edge Function**：新增 **`supabase/functions/<name>/`** 時，同步 **`package.json`** 之 **`ops:deploy:all`**、**`docs/feature-list.md` §7** 表格與 **`docs/pdf-sequenced-gap-checklist.md`** 日誌。  
- [ ] **排班權威層級（Seq 36）**：若變更「前端試算 vs 後端權威」策略或 **`adr-0001`** 狀態，同步 **`docs/adr-0001-scheduling-logic-placement.md`** 與 **`docs/pdf-sequenced-gap-checklist.md`** Seq 36「與現況對照」摘要。

---

## 4) 維護

- 客戶更新 `03` PDF 後：修訂本表「對照矩陣」與 `docs/business-logic.md` §0.1 指紋。  
- 若 `.cursorrules` 與本表衝突：以 **客戶簽核 PDF** 為準，並於本表註記日期與決策人。  
- 變更 **`.cursorrules`** 之 **§3 部署與驗收閘門**（runbook／憑證／**`npm run ci`**），或 **`docs/business-logic.md`** §0 **運維與索引列**（含分階交付、Stage 2／Phase 3 歷史追溯路徑）時，視需要同步 **`README.md`** 文件表與 **`docs/pdf-sequenced-gap-checklist.md`** 日誌及主檔「**運維與工程**」列（**`business-logic.md`** §0 為運維總覽權威）。  
- 變更 **Supabase 部署步驟**、**SQL 驗收**、**`ops:deploy:all` 列舉**、**PAT／憑證自檢**、**排班架構（`adr-0001`／Seq 36）**、**領域契約**（例：**`docs/residents-edge-function-contract.md`**、**`docs/assessment-completion-records-contract.md`**）或**前端 CI 煙霧（§6）**時，同步 **`docs/supabase-deploy-runbook.md`**、**`docs/security-token-rotation-checklist.md`**（若涉及 PAT／§D）、**`docs/adr-0001-scheduling-logic-placement.md`**（若涉及排班權威層級），並視需要更新 **`README.md`** 文件表（含 **`docs/phase4-day4-delivery-index.md`**／**`docs/phase5-day1-delivery-index.md`** 與 **`npm run ci`**／**`acceptance:*`** 對照）、**`docs/feature-list.md` §7** 與 **`docs/pdf-sequenced-gap-checklist.md`** 日誌。
