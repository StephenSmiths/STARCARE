# PDF 對齊：依序補回／缺漏檢核清單（Sequenced Checklist）

> **用途**：依 **客戶 PDF**（`docs/pdf/01…`、`02…`、`03…`）與現行程式對照，列出**建議執行順序**（Seq）；每項勾選後代表「已對母本驗證或已補齊」。  
> **狀態欄建議填**：`未開始`／`進行中`／`已驗證`（已驗證＝對照 PDF 有證據，非僅自認完成）。  
> **02 編號**：PDF 內 **【5】出現兩次**（填寫表單、開工接更），本清單拆成 **【5】** 與 **【5b】** 以利追蹤。

**相關檔**：`docs/feature-list.md`（現況盤點）、`docs/business-logic.md`（01 條文整理）、`docs/client-delivery-remediation-plan.md`（對客戶流程）。

---

## A. 鐵律與資料治理（`01`—建議優先 Seq 1～12）

| Seq | PDF／條款 | 補回項目／缺漏細節 | 與現況對照（摘要） | 驗收提示 |
|-----|------------|--------------------|-------------------|----------|
| 1 | 01 §1 RBAC | Admin／TeamLead／Staff **三分權限**於 UI／API 完整落地（含「Staff 不可審批自己」） | 已補前端角色解析＋權限矩陣雛型、migration/Edge 三角色授權，並新增 `docs/rbac-seq1-verification-checklist.md` 與單元測試；待實庫執行抽測 | 權限矩陣表＋抽測帳號 |
| 2 | 01 §2 Session | 工作節 `PENDING→ACCEPTED/REJECTED→COMPLETED` 與「僅 ACCEPTED 可填表」 | **未見**獨立工作節模組 | 狀態流 E2E |
| 3 | 01 §2 Form | 表單 `DRAFT→SUBMITTED→APPROVED/REJECTED…`；`APPROVED` 後鎖定 | 已見前端 `serviceForms`（Seq 17）；仍待後端持久化與正式審批鏈 | 狀態＋不可編輯證明 |
| 4 | 01 §3 | **雙軌**（資助復康 vs 認知）**絕不混用**；演算與 02 Pass 細節一致 | 有排班；**須逐條對照** Pass／間隔／SC | 測試案例＋對照 02 文字 |
| 5 | 01 §3.1 | **單日 1 次同類**、**不可連續兩日**及「無其他時段」例外 | 需程式碼審查是否完整 | 邊界週測 |
| 6 | 01 §3.2 | Pass1/2/3 順序與目標（甲一每週 2 次、券依評估、私位剩餘）與 **02** 私位「每週最多 2 次」等是否一致 | 有 Pass 概念；**與 02 數值需對表** | 客戶裁定單一版本 |
| 7 | 01 §3.3 | 認知軌道：**忽略資助**、嚴重度優先、廣泛覆蓋 | 需對照演算法欄位 | 同上 |
| 8 | 01 §4.1 | 合規統計**兩軌獨立**；**週三**甲一／券資助復康仍 0 次→**TeamLead Alert** | 已補前端週三 0 次高優先提醒（甲一/券）、KPI 摘要卡、提醒 CSV 匯出與單元測試；待 TeamLead 專屬儀表板頁面整合 | 模擬週三情境 |
| 9 | 01 §4.3 | 評估到期前 **14 天** 進 Staff 待辦 | 已補 Residents 頁「14 天到期待辦」骨架（含 service+測試，暫以入住日 180 天週期估算）；待正式 assessment 資料模型/API | 待辦 API＋UI |
| 10 | 01 §5 | **全系統**軟刪除（院友外：員工／表單／排班） | 院友軟刪既有；已補員工軟刪（連動 skills/activity/scheduling sessions）與活動時段手動軟刪入口；表單/排班其餘實體待補 | DB `is_deleted` 抽樣 |
| 11 | 01 §5 | **全系統**表單提交＋排班確認 **防抖／鎖定** | 已完成排班儲存、院友表單、三大匯入確認、登入、軟刪除、KPI 重試同步之 UI＋Hook 鎖；關鍵 Edge POST 已附 `X-Idempotency-Key`（待後端端到端驗證） | 雙擊測試＋網路延遲重入測試 |
| 12 | 01 §5 | **Audit Trail** 寫入：操作者、時間、變更前後（表單審批、排班修改） | 院友 CRUD、排班執行/儲存已寫入；新增「週三提醒匯出」與「評估到期待辦匯出」審計事件；共用 `AuditTrailPanel` 支援 action/entity（含 Staff）/keyword，且排班儀表亦顯示全域軌跡；已補 `FORM_*`、`SHIFT_START_HANDOVER_*`、`SHIFT_END_HANDOVER_*`；仍待 Edge／表設計與正式庫 | Edge／表設計＋畫面 |

