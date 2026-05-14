# Gate A 判定稿（草案）— 2026-05-06

> 對照：`docs/project-completion-2week-tracker-2026-05-05.md`、`docs/go-live-checklist.md`、`docs/project-completion-evidence-index-2026-05.md`、`docs/gate-a-manual-evidence-checklist-2026-05-06.md`  
> **全案收尾與證據留痕**：見 **`docs/go-live-checklist.md`** 開首 **全案收尾與證據留痕**（**`README.md`**「專案收尾」、**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））。序號主檔修訂日誌 **`docs/pdf-sequenced-gap-checklist-revision-log.md`** 之 **Gate A／stdout** 細列歸檔見 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**（與主日誌 **Archive gate-a-stdout-2026-05-09** 列並讀）。  
> **收證指令／旗標細部**：**`docs/gate-a-status-2026-05-06.md`** **§5**、**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`**；**人工／strict-http／keep=1**：**`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（**`docs/go-live-checklist.md`** §0.1）。
> 多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（第二行併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**；**`README.md`**「Gate A 終端頁尾（維護）」）。

## 判定建議

- 目前建議：`有條件通過`（待補人工截圖證據後轉 `可通過`）

## 最新自動證據引用（decision-mini：ref／snippet／HTTP 嚴格；末第四行 **`gateAAutoRefClosingHintLine()`** 速查）

```bash
npm run gatea:evidence:decision-mini
```

> 將輸出直接貼到本段下方，作為最新留痕引用（含 HTTP 嚴格 ON／OFF）；或使用 `npm run gatea:evidence:decision-sync` 自動回填。  
> 自動證據主檔彙總入口：`docs/evidence/gate-a-latest.md`（檔內 **Next Command** 與 **`preflight:strict`** 並列；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**，見 **`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段）。下列 `decision ref`／`fill snippet`／`HTTP 嚴格取證` 前三行由 `gate-a-sync-decision-draft.mjs` 於 `refresh`／`all` 時覆寫；末行與 **`scripts/gate-a-markdown-footer.mjs`** 之 **`gateAAutoRefClosingHintLine()`** 一致（全案收尾／**status** **§5**／**commands-appendix**／**人工勾選表**）。
- decision ref：`docs/evidence/gate-a-decision-ref-20260514-213804.md`
- fill snippet：`docs/evidence/gate-a-fill-snippet-20260514-213804.md`
- HTTP 嚴格取證：OFF
- **全案收尾與指令速查**：`docs/go-live-checklist.md`（開首長鏈）；`docs/gate-a-status-2026-05-06.md` **§5**／`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`；人工／strict-http／keep=1：`docs/gate-a-manual-evidence-checklist-2026-05-06.md` 開首。

## 依據（已完成）

- [x] `admin-user-role-set` 已部署且 ACTIVE（functions list）
- [x] CORS + `x-idempotency-key` 已修正並重佈
- [x] migration `20260505160000` 已補齊至遠端（Local/Remote 一致）
- [x] `USER_RBAC_ROLE_SET` 流程可成功執行
- [x] `db:push` / `ops:verify` 已留存自動證據（現況路徑以 `docs/evidence/gate-a-latest.md`（檔尾四行：**`gateALatestMarkdownFooterLines`**，見 **`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段）及 `npm run gatea:evidence:summary` 為準）

## 依據（待補人工證據）

### go-live §1（Auth/RLS）
- [ ] admin/staff 登入截圖
- [x] 401 證據（文字）：路徑見 `docs/evidence/gate-a-latest.md`（`401 text` 列；檔尾定義見 **`gateALatestMarkdownFooterLines`**／**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段）
- [ ] 403 截圖（staff 呼叫 admin-only API）
- [ ] `user_roles` SQL 截圖

### go-live §3（排班閉環）
- [ ] 排班儲存成功提示截圖
- [ ] `scheduling_history` SQL 截圖
- [ ] `actor_id` = 本次登入者 UUID 核對

### go-live §8（審計）
- [ ] `USER_RBAC_ROLE_SET` UI 成功截圖
- [ ] `audit_events` SQL 截圖
- [ ] staff/teamlead/admin 可見性差異截圖（3 張）

## 風險評估

- 目前主要風險：證據留痕未齊，非功能阻塞。
- 技術風險：低（部署與資料庫一致性已完成）。
- 驗收風險：中（取證若延遲，影響 D5 Gate A 判定節奏）。

## 收斂條件（達成即轉可通過）

1. 補齊 5 張核心圖：`user_roles SQL`、`scheduling_history SQL`、`audit_events SQL`、`403`、`排班儲存成功`。  
2. 補齊 RLS 三角色可見性（staff/teamlead/admin）截圖。  
3. 回填 Evidence Index 與 Daily Log 並勾選 go-live 對應項。  

## 決議欄（待 TL/QA）

- 最終判定：`<可通過 / 有條件通過 / 不通過>`
- 決議時間：`<YYYY-MM-DD HH:mm TZ>`
- TL：`<name>`
- QA：`<name>`
