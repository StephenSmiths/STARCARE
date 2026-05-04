# STARCARE 功能清單（Feature List）

> **維護方式**：本清單由 **程式路由、`src/features/`、Supabase Edge Functions** 反推而成；與《STARCARE 智能院舍照護管理系統》PDF／**`docs/business-logic.md`**（**§0** 為運維與 **`.cursorrules`** §3 入口）、**`docs/pdf-sequenced-gap-checklist.md`**（主檔「**運維與工程**」列與 **§0**／**`README`** 對齊）對照後，請補上 **SOP 章節** 欄並視需要調整 **狀態**。  
> **狀態定義**：`已完成`＝可於 UI 完成閉環；`部分`＝有介面或 API 但缺驗收／缺文件對照；`未開始`＝未見於主程式流程。

---

## 狀態圖例

| 標記 | 意義 |
|------|------|
| 已完成 | 主流程可用 |
| 部分 | 實作中、僅後端、或待與 SOP 對齊 |
| 未開始 | 尚未納入目前程式 |

---

## 1. 跨模組／基礎建設

| 編號 | 功能名稱 | 使用者目標 | UI／入口 | 後端／API | 狀態 | 備註 |
|------|------------|------------|----------|-----------|------|------|
| CORE-01 | Supabase Auth 登入／登出 | 以院方帳號進入系統 | `SignInScreen`、側欄「登出」 | Supabase Auth | 已完成 | 閉環見 `docs/go-live-checklist.md` |
| CORE-02 | 工作階段載入 | 知道系統是否已連線 Auth | 全螢幕「載入工作階段…」 | — | 已完成 | — |
| CORE-03 | 應用程式版面（Layout + Page Shell） | 各模組標題與導覽一致 | `SchedulingAppLayout`、`PageShell`、`SchedulingSidebar`（hash 路由） | — | 已完成 | `#scheduling` `#residents` `#staff-import` `#activity-sessions-import` |
| CORE-04 | 小螢幕側欄 | 手機可開合選單 | 頂欄「選單／收合」、抽屜側欄、backdrop | — | 已完成 | — |
| CORE-05 | 設計約束（uiTokens） | 表單／按鈕／卡片樣式一致 | `uiTokens.ts`（**`base`**、**`extended`**、**`extendedComposites`**、**`schedulingSurfaces`**） | — | 已完成 | **`src/**/*.tsx`** 已統一走 **`uiTokens`**；**`className="…"`** 裸字串與 **`className={…}`** 內 Tailwind 字面量已清；token 檔維持 **單檔 ≤200 行**；**新增模組**時須沿用既有 token 或補檔（持續維護項） |

---

## 2. 智能排班（`#scheduling`）

