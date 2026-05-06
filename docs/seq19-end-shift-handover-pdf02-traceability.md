# Seq 19：收工交更（PDF 02【6】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【6】**；條文整理 **`docs/business-logic.md`**（**01 §5** 軟刪除／正式持久化）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **19**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **19**。  
> **上一序號**：**`docs/seq18-shift-start-handover-pdf02-traceability.md`**（開工接更【5b】）。  
> **用途**：將 **五欄摘要＋簽名、草稿／提交、審計、本機儲存** 與母本 **數據概覽／跟進／新增／提醒／報告／簽名** 對表；標示 **DB／電子簽** 驗收缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 主表單 | `EndShiftHandoverPanel` | ①～⑤文字區塊（`TEXT_BLOCKS`）、⑥簽名；收工／交班日期；儲存草稿、提交（**PDF 02【6】**）。 |
| 歷史 | `EndShiftHandoverHistoryAside` | 已提交列表（唯讀）。 |
| 頁殼 | `EndShiftHandoverHome` | **`AuditTrailPanel`**（`SHIFT_END_HANDOVER_*`）。 |
| 工作區 | `useEndShiftHandoverWorkspace` | `loadEndShiftHandovers`、`saveDraft`／`submitRecord`、**`busyRef`** 防重覆提交。 |

---

## 2. 狀態與欄位

| 狀態 | 允許動作 | 程式錨點 | 母本定位（待填） |
|------|----------|----------|------------------|
| `DRAFT` | 儲存草稿、提交（欄位齊） | `upsertEndShiftHandoverDraft`、`submitEndShiftHandover` | 02【6】＿＿頁 |
| `SUBMITTED` | 不可再改 | 草稿 upsert 拋錯「已提交之交更紀錄不可再修改」 | 02【6】＿＿頁 |

**提交必填**：`dataOverview`、`followUps`、`newItems`、`reminders`、`reportSummary`、`signatureName`（純文字姓名，**非**電子簽圖檔）。

---

## 3. 審計動作（`SHIFT_END_HANDOVER_*`）

| `action` | 觸發 | 備註 |
|----------|------|------|
| `SHIFT_END_HANDOVER_DRAFT_UPSERT` | `upsertEndShiftHandoverDraft` | `beforeState`／`afterState` JSON |
| `SHIFT_END_HANDOVER_SUBMIT` | `submitEndShiftHandover` | 提交後鎖定 |

---

## 4. 持久化

| 層 | 路徑 | 驗收備註 |
|----|------|----------|
| 本機 | **`endShiftHandoverStorage`**（**localStorage** `starcare-shift-end-handover-v1`） | 與 **Seq 17／18** 過渡策略一致；**Repository／DB** 待 **P0 Seq 19** |
| 遠端 | 無 | **Edge／表** 待對表簽核後實作 |

---

## 5. 自動化測試與 E2E 錨點

| 測試／E2E | 涵蓋 |
|-----------|------|
| `endShiftHandoverDomainService.test.ts` | 草稿、提交驗證 |
| `e2e/smoke.spec.ts` | `#shift-end-handover`、審計標題 |
| `e2e/auth-login.staff-modules.spec.ts` | **`/#shift-end-handover`** 標題與審計區 |

---

## 6. 維護閉環

- 變更 **欄位鍵**、**標籤①～⑤**、**審計 `action`** 或 **儲存鍵**時：同步本檔、**`pdf-sequenced-gap-checklist.md`** Seq 19、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：工作分析／表單審核 **Seq 20**（02【7】）— **`docs/seq20-work-analysis-review-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 19 **對照骨架**；與 Seq 18 互鏈。 |
| 2026-05-04 | §6：與 **`seq20-work-analysis-review-pdf02-traceability.md`** 互鏈。 |
