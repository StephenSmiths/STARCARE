# STARCARE 院舍排班政策 Edge Function 契約

> **對照**：**`docs/business-logic.md`** §0（**`.cursorrules`** §3）；序號主檔 **`docs/pdf-sequenced-gap-checklist.md`** Seq **29**；PRD **`docs/system-settings-policy-prd-2026-05-09.md`**；資料表 **`docs/system-settings-policy-schema-2026-05-09.md`**；migration **`20260509153000`**（表）＋**`20260509153100`**（RLS）；系統設定對照骨架 **`docs/seq29-system-settings-pdf02-traceability.md`**、**`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**。  
> **既有讀規則**：**`scheduling-rules-get`** 以 **`public.scheduling_rules`** 為基準列；若 **`facility_scheduling_policy_versions`** 於「現在」有適用列：**`groupCapacityLimit`** 以 **`facility_policy_numeric_limits.group_participant_cap`**（與 **`scheduling-policy-current-get`** 之 **`numericLimits.groupParticipantCap`** 同源）覆寫；**`therapistGroupSessionsDailyCap`**／**`assistantGroupSessionsDailyCap`** 取自同一 **`numericLimits`**（**`public.scheduling_rules`** 無對應欄；無版本時與 **`loadSchedulingPolicyBundle`** 骨架預設對齊）；若 **`facility_policy_subsidized_tier`** 至少一筆，**`enableSubsidizedRehab`** 取自「任一 **`enabled`**」；若存在 **`facility_policy_dementia_core`** 列，**`enableDementiaCare`** 取自該列 **`enabled`**；**`allowScTherapistOnly`** 為 **`scheduling_rules.allow_sc_therapist_only` OR** 任一資助階／認知核心之 **`special_care_therapist_only`**（PRD §7 **B** 過渡）。**`dailySameServiceLimit`**、**`minGapDaysSameService`**、**`scPriorityEnabled`** 等仍取自 **`scheduling_rules`**；其餘與版本表之完全對齊見 **`docs/adr-0001-scheduling-logic-placement.md`** 附註。

> **前端 demo 煙霧（無 Supabase）**：**`npm run test:e2e:system-settings-policy`**、**`npm run test:e2e:smoke`**（**`hash #system-settings`**）；**UAT** **二之一**（段末 **工程維護互鏈**）：**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`**；細目 **`docs/seq29-system-settings-pdf02-traceability.md`** 第 4 節、**`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**。