---

## B. 產品功能模組（`02`【1】～【16】—建議 Seq 13～34）

| Seq | 02 編號 | 補回項目／缺漏細節 | 與現況對照（摘要） | 驗收提示 |
|-----|---------|--------------------|-------------------|----------|
| 13 | 【1】 | 儀表盤：院友／員工總數、今日工作節、本週合規、待辦、今日團隊分 PT/OT | 已新增 `features/dashboard`：`dashboardSummaryService` 彙總、`DashboardHome`、RBAC `view:dashboard`、側欄／預設路由 `#dashboard`；本週合規取最近 KPI 快取、PT/OT 暫由員工顯示名推斷（待 `role_type`）；仍待與 02 逐欄對表 | 對照 02 欄位逐項 |
| 14 | 【2】 | 創建工作計劃：日期、員工、工作節欄位、列表預覽、儲存即指派 | 已新增 `features/workPlans`：`workPlanDraftService`／`workPlanCommitService`（預檢→`activity-sessions-import-commit`）、`WorkPlansHome`、`view:work-plan-compose`（Admin／TeamLead）；審計 `WORK_PLAN_SESSION_COMMIT`；migration 種子認知活動 `activity-dementia-01`；仍待與 PDF SOP 五步 UI／狀態機逐屏對表 | SOP 1～5 步 |
| 15 | 【3】 | 智能排班：**導入週更表→確認→排班→預覽→確認採用**；雙軌與 Pass 與 02 備註 | 已補五步進度 UI（`SchedulingWorkflowStepper`）、排班頁內 CSV 週更表（共用活動時段預檢／提交）、確認勾選後才可「啟動智能排班」、`sessionCount`／`reloadSchedulingData`；仍待與 02 逐步 UI 逐字對表及更表欄位客製 | 流程錄影＋資料 |
| 16 | 【4】 | 我的工作計劃（選日／狀態／列表／詳情／接收或拒絕）；**團隊計劃**（TeamLead、批量刪除） | 已新增 `features/workSessionPlans`、`view:work-session-plans`（Staff／TeamLead／Admin）；`workSessionResponseStore`（localStorage）+ `WORK_SESSION_ACCEPT`／`REJECT`／`TEAM_BULK_SOFT_DELETE` 審計；Staff 憑 `starcare_staff_profile_id` 對齊時段；主管批量軟刪走 activity_sessions；仍待 DB 正式 session 狀態與 Seq 17 COMPLETED 連動 | 角色分測 |
| 17 | 【5】 | 填寫表單：選日、找工作節、填寫、提交→同步表單審核 | 已新增 `features/serviceForms`：`serviceFormDomainService`（01 §2.1／§2.2）、localStorage、`FORM_*` 審計、`view:service-forms`、`#service-forms`；仍待 DB／Edge 與 JWT 員工對齊、以及工作節 COMPLETED 連動（見 Seq 2／16） | 與 §2 表單狀態連動 |
| 18 | 【5b】 | 開工接更：代表、部門概覽、院舍資訊、注意事項、歷史、簽名 | 已新增 `features/shiftStartHandover`、`shiftStartHandoverDomainService`（對齊六步）、localStorage、`SHIFT_START_HANDOVER_*` 審計、`view:shift-start-handover`、`#shift-start-handover`；仍待 DB／電子簽與 PDF 逐字對表 | PDF SOP 六步 |
| 19 | 【6】 | 收工交更：數據概覽、跟進、新增事項、提醒、報告、簽名 | 已新增 `features/endShiftHandover`、`endShiftHandoverDomainService`（對齊五步＋簽名）、localStorage、`SHIFT_END_HANDOVER_*` 審計、`view:shift-end-handover`、`#shift-end-handover`；仍待 DB／電子簽與 PDF 逐字對表 | |
| 20 | 【7】 | 智能工作分析／表單審核：提交概況、團隊報告、審批、回饋、通知 | 已新增 `features/workAnalysisReview`（`workAnalysisReviewSummaryService`、`SubmissionOverviewCards`、`TeamReportActionsPanel`）、複用 `ServiceFormReviewPanel`、回饋／通知占位；`view:work-analysis-review`（TeamLead／Admin）、`#work-analysis-review`；`useServiceFormsWorkspace.allForms` 供全系統聚合；仍待後端報表、真正通知（Seq 27）與 PDF 逐字對表 | |
| 21 | 【8】 | 復康活動追蹤：兩軌統計、合規總覽、院友完成列表 | 已新增 `features/rehabActivityTracking`：`rehabActivityTrackingSnapshotService`（資助復康乾跑呼叫 `runSubsidizedRehabScheduling` 且 `recordAudit:false`）、`dementiaTrackDryRunService`（認知時段獨立乾跑）、`#rehab-activity-tracking`、`view:rehab-activity-tracking`；仍待與 02 完整看板逐欄對表及認知引擎與正式 SOP 完全對齊 | 與 01 §4 不混算 |
| 22 | 【9】 | 評估管理：到期追蹤、歷史、待處理／逾期、完成率；**版本管理** PT/OT | 已補 `features/assessmentManagement`：`assessmentManagementDomainService`（180 日錨點、14 日逾期寬限、完成率）、localStorage、`ASSESSMENT_COMPLETION_RECORD` 審計、`view:assessment-management`（Staff／TeamLead／Admin）、`#assessment-management`；仍待 DB／正式 assessment API 與 PDF 逐字對表 | 與 Seq 9 呼應 |
| 23 | 【10】 | 歷史文件：僅 `APPROVED`、篩選、匯出 Excel | 已補 `features/historicalDocuments`：`historicalDocumentsDomainService`、`historicalDocumentsRepository`（暫讀本地表單）、UTF-8 BOM CSV（Excel 可開）、`HISTORICAL_DOCUMENTS_EXPORT` 審計、`view:historical-documents`、`#historical-documents`；仍待後端僅 APPROVED API／真正 Excel xlsx／PDF 逐字對表 | |
| 24 | 【11】 | AI 報告中心（Team Lead）：生成、編輯／採用、發放 | 已補 `features/aiReportCenter`：`aiReportCenterDomainService`（DRAFT→ADOPTED→DISTRIBUTED）、`aiReportCenterRepository`／localStorage、`AI_REPORT_CENTER_*` 審計、`view:ai-report-center`（TeamLead／Admin）、`#ai-report-center`；仍待真正 AI、發放對象／Seq 27 通知與 PDF 逐字對表 | |
| 25 | 【12】 | 院友管理：單筆欄位、批量、**預覽**、**匯出 Excel** | 已補院友名單匯出（UTF-8 BOM CSV，Excel 可開）與 `RESIDENTS_EXPORT` 審計；單筆＋批量預檢流程既有。仍待真正 xlsx 與 02 用語逐字對照 | 對照 02 SOP |
| 26 | 【13】 | 員工管理：單筆、批量、預覽、**匯出**；部門／TeamLead／Member 架構 | 已補員工概覽匯出（UTF-8 BOM CSV，Excel 可開）與 `STAFF_EXPORT` 審計；批量匯入/預檢既有。仍待單筆維護流程與部門/TeamLead/Member 完整架構 | |
| 27 | 【14】 | 通知中心 | 已補 `features/notificationCenter`：以審計事件衍生通知（未讀/已讀/重整）、`view:notification-center`、`#notification-center`；仍待真正推送通道（站內/電郵/即時）與收件對象規則 | |
| 28 | 【15】 | 用戶手冊 | 已補 `features/userManual` 站內指引頁（快速上手、閉環流程、文件參考）與 `view:user-manual`、`#user-manual`；仍待正式圖文版手冊與角色分章節 | 可先做連結／PDF |
| 29 | 【16】 | 系統設定：排班時間、非治療時段、規則、固定活動、服務類型啟用、SC 是否僅治療師等 | 已補 `features/systemSettings`：`SystemSettingsHome`（時段／開關／SC 占位）、`localStorage` repository、`SYSTEM_SETTINGS_SAVE` 審計、`view:system-settings`（Admin／TeamLead）、`#system-settings`；仍待後端院舍設定 API、排班引擎讀取與 PDF 逐欄對表 | 對照 02 表單欄位 |