| 編號 | 功能名稱 | 使用者目標 | UI／入口 | 後端／API | 狀態 | 備註 |
|------|------------|------------|----------|-----------|------|------|
| SCH-01 | 載入院友與可排時段 | 排班前資料齊備 | `SchedulingDashboard` 載入 | `residents-list`、排班設定相關 API | 已完成 | 錯誤時見 `SchedulingDataAlerts` |
| SCH-02 | 啟動智能排班 | 一鍵產生指派與衝突檢視 | `SchedulingToolbar` | 前端 `schedulingService`（規則取自 `scheduling-rules-get` 等） | 已完成 | Pass 結果於表格／指派區 |
| SCH-03 | 排班統計卡 | 快速看總量與合規概況 | `SchedulingStatsCards` | 衍生自本地計算 | 已完成 | — |
| SCH-04 | 排班 KPI 快照 | 評估本次排班品質 | `SchedulingKpiCards` | 本地計算＋可寫入 KPI 歷程 | 已完成 | 與 SCH-05 連動 |
| SCH-05 | KPI 趨勢／歷程 | 檢視多次排班 KPI、篩選、匯出 | `SchedulingKpiTrendPanel`、`SchedulingKpiTrendFilterBar` | `scheduling-kpi-history-list`、`upsert`、`clear` | 已完成 | 含重試同步狀態 |
| SCH-06 | 合規週報 CSV | 下載週合規報表 | `SchedulingReportBar` | `downloadWeeklyComplianceCsv`（前端組檔） | 已完成 | — |
| SCH-07 | 院友排班表格 | 檢視每人指派與缺口 | `SchedulingResidentTable` | 與 SCH-02 同一視界模型 | 已完成 | — |
| SCH-08 | 本次排班指派列表 | 檢視 session 層級指派 | 儀表板內卡片 | 同上 | 已完成 | — |
| SCH-09 | 衝突列表 | 知悉不可儲存之衝突 | `SchedulingConflictsPanel` | 同上 | 已完成 | — |
| SCH-10 | 儲存排班結果 | 將結果寫入 DB | `SchedulingSavePanel`、`SchedulingHistoryUndoPanel` | `schedule-assignments-batch`、`scheduling-history-soft-delete`（批次軟刪） | 已完成 | `scheduling_history` **SELECT RLS**（`20260502120000_scheduling_history_select_rls`）、`actor_id` 見 go-live 清單 |
| SCH-11 | 排班規則讀取 | 演算法使用正確參數 | （隱藏於載入流程） | `scheduling-rules-get` | 已完成 | — |
| SCH-12 | 活動／時段設定讀取 | 排班有正確時段與活動 | 載入流程 | `scheduling-sessions-list`、`activities-list` | 已完成 | — |

---

## 3. 院友管理（`#residents`）

| 編號 | 功能名稱 | 使用者目標 | UI／入口 | 後端／API | 狀態 | 備註 |
|------|------------|------------|----------|-----------|------|------|
| RES-01 | 院友資料概覽 | 快速看總數、SC、認知、甲一買位 | `ResidentsOverviewPanel` | 前端聚合 `residents` | 已完成 | — |
| RES-02 | 院友 CSV 批量匯入 | 大量建檔、預檢、確認寫入 | `ResidentsImportPanel` | `residents-import-validate`、`residents-import-commit`（**`guardTeamLeadOrAdmin`**） | 已完成 | 範本 `/residents-import-template.csv`（可選 **`assessmentNextDueDate`**，§4.3） |
| RES-03 | 新增／編輯單一院友 | 逐筆維護 SOP 欄位 | `ResponsiveFormSheet` + `ResidentsSingleResidentForm` | `residents-create`、`residents-update`（**`guardTeamLeadOrAdmin`**） | 已完成 | 桌機 Drawer／手機全螢幕 |
| RES-04 | 院友名單與篩選 | 搜尋、資助類別、分頁 | `ResidentsListPanel`、`ResidentsDashboard` 匯出 | `residents-list`；匯出見 `residentsExportCsvService`（含下次評估到期日；末三欄機讀代碼對齊匯入範本） | 已完成 | — |
| RES-05 | 院友軟刪除 | 名單不打掉資料、標記刪除 | 名單「軟刪除」 | `residents-soft-delete`（**`guardTeamLeadOrAdmin`**） | 已完成 | 符合軟刪除政策 |
| RES-06 | 審計紀錄（前端顯示） | 最近變更可追溯 | `DashboardHome` 底部、`AuditTrailPanel`（多模組） | `globalAuditTrailService`＋`useAuditTrailList`；落庫 `audit-trail-append`、登入拉取 `audit-trail-list` 合併（Seq 12） | 部分 | 待正式庫抽測（步驟見 **`docs/go-live-checklist.md`** §8） |

---

## 4. 員工管理（`#staff-import`）

| 編號 | 功能名稱 | 使用者目標 | UI／入口 | 後端／API | 狀態 | 備註 |
|------|------------|------------|----------|-----------|------|------|
| STF-01 | 員工資料概覽 | 掌握可排時段數／技能數；TeamLead／Admin 單筆編主檔 | `StaffOverviewPanel`、`StaffProfileEditSheet` | `scheduling-sessions-list` + `staff-skills-list` + **`staff-profiles-list`**；**`staff-profile-update`** | 已完成 | `staffManagementService` |
| STF-02 | 員工 CSV 批量匯入 | 預檢、確認寫入 | `StaffImportPanel` | `staff-import-validate`、`staff-import-commit`（Edge **`guardTeamLeadOrAdmin`**） | 已完成 | 範本 `/staff-import-template.csv` |

