# `pdf-sequenced-gap-checklist` 修訂紀錄歸檔（2026-05-01 前段）

> **對照**：續列與較新修訂見 **`docs/pdf-sequenced-gap-checklist-revision-log.md`**。本檔為自該主修訂表拆出之 **2026-05-01** 同日早期列（原表第 11–44 列），以符合單檔 ≤200 行。  
> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**。

---

## 修訂紀錄（歸檔段）

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
| 2026-05-01 | 更新 Seq 29：排班／復康乾跑讀取系統設定之排班視窗與非治療時段（`schedulingSessionWindowFilterService`＋單元測試）。 |
| 2026-05-01 | 更新 Seq 2／16：`features/workSessions`＋表單核准寫入 `COMPLETED` 與 `WORK_SESSION_COMPLETED` 審計；Seq 35–37：`pdf03-cursorrules-alignment.md`、`adr-0001-scheduling-logic-placement.md`。 |
| 2026-05-01 | 更新 Seq 3／17：`service_forms` migration、`service-forms-list`／`service-forms-upsert`、`serviceFormRepository` 與表單工作區遠端合併。 |
| 2026-05-01 | 更新 Seq 23：`serviceFormSyncService` 共用合併；歷史文件頁載入／重整會拉 Edge 表單；刪除 `historicalDocumentsRepository.ts`。 |
| 2026-05-01 | 更新 Seq 23：`service-forms-list` 支援 `approvedOnly`；歷史文件改 `mergeApprovedFormsFromRemote`。 |
| 2026-05-01 | 更新 Seq 10：服務表單軟刪除（Edge `service-forms-soft-delete`、Repository、`useServiceFormsWorkspace.softDelete`、UI、`FORM_SOFT_DELETE`）。 |
| 2026-05-01 | 更新 Seq 27：`notificationCenterService` 納入 `FORM_SOFT_DELETE` 審計衍生通知（標題／嚴重度）。 |
| 2026-05-01 | 更新 Seq 20／27：通知中心納入 `FORM_SUBMIT`、`FORM_APPROVE`、`FORM_REJECT_REVISION`（與既有 `FORM_SOFT_DELETE`）審計衍生站內通知。 |