---

## C. 工程規範（`03`—建議 Seq 35～38）

| Seq | PDF／條款 | 補回項目／缺漏細節 | 與現況對照（摘要） | 驗收提示 |
|-----|------------|--------------------|-------------------|----------|
| 35 | 03 | 與 `.cursorrules` **並讀**；若有衝突，**客戶簽核 PDF 優先** | 已存檔；未強制逐條勾選 | 差異表 |
| 36 | 03＋01 | 「複雜邏輯優先 Edge／DB」vs 現行**前端排班** | **架構張力** | 書面架構決策 |
| 37 | 03 | 閉環／SRP／200 行等工程約束於**新模組**落實 | 既有碼漸進 | Code review 規則 |
| 38 | 全份 | **三 PDF 版本號／日期**寫入 `docs/business-logic.md` 修訂或獨立 `VERSIONS` | 已補 `docs/business-logic.md` §0.1（含三份母本 SHA-256）；等待客戶補版次／日期 | 客戶確認信 |

---

## 使用方式

1. **由 Seq 小到大執行**；同一 Seq 未完成前，不建議跳去依賴它的模組（例如未做【4】則【5】難驗收）。  
2. 每勾一項，請在內部 issue **貼上 PDF 頁碼或【N】**，方便稽核。  
3. 本表與 `docs/feature-list.md` **雙向更新**：程式交付後改 `feature-list` 狀態；本表「已驗證」由產品簽。

