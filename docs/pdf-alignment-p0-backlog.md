# PDF 母本全對齊：P0 Backlog（可勾選）

> **對照**：**`docs/business-logic.md`** §0（**`.cursorrules`** §3「部署與驗收閘門」）、**`README.md`**；母本序號總表 **`docs/pdf-sequenced-gap-checklist.md`**。

> **完成定義**：選項 2 — 三份客戶 PDF 為準，`pdf-sequenced-gap-checklist.md` 各 Seq 可標「已驗證」（對照 PDF 有證據）。  
> **用法**：每項 `- [ ]` 完成後改 `- [x]`，並在內部 issue 或 PR 附 **PDF 頁碼／【N】／SQL／E2E 連結**。  
> **母本**：`docs/pdf/01-…`、`02-…`、`03-…`；條文整理見 `docs/business-logic.md`。

**工程／驗收附錄**：本機全閘 **`npm run ci`**（**`README.md`** 文件表、`docs/feature-list.md` §8；**`acceptance:*`** 與 **`npm run ci`** 分階對照見 **`docs/phase4-day4-delivery-index.md`**、**`docs/phase5-day1-delivery-index.md`**）；遠端部署 **`npm run ops:deploy:all`** 見 **`docs/supabase-deploy-runbook.md`** §2；審計正式庫抽測見 **`docs/go-live-checklist.md`** §8；PAT 與部署後自檢見 **`docs/security-token-rotation-checklist.md`**（**§D** 含可選 **`npm run ci`**）。專案根 **`/.cursorrules`** §3「部署與驗收閘門」與 **`docs/business-logic.md`** §0、**`docs/pdf03-cursorrules-alignment.md`** §4 並讀。院友／評估完成之 Edge 契約見 **`docs/residents-edge-function-contract.md`**、**`docs/assessment-completion-records-contract.md`**。

---

## A 區：Seq 1～12（01 鐵律與資料治理）

- [ ] **Seq 1** — RBAC：於正式（或準正式）庫依 `docs/rbac-seq1-verification-checklist.md` 完成矩陣抽測並存證。
- [ ] **Seq 2** — 工作節：以 DB 為權威之 `PENDING→ACCEPTED/REJECTED→COMPLETED` 狀態機落地（取代僅前端／local 之過渡）。
- [ ] **Seq 2** — 工作節：活動時段與排班結果與工作節狀態之寫回／讀取與 01 §2 對表驗收。
- [ ] **Seq 3** — 表單：登入真庫之完整審批閉環 E2E（`DRAFT→SUBMITTED→APPROVED/REJECTED…`、鎖定與審計）。
- [ ] **Seq 4** — 雙軌：資助復康 vs 認知「絕不混用」— 演算與 02 Pass／條文 **逐條對照表**＋邊界測試證據。
- [ ] **Seq 5** — §3.1：單日 1 次同類、不可連續兩日、「無其他時段」例外 — 程式行為審查結論對 PDF 頁碼存檔。
- [ ] **Seq 6** — Pass1/2/3 與 02 數值（甲一每週 2 次、券依評估、私位每週最多 2 次等）**對表**並取得客戶**單一裁定版本**。
- [ ] **Seq 7** — 認知軌：忽略資助、嚴重度優先、廣泛覆蓋 — 演算法欄位與 PDF 對表。
- [ ] **Seq 8** — 合規兩軌獨立＋週三 TeamLead 警示：與 01 §4.1 **逐欄對表**並補齊儀表盤至母本要求。
- [ ] **Seq 9** — 評估 14 天待辦：正式 **assessment** 資料模型與 API（取代入住日週期估算）。
- [ ] **Seq 9** — Residents「14 天到期待辦」UI 改接正式 assessment 資料並驗收。
- [ ] **Seq 10** — 全系統軟刪除：`is_deleted`（及相關表）**正式庫抽樣** SQL 與結果紀錄。
- [ ] **Seq 11** — 防抖／鎖定：含 `X-Idempotency-Key` 之 Edge POST **端到端**雙擊／網路重入驗證報告。
- [ ] **Seq 12** — Audit Trail：表單審批／排班修改等「變更前後」於正式庫 **抽測** 與畫面證據。

---

## B 區：Seq 13～34（02【1】～【16】）