---

## 5. 活動時段匯入（`#activity-sessions-import`）

| 編號 | 功能名稱 | 使用者目標 | UI／入口 | 後端／API | 狀態 | 備註 |
|------|------------|------------|----------|-----------|------|------|
| ACT-01 | 活動時段 CSV 匯入 | 預檢、確認寫入活動時段 | `ActivitySessionImportPanel` | `activity-sessions-import-validate`、`activity-sessions-import-commit`（**`guardTeamLeadOrAdmin`**） | 已完成 | 範本 `/activity-sessions-import-template.csv` |
| ACT-02 | 活動時段列表（供他處使用） | 排班／匯入讀到一致資料 | （排班載入等） | `activity-sessions-list` | 已完成 | 與 SCH 連動 |

---

## 6. 共用元件（跨功能）

| 編號 | 功能名稱 | 使用者目標 | UI／入口 | 後端／API | 狀態 | 備註 |
|------|------------|------------|----------|-----------|------|------|
| SHR-01 | 匯入執行摘要卡 | 看懂最近一次匯入結果 | `ImportRunSummaryCard` | 由各 import hook 提供 | 已完成 | — |
| SHR-02 | 匯入歷程列表 | 追溯多次匯入 | `ImportRunHistoryList` | 同上 | 已完成 | — |
| SHR-03 | 響應式表單層 | 長表單不占主版面 | `ResponsiveFormSheet` | — | 已完成 | — |

---

## 7. Edge Functions 對照（技術索引）

下列為 **`supabase/functions/`** 已實作、且與 **`package.json`** 之 **`ops:deploy:all`** 列舉一致之 **Edge Functions**（供與上表核對；**不作為業務功能編號**）。**遠端一鍵部署**以 **`npm run ops:deploy:all`** 為準（步驟見 **`docs/supabase-deploy-runbook.md`** §2）；若新增 Edge，務必同步擴充 **`ops:deploy:all`** 與本表。

| Function | 關聯功能編號（示例） |
|-----------|----------------------|
| `residents-list` / `residents-get`（Staff 可讀）／`residents-create`／`residents-update`／`residents-soft-delete`（寫入：**`guardTeamLeadOrAdmin`**；契約見 **`docs/residents-edge-function-contract.md`**） | RES-04～RES-05、RES-03 |
| `residents-import-validate` / `residents-import-commit`（契約同上） | RES-02 |
| `staff-import-validate` / `staff-import-commit` | STF-02 |
| `staff-soft-delete` | STF-01、STF-02（連動 skills／sessions 等） |
| `staff-skills-list` | STF-01 |
| `staff-profiles-list` | STF-01、Seq 13（儀表盤 PT/OT 讀 `role_type`；`service_scope`） |
| `staff-profile-update` | Seq 26（TeamLead／Admin 單筆主檔） |
| `schedule-assignments-batch`／`scheduling-history-soft-delete` | SCH-10（Seq 10 批次軟刪） |
| `scheduling-sessions-list` / `scheduling-rules-get` / `activities-list` | SCH-11、SCH-12、STF-01 |
| `scheduling-kpi-history-list` / `scheduling-kpi-history-upsert` / `scheduling-kpi-history-clear` | SCH-05 |
| `assessment-due-list` / `assessment-completion-records-list` / `assessment-completion-records-append`（審計見 **`docs/assessment-completion-records-contract.md`**） | Seq 9（§4.3 待辦）／Seq 22（評估完成紀錄讀寫） |
| `activity-sessions-list` | ACT-02 |
| `activity-sessions-import-validate` / `activity-sessions-import-commit`；`activity-sessions-soft-delete`（寫入：**`guardTeamLeadOrAdmin`**） | ACT-01、活動時段手動軟刪 |
| `service-forms-list`（`approvedOnly=1` 僅 APPROVED）／`service-forms-upsert`／`service-forms-soft-delete`；DB `service_forms` **SELECT RLS**（`20260502103000_service_forms_rls`） | Seq 3／10／17／23 |
| `audit-trail-append` / `audit-trail-list` | RES-06、Seq 12 |
| `_shared/requireStaffUser` 等 | CORE-01 授權鏈 | 

