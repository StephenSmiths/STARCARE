# Seq 18：開工接更（PDF 02【5b】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【5b】**；條文整理 **`docs/business-logic.md`**（**01 §5** 軟刪除／正式持久化）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **18**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **18**。  
> **上一序號**：**`docs/seq17-service-forms-pdf02-traceability.md`**（填寫表單【5】）。  
> **用途**：將 **六步 SOP、草稿／提交、審計、本機儲存** 與母本 **代表／部門／院舍／注意事項／歷史／簽名** 對表；標示 **DB／電子簽** 驗收缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 主編輯 | `ShiftStartHandoverPanel` | 開工／接班日期、①～④欄位、⑤歷史側欄、⑥簽名；儲存草稿、提交（**PDF 02【5b】** 註解）。 |
| 歷史 | `ShiftStartHandoverHistoryAside` | 已提交列表（唯讀查閱）。 |
| 頁殼 | `ShiftStartHandoverHome` | **`AuditTrailPanel`**（`SHIFT_START_HANDOVER_*`）。 |
| 工作區 | `useShiftStartHandoverWorkspace` | `loadShiftStartHandovers`、`saveDraft`／`submitRecord`、**`busyRef`** 防重覆提交。 |

---

## 2. 狀態與欄位（型別）

| 狀態 | 允許動作 | 程式錨點 | 母本定位（待填） |
|------|----------|----------|------------------|
| `DRAFT` | 儲存草稿、提交（欄位齊） | `upsertShiftStartHandoverDraft`、`submitShiftStartHandover` | 02【5b】＿＿頁 |
| `SUBMITTED` | 不可再改草稿 | `upsertShiftStartHandoverDraft` 拋錯「已提交…不可再修改」 | 02【5b】＿＿頁 |

**提交必填**（`submitShiftStartHandover`）：`representativeNote`、`departmentOverview`、`facilityInfoAcknowledgement`、`precautionsAcknowledgement`、`signatureName`（純文字簽名，**非**電子簽圖檔）。

---

## 3. 審計動作（`SHIFT_START_HANDOVER_*`）

| `action` | 觸發 | 備註 |
|----------|------|------|
| `SHIFT_START_HANDOVER_DRAFT_UPSERT` | `upsertShiftStartHandoverDraft` | `beforeState`／`afterState` JSON |
| `SHIFT_START_HANDOVER_SUBMIT` | `submitShiftStartHandover` | 提交後鎖定 |

---

## 4. 持久化

| 層 | 路徑 | 驗收備註 |
|----|------|----------|
| 本機 | **`shiftStartHandoverStorage`**（**localStorage** `starcare-shift-start-handover-v1`） | 與 **Seq 17** 過渡策略一致；**Repository／DB `is_deleted`** 待 **P0 Seq 18** 主項 |
| 遠端 | 無 | **Edge／表** 待對表簽核後實作 |

---

## 5. 自動化測試與 E2E 錨點

| 測試／E2E | 涵蓋 |
|-----------|------|
| `shiftStartHandoverDomainService.test.ts` | 草稿、提交驗證 |
| `e2e/smoke.spec.ts` | `#shift-start-handover`、審計標題 |
| `e2e/auth-login.staff-modules.spec.ts` | 登入後 **`/#shift-start-handover`** |

---

## 6. 維護閉環

- 變更 **六步文案**、**欄位鍵**、**審計 `action`** 或 **儲存鍵**時：同步本檔、**`pdf-sequenced-gap-checklist.md`** Seq 18、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：收工交更 **Seq 19**（02【6】）— **`docs/seq19-end-shift-handover-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 18 **對照骨架**；與 Seq 17 互鏈。 |
| 2026-05-04 | §6：與 **`seq19-end-shift-handover-pdf02-traceability.md`** 互鏈。 |