- [ ] **Seq 13** — 儀表盤【1】：與 02 **逐欄對表**（院友／員工／工作節／合規／待辦／PT·OT）。
- [x] **Seq 13** — 今日團隊 PT/OT：改以母本定義之權威來源（例如 staff `role_type`），移除「顯示名推斷」。（程式：`rehabDisciplineFamilyFromStaff` 僅依 `staff_profiles.role_type`；**02 逐欄對表**仍待本檔第一項 Seq 13）
- [ ] **Seq 14** — 創建工作計劃【2】：PDF SOP **五步** UI／狀態機 **逐屏對表**簽核。
- [ ] **Seq 15** — 智能排班【3】：導入週更表→確認→排班→預覽→採用與 02 **逐步 UI 逐字對表**。
- [ ] **Seq 15** — 週更表欄位與母本一致之 **客製**（若 PDF 要求與現行 CSV 不同）。
- [ ] **Seq 16** — 我的工作計劃【4】：DB 正式 session 與活動時段／指派之 **寫回與讀取**（與 local-only 過渡對表）。
- [ ] **Seq 17** — 填寫表單【5】：與 02【5】全文及 01 §2 **對表簽核**（與工作節 ACCEPTED 規則一致）。
- [ ] **Seq 18** — 開工接更【5b】：**DB 持久化**、**電子簽**（或母本允許之等效）與 PDF **逐字對表**。
- [ ] **Seq 19** — 收工交更【6】：同上（DB、簽名、逐字對表）。
- [ ] **Seq 20** — 工作分析／表單審核【7】：**後端報表**（若母本要求）、**電郵／即時推送**與收件對象規則、PDF 逐字對表。
- [ ] **Seq 21** — 復康活動追蹤【8】：與 02 看板 **逐欄對表**；認知引擎與 **正式 SOP** 完全對齊之驗收。
- [ ] **Seq 22** — 評估管理【9】：**DB**、正式 **assessment API**、PT/OT 版本管理與 PDF **逐字對表**。
- [ ] **Seq 23** — 歷史文件【10】：若母本要求 **Excel（xlsx）** — 實作或取得客戶書面同意 CSV 等效；其餘逐字對表。
- [ ] **Seq 24** — AI 報告中心【11】：**真 AI 生成**（或母本定義之供應商／流程）、發放對象、與通知【14】及 PDF **逐字對表**。
- [ ] **Seq 25** — 院友管理【12】：**xlsx**（若母本堅持 Excel 語意）與 02 用語 **逐字對照**簽核。
- [ ] **Seq 26** — 員工管理【13】：**單筆維護**流程、部門／TeamLead／Member **完整架構**與 PDF 對表。
- [ ] **Seq 27** — 通知中心【14】：**電郵／即時**通道與收件對象規則與 PDF 對表。
- [ ] **Seq 28** — 用戶手冊【15】：**正式圖文版**（或客戶提供 PDF）與 **角色分章**。
- [ ] **Seq 29** — 系統設定【16】：**院舍設定後端 API**、`specialCareTherapistOnly` 納入指派邏輯、與 PDF **逐欄對表**。

---

## C 區：Seq 35～38（03 工程與版本）

- [ ] **Seq 35** — 客戶 PDF **換版**後，重跑 `docs/pdf03-cursorrules-alignment.md` 差異並簽核。
- [ ] **Seq 36** — 客戶書面確認 `docs/adr-0001-scheduling-logic-placement.md` 與母本 **03／01** 無未解衝突（或備註豁免）。
- [ ] **Seq 37** — 訂立「既有碼收斂至工程規（含 200 行）」之 **里程碑或豁免清單** 並經治理／客戶同意（若適用）。
- [ ] **Seq 38** — 三份 PDF **版次／日期** 由客戶確認後，更新 `docs/business-logic.md` §0.1（或獨立 `VERSIONS`）與簽收紀錄。

---

## 匯總

| 區塊 | 勾選項數（約） |
|------|----------------|
| A Seq 1～12 | 14 |
| B Seq 13～34 | 22 |
| C Seq 35～38 | 4 |
| **合計** | **40** |

完成 **40** 項並不代表「程式不再改」，而是代表母本全對齊路徑上 **P0 證據鏈**已齊；其餘改善可列 P1。

---