---

| 日期 | 說明 |
|------|------|
| 2026-05-01 | 初版：合併 `01` 鐵律缺口與 `02`【1】～【16】為單一序號清單。 |
| 2026-05-01 | 更新 Seq 11、Seq 38 現況摘要：納入已落地防重覆提交範圍、Edge idempotency header 進度與 PDF 版本追蹤進度。 |
| 2026-05-01 | 更新 Seq 1 現況摘要：新增前端 RBAC 權限矩陣雛型與 `Staff 不可審批自己` 規則函式。 |
| 2026-05-01 | 更新 Seq 1 現況摘要：補上後端三角色對齊 migration 與 Edge `requireStaffUser` 角色擴充。 |
| 2026-05-01 | 更新 Seq 1 現況摘要：補 RBAC 抽測清單文件與 `permissions` 單元測試。 |
| 2026-05-01 | 更新 Seq 8 現況摘要：新增週三資助復康 0 次高優先提醒與對應單元測試。 |
| 2026-05-01 | 更新 Seq 8 現況摘要：補 KPI 區「週三 0 次提醒」摘要卡（含名單預覽）。 |
| 2026-05-01 | 更新 Seq 8 現況摘要：補「週三提醒清單」CSV 匯出與對應測試。 |
| 2026-05-01 | 更新 Seq 9 現況摘要：補 14 天評估到期待辦骨架（估算規則＋UI＋測試）。 |
| 2026-05-01 | 更新 Seq 12 現況摘要：補週三提醒匯出與評估到期待辦匯出的 Audit Trail 事件。 |
| 2026-05-01 | 更新 Seq 12 現況摘要：院友頁 Audit Trail 面板升級為可篩選（action/entity/關鍵字）。 |
| 2026-05-01 | 更新 Seq 10 現況摘要：補員工軟刪除端到端（UI→Service/Repository→Edge Function）。 |
| 2026-05-01 | 更新 Seq 10 現況摘要：補活動時段手動軟刪除端到端（列表入口＋Edge Function）。 |
| 2026-05-01 | 更新 Seq 17 現況摘要：補填寫表單／審核閉環（前端模組＋審計＋RBAC）； persistence 仍為本地暫存。 |
| 2026-05-01 | 更新 Seq 18 現況摘要：補開工接更骨架（六步 UI、草稿／提交、審計）；並修正 `#scheduling` hash 路由對應。 |
| 2026-05-01 | 更新 Seq 19 現況摘要：補收工交更骨架（五步摘要＋簽名、草稿／提交、審計）。 |
| 2026-05-01 | 更新 Seq 20 現況摘要：補工作分析／表單審核頁（提交概況、團隊報告複製、審批複用、回饋占位）。 |
| 2026-05-01 | 更新 Seq 21 現況摘要：補復康活動追蹤兩軌頁（乾跑預覽、分軌列表）；排班引擎支援關閉審計以利追蹤頁試算。 |
| 2026-05-01 | 更新 Seq 22 現況摘要：補評估管理頁（逾期／14 天內到期／完成率／PT·OT 版本本地紀錄）與網域單元測試。 |
| 2026-05-01 | 更新 Seq 12／22：`AuditTrailPanel` 補齊 `ASSESSMENT_COMPLETION_RECORD` 與開收工交更動作篩選；評估管理頁嵌入全域審計節錄。 |
| 2026-05-01 | 更新 Seq 23：歷史文件頁（僅 APPROVED、日期／關鍵字篩選、CSV 匯出）與 `HISTORICAL_DOCUMENTS_EXPORT`；RBAC `view:historical-documents`。 |
| 2026-05-01 | 更新 Seq 24：AI 報告中心骨架與四類審計動作；修正 `#historical-documents` hash 對應與 module 描述遺漏。 |
| 2026-05-01 | 更新 Seq 25：院友名單新增「匯出 Excel（CSV）」與 `RESIDENTS_EXPORT` 審計事件。 |
| 2026-05-01 | 更新 Seq 26：員工概覽新增「匯出 Excel（CSV）」與 `STAFF_EXPORT` 審計事件。 |
| 2026-05-01 | 更新 Seq 27：通知中心骨架（審計事件衍生通知、已讀狀態、RBAC 與路由）。 |
| 2026-05-01 | 更新 Seq 28：新增用戶手冊頁（站內操作摘要）與 `view:user-manual` 路由入口。 |
