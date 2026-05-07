# Gate A 證據回填模板（2026-05-06）

> 使用方式：完成 `docs/gate-a-evidence-capture-2026-05-06.md` 後，將本檔內容中的 `<...>` 取代並貼回  
> `docs/go-live-checklist.md`、`docs/project-completion-evidence-index-2026-05.md`、`docs/project-completion-daily-log-2026-05.md`。  
> 腳本產生之 401/403 文字檔與 `gate-a-*.md` 實際路徑以 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:summary`** 彙總；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**，見 **`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段）為準；取證前可先 **`npm run gatea:evidence:preflight`**（嚴格：**`npm run gatea:evidence:preflight:strict`**）。本檔 **A)** 僅列建議截圖檔名。  
> **全案收尾與證據留痕**：見 **`docs/go-live-checklist.md`** 開首 **全案收尾與證據留痕**（**`README.md`**「專案收尾」、**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））。  
> **收證指令／旗標細部**：**`docs/gate-a-status-2026-05-06.md`** **§5**、**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`**。
> 多數 **`gatea:evidence:*`** 終端 stdout 末兩行 blockquote 維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**；**`README.md`**「Gate A 終端頁尾（維護）」）。

## A) 截圖檔名建議（統一命名）

- `gateA-d2-admin-login-2026-05-06.png`
- `gateA-d2-staff-login-2026-05-06.png`
- `gateA-d2-401-2026-05-06.png`
- `gateA-d2-403-admin-user-role-set-2026-05-06.png`
- `gateA-d2-user-roles-sql-2026-05-06.png`
- `gateA-d3-scheduling-save-success-2026-05-06.png`
- `gateA-d3-scheduling-history-sql-2026-05-06.png`
- `gateA-d4-user-rbac-role-set-ui-2026-05-06.png`
- `gateA-d4-audit-events-sql-2026-05-06.png`
- `gateA-d4-rls-staff-2026-05-06.png`
- `gateA-d4-rls-teamlead-2026-05-06.png`
- `gateA-d4-rls-admin-2026-05-06.png`

## B) SQL 結果摘要模板（可貼日誌）

### go-live §1 `user_roles`
- 查詢時間：`<YYYY-MM-DD HH:mm TZ>`
- 筆數：`<N>`
- 近期角色樣本：`<email:role, email:role ...>`
- 異常：`<無 / 說明>`

### go-live §3 `scheduling_history`
- 查詢時間：`<YYYY-MM-DD HH:mm TZ>`
- 最新批次 `batch_id`：`<...>`
- 最新 `actor_id`：`<...>`
- 最新 `created_at`：`<...>`
- 異常：`<無 / 說明>`

### go-live §8 `audit_events`
- 查詢時間：`<YYYY-MM-DD HH:mm TZ>`
- 最新 `USER_RBAC_ROLE_SET`：`<id / occurred_at>`
- `entity_type='Auth'` 可查：`<是/否>`
- 異常：`<無 / 說明>`

## C) 401 / 403 摘要模板（可貼 Evidence Index 備註）

- 401 驗證：
  - 路徑：`<function path>`
  - 方法：`<GET/POST>`
  - 結果：`HTTP 401`
  - 證據：`<截圖檔名>`

- 403 驗證：
  - 路徑：`/functions/v1/admin-user-role-set`
  - 方法：`POST`
  - 帳號：`<staff email>`
  - 結果：`HTTP 403`
  - 證據：`<截圖檔名>`

## D) 回填文案模板（可直接貼）

### D.1 `docs/project-completion-evidence-index-2026-05.md`（D2/D3/D4 備註）

```md
D2 備註：
- admin/staff 登入證據已補（`<admin-login-png>`、`<staff-login-png>`）
- 401/403 證據已補（`<401-png>`、`<403-png>`）
- user_roles SQL 證據：`<user-roles-sql-png>`

D3 備註：
- 排班閉環成功提示：`<scheduling-save-success-png>`
- scheduling_history SQL：`<scheduling-history-sql-png>`
- actor_id 與本次登入者一致：`<是/否>`

D4 備註：
- USER_RBAC_ROLE_SET 審計落庫：`<user-rbac-ui-png>`、`<audit-events-sql-png>`
- RLS 差異抽測：staff / teamlead / admin 截圖已補（`<staff-png>`、`<teamlead-png>`、`<admin-png>`）
```

### D.2 `docs/project-completion-daily-log-2026-05.md`（追加到 2026-05-06）

```md
### 補充：Gate A 取證完成（YYYY-MM-DD HH:mm TZ）
- go-live §1：完成 admin/staff 登入、401/403、user_roles SQL 取證。
- go-live §3：完成排班閉環與 scheduling_history SQL 取證。
- go-live §8：完成 USER_RBAC_ROLE_SET 審計落庫與 RLS 差異（staff/teamlead/admin）取證。
- 證據檔名：<逐項列出>
```

## E) Gate A 判定模板

- 判定：`可通過 / 有條件通過 / 不通過`
- 依據：
  - §1：`<完成/未完成>`
  - §3：`<完成/未完成>`
  - §8：`<完成/未完成>`
- 未完成缺口（若有）：`<...>`
- Owner / ETA：`<...>`