| 日期 | 說明 |
|------|------|
| 2026-05-03 | 首段增 **工程／驗收附錄**（**`npm run ci`**、**`ops:deploy:all`**、**go-live** §8、憑證清單）；與 **`pdf-sequenced-gap-checklist.md`** 主檔「運維與工程」對照；**`README.md`**／**`business-logic.md`** §0 增本檔入口。 |
| 2026-05-03 | **工程／驗收附錄**補 **`residents-edge-function-contract`**、**`assessment-completion-records-contract`** 鏈結；補 **`phase4-day4-delivery-index`**／**`phase5-day1-delivery-index`** 與 **`acceptance:*`** 對照；**`pdf03-cursorrules-alignment.md`** §3 文件入口檢核補 **`README`** 交付索引列；補 **`.cursorrules`** §3／**`business-logic.md`** §0／**`pdf03`** §4 並讀一句。 |
| 2026-05-02 | 初版：依 `docs/pdf-sequenced-gap-checklist.md` Seq 1～38 摘要「仍待／待／需」拆為可勾選 P0。 |
| 2026-05-02 | 程式進度：`staff-profiles-list` Edge＋`StaffOverviewRow.roleType`；儀表盤 PT/OT 以 DB `role_type` 為優先（P0「Seq 13 PT/OT」之實作面；**逐欄對表簽核**仍待）。 |
| 2026-05-02 | 程式進度：員工概覽 CSV 匯出增 **職類** 欄（Seq 26 匯出面向；**xlsx／母本逐字**仍待）。 |
| 2026-05-02 | 程式進度：院友名單 CSV 增機讀代碼末三欄（Seq 25 與匯入範本對齊；**xlsx** 仍待）。 |
| 2026-05-02 | 程式進度：Seq 26 單筆主檔 **`staff-profile-update`**＋UI；**部門／架構**與母本逐字仍待。 |
| 2026-05-02 | 程式進度：Seq 1／26 — **`staff-import-validate`**／**commit**、**`staff-soft-delete`** 與主檔更新一致，僅 TeamLead／Admin；RBAC 抽測清單 4b。 |
| 2026-05-02 | 程式進度：Seq 1／25／15 — 院友寫入／匯入、活動時段匯入／軟刪 Edge 改 **`guardTeamLeadOrAdmin`**；RBAC 清單 4c。 |
| 2026-05-02 | 程式進度：Seq 13 — 儀表盤 PT/OT **不再**以顯示名推斷；Seq 29 部分 — **`allow_sc_therapist_only`**＋本機 SC 開關合併、**`staffRoleType`** 時段、`pickSession` 擋 PTA／OTA／TeamLead。 |
| 2026-05-02 | 程式進度：Seq 13／29 — **`useSystemSettingsExternalVersion`**、**`useInvalidateOnSystemSettingsExternalChange`**；儀表盤／復康追蹤於本機設定變更時重載；刪 **`useReloadWhenSystemSettingsChange`**。 |
| 2026-05-01 | 勾選 Seq 13 子項「PT/OT 以 `role_type`、移除顯示名推斷」；補 Seq 5 **`schedulingService.test.ts`**（同日／相鄰日約束）。 |
| 2026-05-01 | Seq 5 程式進度：**`schedulingCore.pickSession`** 二階段選時段（無其他可用時段例外）；**`schedulingCoreSessionGates`**；**`schedulingService.section31.test.ts`**；**「程式行為審查＋PDF 頁碼存檔」** P0 勾選項仍待產品簽核。 |
| 2026-05-01 | Seq 6 程式進度：**`schedulingTargets`** 註解＋**`schedulingTargets.test.ts`**（週目標與補位排序）；**客戶對表裁定** P0 主項仍不勾。 |
| 2026-05-01 | Seq 4 程式進度：**`filterToSubsidizedRehabServiceOnly`**、Orchestration 串接、雙軌隔離單元測試；**逐條對照表＋邊界證據** P0 主項仍不勾。 |
| 2026-05-01 | Seq 7 程式進度：**`filterToDementiaServiceOnly`**、認知軌二階段間隔、`dementiaTrackDryRunService.test.ts`；**演算法欄位與 PDF 對表** P0 主項仍不勾。 |
| 2026-05-01 | Seq 8 程式進度：**`residentCareTrackCohort`**、排班載入／儀表週三警示篩選；**逐欄對表＋正式庫週次** P0 主項仍不勾。 |
| 2026-05-01 | Seq 8／§4.2：儀表盤今日活動時段分軌計數（`countSessionsOnLocalDateByTrack`）。 |
| 2026-05-02 | Seq 8 程式進度：**`mapActiveResidentsToSubsidizedSchedulingResidents`** 擴及儀表週三警示與復康追蹤資助軌快照（與排班載入／乾跑同源）；**逐欄對表** P0 主項仍不勾。 |
| 2026-05-02 | Seq 13 程式進度：儀表 **`subsidizedRehabCohortCount`** 與 KPI 卡片提示對齊 §4.1；**02 逐欄對表** P0 主項仍不勾。 |
| 2026-05-02 | Seq 9 程式進度：**`assessmentDueTaskRepository`** 擴充點（仍待正式 assessment API／P0「資料模型」主項）。 |
| 2026-05-02 | Seq 9 程式進度：Edge **`assessment-due-list`**（與前端 180 天週期雙源同步維護）；P0「正式 assessment 資料模型」主項仍不勾。 |
| 2026-05-02 | Seq 9 程式進度：**`residents.assessment_next_due_date`** migration＋**`assessmentDueDateResolve`**（錨點優先）；P0「Residents UI 維護錨點／全流程」仍不勾。 |
| 2026-05-02 | Seq 9 程式進度：批量匯入／匯出錨點欄、Edge **`residents-create`／`update`** 白名單（**`residentWritePayload`**）、**`residentService`** 更新合併正規化可清空；P0「正式 assessment 資料模型」主項仍不勾。 |
| 2026-05-02 | Seq 22 程式進度：**`assessment_completion_records`** 表＋RLS、**`assessment-completion-records-list`**、**`assessmentCompletionRecordRepository`**、評估管理讀取合併；寫入仍本機，P0「正式 assessment API／寫入閉環」主項仍不勾。 |
| 2026-05-02 | Seq 22 程式進度：**`assessment-completion-records-append`**（**`requireStaffUser`**、本人 **`recorded_by_actor_id`**）、補登雙寫本機＋DB；P0「審計落庫／PDF 對表」主項仍不勾。 |
| 2026-05-02 | Seq 22／12：**`assessment-completion-records-append`** 成功後寫 **`audit_events`**（**`audit_ok`**）；**`docs/assessment-completion-records-contract.md`**；P0「審計與主檔單一交易」仍不勾。 |