---

## 8. 建議後續補強（非功能清單本體）

1. **SOP 欄**：與 PDF／**`docs/business-logic.md`**（**§0**；運維與 **`.cursorrules`** §3 入口）對照後，於各列補 **章節編號**。  
2. **RES-06**：審計已落庫並於登入後經 `audit-trail-list` 合併；待實庫抽測後再改為 `已完成`（抽測勾選項見 **`docs/go-live-checklist.md`** §8）。  
3. **README**：已改為 STARCARE 專案入口（開頭短文含 **`.cursorrules`** §3／**`business-logic.md`** §0／**`pdf-sequenced-gap-checklist.md`** 主檔「**運維與工程**」一句，並註明 **`phase*.md`**／**`stage*.md`** 開首 **對照** 互鏈該列；文件表含 **`pdf-alignment-p0-backlog`**、**`business-logic`**（**§0** 含 **`.cursorrules`** §3 連動說明）、**`adr-0001-scheduling-logic-placement`**、**`residents-edge-function-contract`**、**`assessment-completion-records-contract`**、**`client-delivery-remediation-plan`**（內部入口與 **§2** 補 **`pdf-sequenced`**「**運維與工程**」）、**`phase4-day4-delivery-index`**／**`phase5-day1-delivery-index`**、**`stage2-*`**／**`stage3-*`** 歷史追溯列、**`pdf03-cursorrules-alignment`**（**Seq 35～38** 對照骨架 **`seq35-pdf03-cursorrules-alignment-traceability`**～**`seq38-pdf-versions-traceability`**；**`pdf-sequenced-gap-checklist.md`** C 區）、憑證清單（**§D** 可選 **`npm run ci`**）、runbook；**`pdf-sequenced-gap-checklist.md`** 列敘與 §0／**§3**／**`README`** 對齊；常用指令區含 **CI**、**憑證與部署後自檢（§D）** 短文；**`.cursorrules`** §3 與 **`business-logic.md`** §0 運維列連動；範本長文已收斂為選讀連結。  
4. **Release**：版本發佈時更新「狀態」與「未開始」列，避免與銷售／驗收口徑漂移。  
5. **Playwright 煙霧**（與 `docs/pdf-sequenced-gap-checklist.md` Seq 3 對照）：`e2e/smoke.spec.ts` 於 demo（`webServer` 清空 `VITE_SUPABASE_*`）下覆蓋 `src/app/viewRouting.ts` 之 **全部** `ViewId`（`#dashboard` 首屏含 **全域審計摘要**；其餘路由以 `HASH_AUDIT_CASES` 資料表驅動：模組標題與審計區，或手冊「快速上手」）；**表單狀態**見 `e2e/service-forms-state.spec.ts`、`e2e/service-forms-readonly.spec.ts`＋`e2e/helpers/serviceFormsDemo.ts`（種子：`goto`→`evaluate`→`reload`；含草稿、**提交待審**、**不可自審**（核准與退回）、核准、退回 UI、退回後再儲、**SUBMITTED 軟刪除**、**已核准／已提交檢視鎖定**）；本機有 `.env` 之 Supabase 時須先 **`npm run build:demo`** 再 **`PW_PREVIEW_ONLY=1 npm run test:e2e`**，或使用 **`npm run test:e2e:smoke`**／**`npm run ci`** 一鍵。  
6. **Playwright 可選登入**：`playwright.auth.config.ts`＋`e2e/auth-login.spec.ts`＋`e2e/auth-login.staff-modules.spec.ts`＋`e2e/helpers/authLogin.ts`，`npm run test:e2e:auth`（建置保留 `VITE_SUPABASE_*`；需 `E2E_AUTH_EMAIL`／`E2E_AUTH_PASSWORD`，見 `.env.example`；未設則 skip）；斷言含側欄 **`#app-sidebar-nav`**、**「登出」**，以及登入後 **`/#service-forms`**（模組標題、**填寫服務表單（Staff）**／**待審服務表單**、審計區；排除 **無法載入時段或院友資料**）、**`/#work-session-plans`**（**我的工作計劃**、**工作節與計劃審計**；排除 **無法載入工作計劃時段，請稍後重試。**）、**`/#residents`**（**院友資料概覽**、**最近審計紀錄**；排除 **無法載入院友名單，請稍後重試。**）、**`/#scheduling`**（**本次排班指派**、**排班與相關操作審計**；排除 **無法連線載入院友或時段資料，請檢查網路與 API 設定。**）、**`/#notification-center`**（**未讀通知**、**審計紀錄節錄**）、**`/#historical-documents`**（**母本要求僅展示**、**匯出審計**）、**`#shift-start-handover`**／**`#shift-end-handover`**／**`#rehab-activity-tracking`**／**`#assessment-management`**／**`#user-manual`**（各模組標題與頁內關鍵標題／審計或「快速上手」；預設 Staff 帳不含工作分析／系統設定）（與 `docs/go-live-checklist.md` §1.1 對照）。  
7. **CI**：`.github/workflows/ci.yml` 於 push（`main`／`master`／`develop`）／PR 跑 `lint`、**`npm run typecheck`**（`tsc -b --noEmit`）、`vitest`、**`npm run build:demo`**（清空 `VITE_SUPABASE_*` 之 demo bundle）、`test:e2e`（`PW_PREVIEW_ONLY=1` 時 webServer 僅 `preview`；含 **`actions/cache`** 快取 `~/.cache/ms-playwright`、`npx playwright install --with-deps chromium`、`concurrency`）；檔首註解標明與 **`npm run ci`** 分步等同並含 **`business-logic.md`** §0／**`README`**／**`pdf-sequenced-gap-checklist.md`**「**運維與工程**」等文件入口。本機一鍵 **`npm run ci`**（`lint`→`typecheck`→`test`→**`build:demo`**→`test:e2e`）；或 **`npm run test:e2e:all`** 連跑可選登入（無密鑰時 skip）。變更 CI／E2E 腳本時 PR 檢核見 **`docs/pdf03-cursorrules-alignment.md`** §3。  
8. **依賴治理**：`.github/dependabot.yml` 每週一掃描根目錄 **npm**（與 `docs/pdf-sequenced-gap-checklist.md` Seq 37 對照）。

---

*文件產生：依倉庫 `src/`、`supabase/functions/`、`docs/go-live-checklist.md`、`docs/supabase-deploy-runbook.md`（§2 遠端部署、§6 前端 CI）與 `docs/security-token-rotation-checklist.md`（憑證；**§D** 可選 **`npm run ci`**）整理；**`acceptance:*`** 與 **`npm run ci`** 對照另見 **`docs/phase4-day4-delivery-index.md`**、**`docs/phase5-day1-delivery-index.md`**；專案根 **`.cursorrules`** §3 見 **`docs/business-logic.md`** §0；**`business-logic.md`** **§8** 修訂全文見 **`docs/business-logic-revision-log.md`**；序號清單主檔「**運維與工程**」見 **`docs/pdf-sequenced-gap-checklist.md`**（修訂日誌 **`docs/pdf-sequenced-gap-checklist-revision-log.md`**）；**`docs/phase*.md`**／**`stage*.md`** 開首 **對照** 互鏈該主檔「**運維與工程**」列（見 **§8** README 項）；Stage 2／Phase 3 歷史追溯見 **`docs/stage2-completion-report.md`** 等（**`business-logic.md`** §0 已列路徑）。若與實機行為不符，以程式與 DB 為準。*
