# `business-logic.md` 修訂紀錄（§8 重出）

> **對照**：**`docs/business-logic.md`** §0～§7 為母本與程式對照之權威正文；為遵守專案單檔 **≤200** 行，原 **§8** 修訂表全文移出至本檔。新增修訂列請寫入下表；維護閉環見 **`docs/pdf03-cursorrules-alignment.md`** §4。  
> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

---

## 修訂紀錄

| 日期 | 說明 |
|------|------|
| 2026-05-01 | 依根目錄 PDF `# STARCare 系統核心業務邏輯與 SOP 規範 (business-logic).pdf` 全文整理並增列程式對照／落差；取代先前僅占位之版本。 |
| 2026-05-01 | §7：§3.1「無其他可用時段」間隔例外已對齊 `schedulingCore.pickSession` 二階段邏輯；測試見 `schedulingService.section31.test.ts`。 |
| 2026-05-01 | §7：補 §3.2 週目標常數（Seq 6）與 `schedulingTargets.test.ts` 說明。 |
| 2026-05-01 | §7：補 §3 雙軌隔離（Seq 4）與乾跑／門檻測試路徑。 |
| 2026-05-01 | §7：補 §3.3 認知軌（Seq 7）與 `dementiaTrackDryRunService`／`filterToDementiaServiceOnly` 說明。 |
| 2026-05-01 | §7：補 §4.1 兩軌分離（Seq 8）與 `residentCareTrackCohort`。 |
| 2026-05-02 | §7：§4.1 補 **`mapActiveResidentsToSubsidizedSchedulingResidents`**（排班載入／乾跑 orchestration／儀表週三警示／復康追蹤資助軌共用）。 |
| 2026-05-02 | §7：儀表 **`DashboardSummary.subsidizedRehabCohortCount`**；**`calculateSchedulingKpis`** 註解標明 KPI 分母須為 §4.1 族群。 |
| 2026-05-02 | §7：§4.3 補 **`assessmentDueTaskRepository`**（待遠端 API 時替換實作）。 |
| 2026-05-02 | §7：§4.3 補 Edge **`assessment-due-list`** 與 **`assessmentDueFromAdmission`**（與前端演算雙源同步維護）。 |
| 2026-05-02 | §7：§4.3 補 **`residents.assessment_next_due_date`** migration 與 **`assessmentDueDateResolve`**（錨點優先）。 |
| 2026-05-02 | §7：§4.3 院友單筆表單可維護評估到期日（**`residentService`** 正規化／審計沿用 UPDATE）。 |
| 2026-05-02 | §7：§4.3 補錨點寫入閉環（批量匯入／匯出、**`residents-create`／`update`** 白名單、**`validateInput`** 接受清空）；**§7** 對照列同步。 |
| 2026-05-02 | §7：補 PDF 02【9】**`assessment_completion_records`** 表、**`assessment-completion-records-list`**、Repository 與評估管理載入合併；§8 同步。 |
| 2026-05-02 | §7：§4.3／02【9】補 Edge **`assessment-completion-records-append`**、Repository **`append`**、評估管理提交流程（本機＋雲端、**`reload`** 合併）。 |
| 2026-05-02 | §7：02【9】**`assessment-completion-records-append`** 成功後寫 **`audit_events`**（**`appendAssessmentCompletionAudit`**）；契約見 **`docs/assessment-completion-records-contract.md`**。 |
| 2026-05-01 | §7：補 §4.2 儀表盤今日時段分軌計數。 |
| 2026-05-01 | 客戶三份 PDF 改存 **`docs/pdf/01…` `02…` `03…`**；更新本節權威路徑；移除根目錄舊 PDF。 |
| 2026-05-01 | 新增 §0.1「三份母本版本追蹤（Seq 38）」；登錄三份 PDF 的 SHA-256 指紋，供客戶版本確認與稽核。 |
| 2026-05-03 | §0：補 **`.cursorrules`** §3「部署與驗收閘門」與本節運維／憑證／**`README`**／**`go-live`** 連動；維護責任見 **`docs/pdf03-cursorrules-alignment.md`** §4。 |
| 2026-05-03 | **`go-live-checklist.md`**、**`supabase-deploy-runbook.md`**、**`pdf03-cursorrules-alignment.md`** 標題下增對照 **`business-logic.md`** §0／**`.cursorrules`** §3 之引導。 |
| 2026-05-03 | **`security-token-rotation-checklist.md`** 標題下增對照 **`business-logic.md`** §0、**`go-live-checklist.md`**、**`supabase-deploy-runbook.md`** 之引導。 |
| 2026-05-03 | **`feature-list.md`** 開首、**`pdf-alignment-p0-backlog.md`**、**`adr-0001`**、**`rbac-seq1-verification-checklist.md`**：增對照 **`business-logic.md`** §0／**`.cursorrules`** §3；**`feature-list.md`** §8 SOP 欄一句同步。 |
| 2026-05-03 | **`residents-edge-function-contract.md`**、**`assessment-completion-records-contract.md`**：開首增對照 **`business-logic.md`** §0、**`go-live-checklist.md`**。 |
| 2026-05-03 | **`client-delivery-remediation-plan.md`** 開首、**`phase3-day5-acceptance.md`**：補內部工程入口／Phase 索引與 **`business-logic.md`** §0 對照。 |
| 2026-05-03 | **`phase3-day5-acceptance-result-2026-04-30.md`**、**`phase4-day4-delivery-index.md`**、**`phase5-day1-delivery-index.md`**：開首增 **對照**（**`business-logic.md`** §0、Phase 鏈、**`npm run ci`**／**`acceptance:*`**）。 |
| 2026-05-03 | Phase 4／5 **Runbook**、**UI smoke**、**完成報告**、**對外摘要**、**打包／發送模板** 開首增 **對照**；**`scripts/phase4-day4-acceptance.mjs`**、**`phase5-day1-acceptance.mjs`**、**`phase5-verify-delivery-artifacts.mjs`**、**`phase5-generate-closeout-summary.mjs`**、**`phase5-print-closeout-status.mjs`**：產出 Markdown 開首增 **對照**（與 **`business-logic.md`** §0、交付索引一致）。 |
| 2026-05-04 | **`stage2-completion-report.md`**、**`stage2-external-summary.md`**、**`stage3-day3-completion-note.md`**、**`stage3-day5-external-summary.md`**：開首增 **對照**（**`business-logic.md`** §0、Phase 3 驗收與 Phase 4 索引）。 |
| 2026-05-04 | §0：增 **Stage 2／Phase 3 歷史追溯**一行；**`README.md`** 文件表、**`feature-list.md`** 頁尾／§8、**`pdf03-cursorrules-alignment.md`** §3 PR 檢核／§4、**`pdf-alignment-p0-backlog.md`** 修訂紀錄同步。 |
| 2026-05-05 | **`pdf-sequenced-gap-checklist.md`** 主檔「**運維與工程**」：補 **Stage 2／Phase 3** 與 **§0**／**`README`** 互鏈一句；**`pdf03-cursorrules-alignment.md`** §4 維護項補「主檔「**運維與工程**」列」同步對象。 |
| 2026-05-06 | **`.cursorrules`** §3：補 **`pdf-sequenced-gap-checklist.md`** 主檔「**運維與工程**」與 §0 對齊；**`pdf-alignment-p0-backlog.md`** 工程附錄、**`feature-list.md`** §8 README 項／頁尾、**`pdf03-cursorrules-alignment.md`** §3 PR 檢核（**`.cursorrules`** §3 專項）同步。 |
| 2026-05-07 | **`README.md`** 開頭與文件表 **`pdf-sequenced-gap-checklist.md`** 列：補「**運維與工程**」與 **§0**／**§3** 對齊說明；**`feature-list.md`** §8 README 項、**`pdf03-cursorrules-alignment.md`** §3「文件入口」同步。 |
| 2026-05-08 | **`pdf-sequenced-gap-checklist.md`** 標題下增 **對照**；**`go-live-checklist.md`** 開首 **對照** 補 **`pdf-sequenced`**「**運維與工程**」；**`.github/workflows/ci.yml`** 註解補文件入口一句；**`pdf03-cursorrules-alignment.md`** §3「文件入口」補 **`ci.yml`** 註解、§4 維護補序號主檔 **對照**；**`feature-list.md`** §8 CI 項同步。 |
| 2026-05-09 | **`supabase-deploy-runbook.md`**、**`security-token-rotation-checklist.md`**、**`rbac-seq1-verification-checklist.md`** 開首 **對照**：補 **`pdf-sequenced-gap-checklist.md`** 主檔「**運維與工程**」列（與 **go-live**／runbook／憑證同列）。 |
| 2026-05-10 | **`residents-edge-function-contract.md`**、**`assessment-completion-records-contract.md`**、**`feature-list.md`** 開首、**`pdf03-cursorrules-alignment.md`** 標題區／§4、**`adr-0001-scheduling-logic-placement.md`** 開首 **對照**：補 **`pdf-sequenced-gap-checklist.md`**「**運維與工程**」列。 |
| 2026-05-11 | §0 **`pdf-sequenced`** 一行補開首 **對照**／「**運維與工程**」與本節及 **`README`**／**§3** 對齊；**`client-delivery-remediation-plan.md`** 內部入口／**§2**、**`pdf-alignment-p0-backlog.md`** 開首 **對照**、**`feature-list.md`** §8 README 項同步。 |
| 2026-05-12 | **`docs/phase*.md`**、**`docs/stage*.md`** 開首 **對照** 補 **`pdf-sequenced-gap-checklist.md`**「**運維與工程**」列；**`scripts/phase4-day4-acceptance.mjs`**、**`phase5-day1-acceptance.mjs`**、**`phase5-verify-delivery-artifacts.mjs`**、**`phase5-generate-closeout-summary.mjs`**、**`phase5-print-closeout-status.mjs`** 產出 **對照** 同步。 |
| 2026-05-13 | **`.cursorrules`** §3、**`README.md`** 開頭／文件表、**`business-logic.md`** §0 分階索引行、**`pdf03`** §3 PR 檢核（**`.cursorrules`** §3 項）、**`feature-list.md`** §8 README 項、**`ci.yml`** 註解：**`phase*.md`**／**`stage*.md`** 開首 **對照** 互鏈 **`pdf-sequenced`**「**運維與工程**」列。 |
| 2026-05-14 | **`feature-list.md`** 頁尾、**`pdf03-cursorrules-alignment.md`** §4：補 **`README`**／**§0**／**`ci.yml`**／**`phase*.md`**／**`stage*.md`** 與 **`pdf-sequenced`** 之維護閉環。 |
| 2026-05-15 | **§8** 修訂表全文重出至本檔（**`business-logic.md`** 遵守單檔 ≤200 行）；**`README.md`** 文件表、**`pdf03`** §4、**`feature-list.md`** 頁尾、**`pdf-alignment-p0-backlog.md`** Seq 38 敘述同步。 |
| 2026-05-16 | **`pdf-sequenced-gap-checklist.md`** 修訂表重出 **`pdf-sequenced-gap-checklist-revision-log.md`**（及 **`pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**）；**`pdf03`** §3／§4、**`README.md`**、**`feature-list.md`** 頁尾同步。 |
| 2026-05-17 | **`pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**；主修訂日誌再瘦身；**`pdf03`** §4、**`README.md`**、**`.cursorrules`** §3。 |
| 2026-05-19 | §0.1：補 **`docs/seq38-pdf-versions-traceability.md`** 對照骨架入口（Seq 38）；**`pdf-sequenced-gap-checklist-revision-log.md`** 一筆。 |
| 2026-05-21 | §0：增 **母本 03／Seq 35～38** 對照骨架一行（**`seq35`**、`pdf03`、**`pdf-sequenced-gap-checklist.md`** C）；**`pdf-sequenced-gap-checklist.md`**「**運維與工程**」、`pdf-sequenced-gap-checklist-revision-log.md` 同步。 |
| 2026-06-04 | §0：**全案收尾執行** 句補 **`README.md`**「專案收尾」表列 **`project-completion-*`** 全束與主／歸檔 **`pdf-sequenced-gap-checklist-revision-log*.md`** 互鏈說明（與 **`pdf-sequenced-gap-checklist.md`** 開首、**`client-delivery-remediation-plan.md`** 內部入口一致）。 |
| 2026-06-07 | 本檔開首 **對照** blockquote 內 **全案收尾與證據留痕** 句：與 **`go-live-checklist.md`**／**`seq*.md`** 等 **runbook** 同級敘述對齊（**`project-completion-*`**、主／歸檔 **`pdf-sequenced-gap-checklist-revision-log*.md`**）。 |
| 2026-06-10 | §0：全案收尾句補 Gate A 固定入口 **`docs/evidence/gate-a-latest.md`**、**`npm run gatea:evidence:list`**／**`refresh`**、**`docs/gate-a-evidence-capture-2026-05-06.md`**；**`pdf-sequenced-gap-checklist.md`** 全案收尾段與 **`gate-a-evidence-fill-template-2026-05-06.md`** 加鏈；本檔開首對照句同步。 |
| 2026-06-13 | 本檔開首 **全案收尾與證據留痕** 對照句：Gate A 補 **`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**（與 **`feature-list.md`** 開首、**`README.md`** 開頭、`ci.yml` 註解、**`pdf03`** §3 文件入口項一致）。 |
| 2026-06-14 | **`project-completion-*`** 五份開首「**全案收尾母索引**」句：補 Gate A **`docs/evidence/gate-a-latest.md`** 與 **`gatea:evidence:list`**／**`refresh`**（與 **`README`**「專案收尾」表、**`business-logic.md`** §0 運維鏈一致）。 |
| 2026-06-15 | **`go-live-checklist.md`** 開首「**全案收尾與證據留痕**」段補 Gate A 入口／**`gatea:evidence:list`**／**`refresh`** 並指 **§0.1**（與 §0「併用」敘述一致）。 |
| 2026-06-16 | **`README.md`**「專案收尾」建議順序鏈結 **`gate-a-latest.md`**／**`go-live-checklist.md`** Gate A；**`go-live-checklist.md`** 開首 **對照** blockquote 補 Gate A；**`feature-list.md`** §8 第 24 點括註 Gate A 第 25 點。 |
| 2026-06-23 | §0：Gate A 括註補 **`npm run gatea:evidence:preflight:strict`**（與 **`go-live-checklist.md`** §0.1、**`feature-list.md`**、**`pdf03`**、**`gate-a-evidence-fill-template`** 互鏈）；本檔開首對照句同步。 |
| 2026-06-24 | 凡開首 **全案收尾**／**對照** 之 **`docs/seq*-*.md`**、**`phase*.md`**、**`stage*.md`**、**`project-completion-*`**、合約／runbook／checklist 等與 **`.cursorrules`** §3：Gate A 括註統一為 **`list`**／**`refresh`**／**`preflight:strict`**；**`pdf-sequenced-gap-checklist.md`** 全案收尾段補齊三指令；**`feature-list.md`** 頁尾補 **`preflight:strict`**；本檔開首對照句已於同批一致。 |
| 2026-06-25 | 本檔開首 **全案收尾與證據留痕** 句之歸檔副檔鏈補 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**（與 **`pdf-sequenced-gap-checklist-revision-log.md`** **2026-06-25** 列、**`README.md`**「專案收尾」表、**`.cursorrules`** §3 等一致）。 |
| 2026-06-26 | §0 Gate A **`docs/evidence/gate-a-latest.md`** 括註與 **`go-live-checklist.md`** 全案收尾句、**`README`**、**`feature-list`**、多份對照文件補「**Next Command**／**`preflight:strict`** 並列」敘述一致；**`pdf-sequenced-gap-checklist-revision-log.md`** 一筆。 |
| 2026-06-27 | §0 對照：**`.github/workflows/ci.yml`**「文件入口」註解之 **`gate-a-latest`** 括註與 **`pdf-sequenced-gap-checklist-revision-log.md`** **2026-06-27** 列一致。 |
| 2026-06-28 | §0 對照：**`gate-a-evidence-fill-template`**／**`gate-a-manual-evidence-checklist`** 之 **`gate-a-latest`** 括註與 **`pdf-sequenced-gap-checklist-revision-log.md`** **2026-06-28** 列一致。 |
| 2026-06-29 | 本檔開首 **全案收尾與證據留痕** 句之歸檔副檔鏈補 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**（與 **`pdf-sequenced-gap-checklist-revision-log.md`** **2026-06-29** 列、**`README.md`**「專案收尾」表、**`.cursorrules`** §3 等一致）。 |
| 2026-06-30 | §0 對照：**`feature-list.md`** 頁尾「**文件產生**」序號主檔括註補 **`pdf-sequenced-gap-checklist-revision-log`** 歸檔全鏈（**`2026-05-01a`**／**`archive-p2`**／**`archive-p3`**／**`archive-p4`**）；**`pdf-sequenced-gap-checklist-revision-log.md`** **2026-06-30** 列一致。 |
| 2026-07-01 | §0 對照：**`go-live-checklist.md`** 開首 **對照** 句補修訂日誌主／歸檔鏈指 **`README.md`**「專案收尾」表；**`pdf-sequenced-gap-checklist-revision-log.md`** **2026-07-01** 列一致。 |
| 2026-07-02 | §0：「專案工程規範」句補 **`go-live-checklist.md`** 開首 **對照** 與 **`README.md`**「專案收尾」修訂日誌主／歸檔路徑互鏈；**`pdf-sequenced-gap-checklist-revision-log.md`** **2026-07-02** 列一致。 |
| 2026-07-06 | §0「全案收尾執行」句：補 **`README.md`**「專案收尾」表前讀者指引（六份 **`project-completion-*`** 開首 **對照** 與修訂日誌主／歸檔路徑互鏈）；**`pdf-sequenced-gap-checklist-revision-log.md`** **2026-07-06** 列一致。 |
| 2026-07-12 | §0「全案收尾執行」句：表前讀者指引補列各檔開首 **全案收尾母索引** 與 **對照** 同鏈 **README** 表前互鏈與修訂日誌主／歸檔路徑（與 **`project-completion-*`** **2026-07-11** 列、**`pdf-sequenced-gap-checklist-revision-log.md`** **2026-07-12** 列一致）。 |
| 2026-08-06 | §0「全案收尾執行」句 Gate A 段：補 **`gatea:evidence:*`** 終端 stdout 頁尾維護鏈（**`scripts/gate-a-markdown-footer.mjs`** **Export 契約**、**`README.md`**「Gate A 終端頁尾（維護）」、**`go-live-checklist.md`** §0.1）；**`pdf-sequenced-gap-checklist-revision-log.md`** **2026-08-06** 列一致。 |
