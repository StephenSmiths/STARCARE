# STARCARE 功能清單（Feature List）

> **維護方式**：本清單由 **程式路由、`src/features/`、Supabase Edge Functions** 反推而成；與《STARCARE 智能院舍照護管理系統》PDF／`business-logic.md`（若存在）對照後，請補上 **SOP 章節** 欄並視需要調整 **狀態**。  
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
| CORE-05 | 設計約束（uiTokens） | 表單／按鈕／卡片樣式一致 | `src/features/shared/ui/uiTokens.ts` | — | 部分 | 排班子元件尚未全面套用 |

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
| SCH-10 | 儲存排班結果 | 將結果寫入 DB | `SchedulingSavePanel` | `schedule-assignments-batch` | 已完成 | `scheduling_history`、`actor_id` 見 go-live 清單 |
| SCH-11 | 排班規則讀取 | 演算法使用正確參數 | （隱藏於載入流程） | `scheduling-rules-get` | 已完成 | — |
| SCH-12 | 活動／時段設定讀取 | 排班有正確時段與活動 | 載入流程 | `scheduling-sessions-list`、`activities-list` | 已完成 | — |

---

## 3. 院友管理（`#residents`）

| 編號 | 功能名稱 | 使用者目標 | UI／入口 | 後端／API | 狀態 | 備註 |
|------|------------|------------|----------|-----------|------|------|
| RES-01 | 院友資料概覽 | 快速看總數、SC、認知、甲一買位 | `ResidentsOverviewPanel` | 前端聚合 `residents` | 已完成 | — |
| RES-02 | 院友 CSV 批量匯入 | 大量建檔、預檢、確認寫入 | `ResidentsImportPanel` | `residents-import-validate`、`residents-import-commit` | 已完成 | 範本 `/residents-import-template.csv` |
| RES-03 | 新增／編輯單一院友 | 逐筆維護 SOP 欄位 | `ResponsiveFormSheet` + `ResidentsSingleResidentForm` | `residents-create`、`residents-update` | 已完成 | 桌機 Drawer／手機全螢幕 |
| RES-04 | 院友名單與篩選 | 搜尋、資助類別、分頁 | `ResidentsListPanel` | `residents-list` | 已完成 | — |
| RES-05 | 院友軟刪除 | 名單不打掉資料、標記刪除 | 名單「軟刪除」 | `residents-soft-delete` | 已完成 | 符合軟刪除政策 |
| RES-06 | 審計紀錄（前端顯示） | 最近變更可追溯 | 儀表板底部摘要 | `residentService.listAuditTrail()`（靜態／或接後端） | 部分 | 請對照實際 Audit 資料來源與 SOP |

---

## 4. 員工管理（`#staff-import`）

| 編號 | 功能名稱 | 使用者目標 | UI／入口 | 後端／API | 狀態 | 備註 |
|------|------------|------------|----------|-----------|------|------|
| STF-01 | 員工資料概覽 | 掌握可排時段數／技能數 | `StaffOverviewPanel` | `scheduling-sessions-list` + `staff-skills-list` 聚合 | 已完成 | `staffManagementService` |
| STF-02 | 員工 CSV 批量匯入 | 預檢、確認寫入 | `StaffImportPanel` | `staff-import-validate`、`staff-import-commit` | 已完成 | 範本 `/staff-import-template.csv` |

---

## 5. 活動時段匯入（`#activity-sessions-import`）

| 編號 | 功能名稱 | 使用者目標 | UI／入口 | 後端／API | 狀態 | 備註 |
|------|------------|------------|----------|-----------|------|------|
| ACT-01 | 活動時段 CSV 匯入 | 預檢、確認寫入活動時段 | `ActivitySessionImportPanel` | `activity-sessions-import-validate`、`activity-sessions-import-commit` | 已完成 | 範本 `/activity-sessions-import-template.csv` |
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

下列為 `package.json`／部署腳本中出現之 **Edge Functions**（供與上表核對；**不作為業務功能編號**）。

| Function | 關聯功能編號（示例） |
|-----------|----------------------|
| `residents-list` / `residents-get` / `residents-create` / `residents-update` / `residents-soft-delete` | RES-04～RES-05、RES-03 |
| `residents-import-validate` / `residents-import-commit` | RES-02 |
| `staff-import-validate` / `staff-import-commit` | STF-02 |
| `staff-skills-list` | STF-01 |
| `schedule-assignments-batch` | SCH-10 |
| `scheduling-sessions-list` / `scheduling-rules-get` / `activities-list` | SCH-11、SCH-12、STF-01 |
| `scheduling-kpi-history-list` / `upsert` / `clear` | SCH-05 |
| `activity-sessions-list` | ACT-02 |
| `activity-sessions-import-validate` / `activity-sessions-import-commit` | ACT-01 |
| `_shared/requireStaffUser` 等 | CORE-01 授權鏈 | 

---

## 8. 建議後續補強（非功能清單本體）

1. **SOP 欄**：與 PDF／`business-logic.md` 對照後，於各列補 **章節編號**。  
2. **RES-06**：確認審計資料是否已接 Edge／DB，再改狀態為 `已完成`。  
3. **README**：可連結本檔作為產品功能入口（避免 README 仍為 Vite 範本）。  
4. **Release**：版本發佈時更新「狀態」與「未開始」列，避免與銷售／驗收口徑漂移。

---

*文件產生：依倉庫 `src/`、`supabase/functions/` 與 `docs/go-live-checklist.md` 整理；若與實機行為不符，以程式與 DB 為準。*
