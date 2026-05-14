# ADR-0001：排班演算放置層級（前端 vs Edge／DB）

> **對照**：運維與文件總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）；PDF `03`／PR 檢核 **`docs/pdf03-cursorrules-alignment.md`**；序號 **`docs/pdf-sequenced-gap-checklist.md`**（Seq **36**；主檔「**運維與工程**」列與 **§0**／**`README`** 對齊）；對照骨架 **`docs/seq36-adr0001-scheduling-logic-placement-traceability.md`**。

**全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（第二行併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（strict-http／keep=1；**`docs/go-live-checklist.md`** §0.1）。

**狀態**：已採納（與客戶溝通前之工程預設）  
**日期**：2026-05-01  
**範圍**：Seq 36（`03` 工程規範 × `01` §3 排班）  
**母本**：`docs/pdf/03-STARCARE-工程規範-Closed-Loop.pdf`（複雜邏輯優先 Edge／DB）、`docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf` §3

## 情境

現況已有 **`schedulingService`（前端 TypeScript）** 執行 Pass 1–3 與約束；同時專案規範要求 **複雜業務邏輯優先放 Edge Function 或 PostgreSQL**。

## 決策

1. **短期（MVP／演示／離線乾跑）**  
   - 保留 **前端排班引擎** 作為 **試算與 UI 即時回饋** 的單一來源。  
   - **復康活動追蹤**、**智能排班預覽**、**系統設定時段過濾** 等皆呼叫同一套前端服務，避免雙軌不一致。

2. **中期（上線院舍）**  
   - 以 **Edge Function 或 DB function** 實作 **權威排班結果**（含審計、鎖定、重入保護）。  
   - 前端改為 **呼叫後端試算／正式跑** API，或僅保留 **輕量預覽** 與後端結果對齊測試。

3. **長期**  
   - 前端僅剩 **展示、參數編輯、例外人工調整**；Pass 與 01 §3.1–3.3 數值以 **後端版本** 為準。

## 後果

- **優點**：迭代快、易寫單元測試、與現有 `npm run dev` 流程一致。  
- **風險**：前後端兩套邏輯若並存，須 **對照測試矩陣** 防漂移；遷移時需凍結行為再搬運。

## 與 Seq 29 的關係

`schedulingSessionWindowFilterService` 為 **引擎輸入過濾**；未來若後端接管，應在 **同一層級**（Edge 入參或 DB view）複製規則，並以 **契約測試** 對齊前端舊行為。  
**院舍政策版本化**（多表＋`effective_from`）之 Edge 契約見 **`docs/scheduling-policy-edge-function-contract.md`**；與 **`scheduling-rules-get`** 合併／遷移策略見 **`docs/system-settings-policy-prd-2026-05-09.md`** §7。  
**附註（2026-05-09）**：已依 PRD §7 **路徑 B** 於 **`scheduling-rules-get`** 合併 **P1** **`group_participant_cap` → `groupCapacityLimit`**（生效版本存在時）；並合併 **`enableSubsidizedRehab`**（資助階子表有列時）、**`enableDementiaCare`**（認知核心有列時）、**`allowScTherapistOnly`**（legacy **OR** 子表 **specialCareTherapistOnly**）；**`therapistGroupSessionsDailyCap`**／**`assistantGroupSessionsDailyCap`** 取自 **`numericLimits`**（**`scheduling_rules`** 無對應欄）。**`dailySameServiceLimit`** 等其餘扁平欄仍 **`scheduling_rules`**，見契約開首 **既有讀規則**。

---

## 相關文件
- 序號對照：**`docs/pdf-sequenced-gap-checklist.md`**（Seq **36**）。  
- 工程規範 PR 檢核：**`docs/pdf03-cursorrules-alignment.md`** §3。  
- 專案入口：**`README.md`**（文件表）；前端 **`npm run ci`**／E2E 見 **`docs/feature-list.md`** §8；分階 **`acceptance:*`** 與全閘對照見 **`docs/phase4-day4-delivery-index.md`**、**`docs/phase5-day1-delivery-index.md`**。
