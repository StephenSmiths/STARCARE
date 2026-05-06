# Seq 24：AI 報告中心（PDF 02【11】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【11】**；條文整理 **`docs/business-logic.md`**（與 **Seq 12** 審計、**Seq 27** 通知銜接）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **24**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **24**。  
> **上一序號**：**`docs/seq23-historical-documents-pdf02-traceability.md`**（歷史文件【10】）。  
> **用途**：將 **生成（占位）→編輯→採用→發放**、**審計**、**本機 Repository** 與母本對表；標示 **真實 AI**、**發放對象**、**電郵／即時** 與 **PDF 逐字簽核** 缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 建立 | `AiReportComposer` | 標題輸入、觸發 **`generateDraft`**（占位 **`buildPlaceholderAiReportBody`**）。 |
| 列表／編輯 | `AiReportList` | 草稿編輯、**採用**、**發放**（僅建立者可編輯／採用／發放，見 **domain**）。 |
| 頁殼 | `AiReportCenterHome` | **`useAiReportCenterWorkspace`**、**`AuditTrailPanel`**（**報告中心審計**）。 |

**路由**：`view:ai-report-center`（TeamLead／Admin）、**`#ai-report-center`**。

---

## 2. 生命週期與網域

| 狀態轉移 | 函式 | 程式錨點 |
|----------|------|----------|
| — → `DRAFT` | **`prependAiReportDraft`** | 新建草稿置頂 |
| `DRAFT` 內容 | **`updateAiReportDraftBody`** | 僅 **`DRAFT`**、僅 **`createdByActorId`** |
| `DRAFT` → `ADOPTED` | **`adoptAiReport`** | **`adoptedAt`** |
| `ADOPTED` → `DISTRIBUTED` | **`distributeAiReport`** | **`distributedAt`**；審計 **detail** 含「占位：待接通知／對象清單」 |

---

## 3. 持久化與閘道

| 層 | 路徑 | 驗收備註 |
|----|------|----------|
| 本機 | **`aiReportCenterStorage`**（`starcare-ai-report-center-v1`） | **`aiReportCenterRepository`** 僅轉呼叫 load／save |
| 遠端 | 無 | P0：**Edge／DB**、模型與提示詞治理 **待簽核** |

---

## 4. 審計與通知

| `action` | 觸發 |
|----------|------|
| `AI_REPORT_CENTER_DRAFT_CREATE` | **`generateDraft`** |
| `AI_REPORT_CENTER_BODY_SAVE` | **`saveDraftBody`** |
| `AI_REPORT_CENTER_ADOPT` | **`adopt`** |
| `AI_REPORT_CENTER_DISTRIBUTE` | **`distribute`**（**`notificationCenterService`** 衍生「AI 報告已發放」） |

---

## 5. 自動化測試與 E2E 錨點

| 測試／E2E | 涵蓋 |
|-----------|------|
| `aiReportCenterDomainService.test.ts` | 草稿／編輯／採用／發放規則 |
| `e2e/smoke.spec.ts` | `#ai-report-center`、**報告中心審計** |

---

## 6. 維護閉環

- 變更 **`AiReportLifecycleStatus`**、**審計 `action`** 或 **占位生成邏輯**時：同步本檔、**`pdf-sequenced-gap-checklist.md`** Seq 24、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）；若涉及發送通道，同步 **`docs/seq27-notification-center-pdf02-traceability.md`** 與主檔 Seq **27** 敘述。
- **下一序號**：院友管理 **Seq 25**（02【12】）— **`docs/seq25-residents-management-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 24 **對照骨架**；與 Seq 23 互鏈。 |
| 2026-05-04 | §6：與 **`seq25-residents-management-pdf02-traceability.md`** 互鏈。 |
| 2026-05-04 | §6 維護閉環：補 **`seq27-notification-center-pdf02-traceability.md`**（發送通道／通知）固定互鏈。 |
