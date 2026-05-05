# Seq 27：通知中心（PDF 02【14】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【14】**；條文整理 **`docs/business-logic.md`**（與 **Seq 12** 審計同源）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **27**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **27**。  
> **上一序號**：**`docs/seq26-staff-management-pdf02-traceability.md`**（員工管理【13】）。  
> **用途**：將 **審計衍生通知、已讀狀態、與全域審計面板同源** 與母本對表；標示 **電郵／即時推送、收件規則** 驗收缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 列表 | **`NotificationCenterHome`** | 未讀數、**重新整理**（**`hydrateAuditTrailFromRemote`**）、**全部標為已讀**、逐筆 **標記已讀**。 |
| 資料 | **`useNotificationCenter`** | **`useAuditTrailList`** → **`buildNotificationCenterItems`**；已讀 **localStorage**。 |
| 審計 | **`AuditTrailPanel`**（頁底） | 與 **`useNotificationCenter`** 內 **`auditTrail`** **同源**，不重複訂閱（見主檔 Seq 27 敘述）。 |

**路由**：`view:notification-center`、**`#notification-center`**。

---

## 2. 衍生規則（`notificationCenterService`）

| 項目 | 說明 |
|------|------|
| **`RELEVANT_ACTIONS`** | 篩選進通知的 **`action`** 白名單（表單 **`FORM_*`**、匯出、評估、AI 發放、系統設定、排班歷史批次軟刪等） |
| **`titleByAction`**／**`severityByAction`** | 標題與 **high／medium／low** 嚴重度 |
| **`buildNotificationCenterItems`** | 最多 **50** 筆、新到舊；**`id`**＝**`remoteId`** 或 **`action:entityId:occurredAt`** 合成 |

---

## 3. 已讀持久化

| 層 | 路徑 | 驗收備註 |
|----|------|----------|
| 本機 | **`notificationReadStateStorage`**（`starcare-notification-read-v1`） | 伺服器已讀同步 **待 P0** |

---

## 4. 與其他 Seq 閉環

| 來源模組 | 審計 `action`（摘） |
|----------|---------------------|
| **Seq 17／20** | `FORM_SUBMIT`、`FORM_APPROVE`、`FORM_REJECT_REVISION`、`FORM_SOFT_DELETE` |
| **Seq 23** | `HISTORICAL_DOCUMENTS_EXPORT` |
| **Seq 24** | `AI_REPORT_CENTER_DISTRIBUTE` |
| **Seq 25／26** | `RESIDENTS_EXPORT`、`STAFF_EXPORT` |
| **Seq 22** | `ASSESSMENT_COMPLETION_RECORD` |
| 排班歷史 | `SCHEDULING_HISTORY_BATCH_SOFT_DELETE` |

---

## 5. 自動化測試與 E2E 錨點

| 測試／E2E | 涵蓋 |
|-----------|------|
| `notificationCenterService.test.ts` | 篩選、標題、已讀 |
| `e2e/smoke.spec.ts` | `#notification-center`、**審計紀錄節錄** |
| `e2e/auth-login.staff-modules.spec.ts` | **`/#notification-center`** |

---

## 6. 維護閉環

- 變更 **`RELEVANT_ACTIONS`**、**嚴重度**或 **新審計 `action`** 若需進站內通知時：同步本檔、**`pdf-sequenced-gap-checklist.md`** Seq 27、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）；並核 **Seq 12** 審計型別是否已註冊於 **`AuditTrailPanel`**。
- **下一序號**：用戶手冊 **Seq 28**（02【15】）— **`docs/seq28-user-manual-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 27 **對照骨架**；與 Seq 26 互鏈。 |
| 2026-05-04 | §6：與 **`seq28-user-manual-pdf02-traceability.md`** 互鏈。 |
