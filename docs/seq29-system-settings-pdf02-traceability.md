# Seq 29：系統設定（PDF 02【16】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【16】**；條文整理 **`docs/business-logic.md`**（排班視窗與 **Seq 15** 引擎）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **29**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **29**。  
> **上一序號**：**`docs/seq28-user-manual-pdf02-traceability.md`**（用戶手冊【15】）。  
> **用途**：將 **排班視窗、非治療時段、規則／服務開關、SC 僅治療師、本機儲存、審計、跨模組重載** 與母本對表；標示 **院舍設定後端 API** 與 **PDF 逐欄簽核** 缺口。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 排班與時段 | **`SystemSettingsHome`** 首段 | **HH:mm** 欄位：`schedulingWindowStart`／`End`、`nonTherapyWindowStart`／`End`。 |
| 規則與服務 | 第二段 | **`rulesEngineEnabled`**、**`fixedActivitiesEnabled`**、**`serviceTypesEnabled`**。 |
| SC | 第三段 | **`specialCareTherapistOnly`**（與 DB **`scheduling_rules.allow_sc_therapist_only`** 併用敘述見主檔）。 |
| 儲存 | **`useSystemSettings`** | **`validateSystemSettings`**、**`lockRef`**、**`SYSTEM_SETTINGS_SAVE`** 審計。 |
| 審計 | **`AuditTrailPanel`**（頁底） | 與 **Seq 12** 同源；**`SYSTEM_SETTINGS_SAVE`** 亦進 **Seq 27** 通知。 |

**路由**：`view:system-settings`、**`#system-settings`**。

---

## 2. 資料模型與持久化

| 型別／鍵 | 說明 |
|----------|------|
| **`SystemSettingsSnapshot`** | **`types.ts`**（註解 **PDF 02【16】Seq 29**） |
| **`SYSTEM_SETTINGS_STORAGE_KEY`** | **`starcare:system-settings:v1`**（**`localStorageKeys`**） |
| **`bumpSystemSettingsExternalVersion`** | 跨頁籤／同機 **`storage` event**（**`systemSettingsExternalStore`**） |

---

## 3. 與排班引擎（Seq 15／29）

| 機制 | 程式錨點 |
|------|----------|
| 時段過濾 | **`schedulingSessionWindowFilterService`**、**`buildEngineConstraintsFromRulesAndUi`**（**`scheduling/hooks/schedulingHookHelpers`**） |
| SC 僅治療師 | 與 **`pickSession`**、時段 **`staffRoleType`** 對齊（主檔 Seq 29 敘述） |

---

## 4. 自動化測試與 E2E

| 測試／E2E | 涵蓋 |
|-----------|------|
| `systemSettingsValidation.test.ts` | 驗證規則 |
| `systemSettingsExternalStore.test.ts` | 版本 bump |
| `e2e/smoke.spec.ts` | **`#system-settings`**、**系統設定與相關審計** |

---

## 5. 維護閉環

- 變更 **`SystemSettingsSnapshot`** 欄位、**驗證規則**或 **審計 `detail`** 時：同步本檔、**`docs/seq15-scheduling-pdf02-traceability.md`**（排班域）、**`pdf-sequenced-gap-checklist.md`** Seq 29、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號（02 模組鏈結束）**：母本 **03** 工程治理 **Seq 35** — **`docs/seq35-pdf03-cursorrules-alignment-traceability.md`**（對 **`docs/pdf03-cursorrules-alignment.md`** 換版差異與閉環）；鏈 **Seq 36～38** 見該檔與 **`pdf-sequenced-gap-checklist.md`** **C 區**。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 29 **對照骨架**（02【16】末序）；與 Seq 28 互鏈。 |
| 2026-05-04 | §5：補 **Seq 35～38**（03／C 區）對照骨架互鏈。 |