**全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引）；**`docs/project-completion-*.md`**；Gate A **`docs/evidence/gate-a-latest.md`**（**Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:preflight:strict`**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（**`docs/go-live-checklist.md`** §0.1、strict-http／**`npm run gatea:evidence:refresh:strict-http`**／**`--keep=1`**）。

## 1. 目標與範圍

- 定義 **PDF 02【16】** 院舍政策（**多表**＋**`effective_from`** 版本化）之 **HTTP 契約**；DB 欄位以 **snake_case** 為準，回應 JSON 以 **camelCase** 為準（與現行 **`scheduling-rules-get`** 一致）。
- **讀取**：已登入 **staff／teamlead／admin**（與 **`guardStaffUser`** 同級之 JWT 驗證）。
- **寫入**：僅 **teamlead／admin**（**`guardTeamLeadOrAdmin`** 或 **`requireTeamLeadOrAdmin`**，與院友／員工匯入相同）。
- **軟刪除**：政策版本列以 **`status`** 流轉，**嚴禁硬刪除**版本列（與專案資料完整性原則一致）。

## 2. 共用驗證規則（客戶定案）

| 規則 | 說明 |
|------|------|
| **R‑effective** | **`effective_from`** 儲存時須 **`>=` 伺服器收到請求時之現在**（禁止「今天以前」）；**允許當日立即生效**。 |
| **R‑overlap** | 同一 **`facility_id`** 下，已提交版本之 **`[effective_from, effective_until)`** 區間 **不得重疊**；至多一筆 **`status = 'active'`**。 |
| **R‑promote** | 新版到點生效時，須將舊版 **`effective_until`** 寫入並標 **`superseded`**，新版標 **`active`**（或由讀取層惰性結算—實作須固定一種並文件化）。 |

## 3. 回應物件：`SchedulingPolicyBundle`（邏輯合併視圖）

以下為 **GET 成功 200** 之 JSON 形狀（欄位可依實作增補；**`legacySchedulingRules`** 過渡期可併附現行 **`scheduling-rules-get`** 之對應欄位）。

```json
{
  "facilityId": "facility-main",
  "policyVersion": {
    "id": "uuid",
    "effectiveFrom": "2026-05-10T02:00:00.000Z",
    "effectiveUntil": null,
    "status": "active",
    "changeSummary": "調整午休時段",
    "createdAt": "2026-05-09T10:00:00.000Z"
  },
  "nonTherapySlots": [
    { "slotKind": "LUNCH", "timeStart": "12:30", "timeEnd": "13:30" }
  ],
  "numericLimits": {
    "therapistGroupSessionsDailyCap": 8,
    "assistantGroupSessionsDailyCap": 8,
    "groupParticipantCap": 6
  },
  "fixedActivities": [],
  "subsidizedTiers": [],
  "subsidizedRoleOfferings": [],
  "subsidizedPassOrder": [],
  "dementiaCore": null,
  "dementiaRoleOfferings": [],
  "legacySchedulingRules": null
}
```

**`slotKind` 固定字串**：`LUNCH`｜`MORNING_DOC`｜`AFTERNOON_DOC`｜`OTHER`｜`SHIFT_PREP_BLOCK`。  
**`fundingTier`（資助列）**：`GradeA_Subsidized`｜`Voucher`｜`Private`（與院友 **`funding_type`** 對齊）。

## 4. Edge Function 端點契約

### 4.1 GET `/functions/v1/scheduling-policy-current-get?facilityId={id}`

- **用途**：回傳 **`asOf = now()`** 時應適用之 **`SchedulingPolicyBundle`**（客戶 R3：日常排班只看**目前生效**）。  
- **授權**：**`guardStaffUser`**（與 **`scheduling-rules-get`** 一致）。  
- **參數**：**`facilityId`** 可省略，預設 **`facility-main`**。  
- **成功**：`200 + SchedulingPolicyBundle`（若尚無任何版本列，允許 **`policyVersion: null`** 且 **`legacySchedulingRules`** 由 **`scheduling_rules`** 表補齊—實作選項見 PRD §7）。  
- **錯誤**：`401`／`403` 未登入或 JWT 無效。

### 4.2 GET `/functions/v1/scheduling-policy-at-get?facilityId={id}&asOf={ISO8601}`

- **用途**：回傳 **`asOf`** 瞬時應適用之政策 bundle（客戶 R4：歷史報表依排班日回溯版本）。  
- **授權**：同 **§4.1**。  
- **參數**：**`asOf`** 必填，須為合法 ISO 8601；**`facilityId`** 同 **§4.1**。  
- **成功**：`200 + SchedulingPolicyBundle`（若該日無版本，回傳 **`policyVersion: null`** 並附 **`legacySchedulingRules`** 或 **`404`**—須與報表產品約定一致後定稿）。  
- **錯誤**：`400`（`asOf` 非法）、`401`／`403`。

### 4.2a GET `/functions/v1/scheduling-policy-versions-list?facilityId={id}&limit={n}`

- **用途**：回傳該院舍 **`facility_scheduling_policy_versions`** 頭表摘要列（依 **`effective_from`** 新→舊），供 **PRD §4**「已排程／歷程」檢視；**不**含子表明細。  
- **授權**：同 **§4.1**（**`guardStaffUser`**）。  
- **參數**：**`facilityId`** 可省略（預設 **`facility-main`**）；**`limit`** 可選 **1～100**（預設 **50**）。  
- **成功**：`200 + { "facilityId": "…", "versions": [ { "id", "effectiveFrom", "effectiveUntil", "status", "changeSummary", "createdAt" } ] }`（欄位 camelCase，與 **`SchedulingPolicyBundle.policyVersion`** 同形）。  
- **錯誤**：`401`／`403`、`404`（院舍不存在）。

### 4.3 POST `/functions/v1/scheduling-policy-version-validate`

- **用途**：校驗即將建立之版本草稿（**R‑effective**、子表欄位解析、Pass 恰好三筆、**P2 子表網格完整性** 等），**不寫入**正式版本列。  
- **授權**：**`guardTeamLeadOrAdmin`**。  
- **請求 Body（camelCase 白名單）**：
  - **`facilityId`**：`string`  
  - **`effectiveFrom`**：`string`（ISO 8601）  
  - **`changeSummary`**：`string`（必填；對應客戶「變更原因／備註」）  
  - **`confirmToken`**：可選；若前端已做二次確認，可傳固定字串 **`"CONFIRMED"`**（實作可改為單次 nonce，第二階段強化）  
  - **`nonTherapySlots`**、**`numericLimits`**、**`fixedActivities`**、**`subsidizedTiers`** 等：與 **`SchedulingPolicyBundle`** 內層形狀一致之陣列／物件  
- **子表網格（與前端 `validateSystemSettings`／`isValid*` 對齊）**：**`subsidizedTiers`**、**`subsidizedRoleOfferings`**、**`dementiaRoleOfferings`** 可為 **空陣列**（不寫入對應子表）；若 **長度大於 0**，則須分別為 **3** 筆、**48** 筆、**8** 筆且鍵不重複。若帶 **`dementiaCore`** 物件，則 **`weeklyMinSessions`** 須為 **非負整數**。實作：**`supabase/functions/_shared/schedulingPolicyDraftCompleteness.ts`**（由 **`schedulingPolicyDraftValidate.ts`** 於 **`parseDraftChildArrays`** 之後呼叫）。  
- **成功**：`200 + { ok: true, errors: [], normalized: SchedulingPolicyBundle }`  
- **失敗**：`200 + { ok: false, errors: [ { "code": "...", "message": "..." } ] }` 或 `400`（請求 JSON 無法解析）。欄位枚舉／時段／Pass 等解析錯誤碼見 **`schedulingPolicyDraftMappers.ts`**；網格完整性錯誤碼見 **§5.2**。

### 4.4 POST `/functions/v1/scheduling-policy-version-commit`

- **用途**：寫入 **`facility_scheduling_policy_versions`** 及子表；觸發 **`active`／`superseded`** 流轉與 **`audit-trail-append`**（或等效審計）。  
- **授權**：**`requireTeamLeadOrAdmin`**（寫入）。  
- **請求 Body**：須與 **`validate`** 通過之 **`normalized`** 相同形狀，並含 **`idempotencyKey`**（字串，建議 UUID）以符合 Seq 11 防抖／防重入。  
- **成功**：`201 + { ok: true, policyVersionId: "uuid" }`  
- **錯誤**：`400`（**JSON 無法解析**、**`idempotencyKey` 缺失**、**`validateSchedulingPolicyDraft` 失敗**時回 **`{ ok: false, errors: [...] }`**，與 **`validate`** 端點錯誤物件同形但 **HTTP 為 400**）、`401`／`403`、`409`（**`idempotencyKey`** 重複且已成功提交）。

## 5. 錯誤碼建議

### 5.1 HTTP 層

| HTTP | 情境 |
|------|------|
| `400` | 請求 JSON 無法解析等 |
| `401` | 未帶有效 JWT |
| `403` | 角色非 staff／teamlead／admin（讀）或 非 teamlead／admin（寫） |
| `404` | 院舍不存在或無可套用政策（若選擇嚴格模式） |
| `409` | 重複 **`idempotencyKey`** 或樂觀鎖衝突 |
| `501` | （僅限占位部署期）尚未接軌 DB |

### 5.2 `scheduling-policy-version-validate` 應用層（`200` 且 `ok:false` 時 `errors[].code`）

| `code` | 說明（摘要） |
|--------|----------------|
| `BAD_JSON`／`MISSING_FIELD`／`BAD_EFFECTIVE` | 請求體結構或必填欄位 |
| `R_EFFECTIVE` | **`effectiveFrom`** 早於伺服器現在 |
| `FACILITY`／`FACILITY_NOT_FOUND` | 院舍查詢失敗或不存在 |
| `R_OVERLAP` | 與既有版本區間重疊 |
| `BAD_TIER_COUNT` | **`subsidizedTiers`** 非空但筆數≠3 |
| `BAD_ROLE_OFFER_COUNT` | **`subsidizedRoleOfferings`** 非空但筆數≠48 |
| `BAD_ROLE_OFFER_DUP` | 48 筆但 **(fundingTier, roleType, slotVariant)** 重複 |
| `BAD_DEM_ROLE_COUNT` | **`dementiaRoleOfferings`** 非空但筆數≠8 |
| `BAD_DEM_ROLE_DUP` | 8 筆但 **(roleType, slotVariant)** 重複 |
| `BAD_DEM_CORE` | **`dementiaCore.weeklyMinSessions`** 須為 **非負整數** |
| （其餘） | 列枚舉、時段、Pass 等見 **`schedulingPolicyDraftMappers.ts`**（如 **`BAD_SLOT`**、**`BAD_PASS_ORDER`**、**`BAD_FUNDING`**、**`BAD_ROLE`**（資助／認知列上下文不同）） |

## 6. 部署與 CI

- **實作完成後**：將 **`scheduling-policy-current-get`**、**`scheduling-policy-at-get`**、**`scheduling-policy-versions-list`**、**`scheduling-policy-version-validate`**、**`scheduling-policy-version-commit`** 納入 **`package.json`** 之 **`ops:deploy:all`**（與 **`docs/supabase-deploy-runbook.md`** §2 並讀）。  
- **migration**：先執行 **`npx supabase db push`** 套用 **`20260509153000_facility_scheduling_policy_versioned_skeleton.sql`** 與 **`20260509153100_facility_scheduling_policy_versioned_rls.sql`**（單檔 ≤200 行，拆表與 RLS）。

## 7. 修訂紀錄

| 日期 | 說明 |
|------|------|
| 2026-05-09 | 初版：四端點契約（嗣後擴為五支 Edge，見 **2026-05-12** 列）、Bundle 形狀、客戶 R1～R4 映射、部署註記。 |
| 2026-05-12 | 增 **§4.2a `scheduling-policy-versions-list`**（版本列唯讀）；部署清單五支。 |
| 2026-05-13 | 開首補 **前端 demo 煙霧**（**`test:e2e:system-settings-policy`**／**`test:e2e:smoke`**、**UAT** **二之一**、**seq29** 第 4 節）。 |
| 2026-05-09 | **§4.3**／**§5**／**§4.4**：**`schedulingPolicyDraftCompleteness`** 與 **`BAD_*`** 碼；**`commit`** 驗證失敗時 **HTTP 400**＋**`{ ok: false, errors }`**。 |
| 2026-05-15 | 開首 **UAT** **二之一** 補括註「段末 **工程維護互鏈**」。 |
| 2026-05-09 | 開首 **對照**／**前端 demo 煙霧** 併 **`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**（與 **2026-05-13** 列並讀）。 |
| 2026-05-09 | 開首 **既有讀規則**：**`scheduling-rules-get`** 於生效政策存在時以 P1 **`group_participant_cap`** 覆寫 **`groupCapacityLimit`**（PRD §7 **B**）。 |
| 2026-05-09 | 開首 **既有讀規則** 延伸：**`enableSubsidizedRehab`**／**`enableDementiaCare`**／**`allowScTherapistOnly`** 與資助階／認知核心子表合併（**`scheduling-rules-get`** 實作）。 |
| 2026-05-09 | 開首 **既有讀規則**：**`therapistGroupSessionsDailyCap`**／**`assistantGroupSessionsDailyCap`** 併 **`numericLimits`**（**`scheduling-rules-get`**）。 |
