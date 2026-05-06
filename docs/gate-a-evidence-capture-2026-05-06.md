# Gate A 取證速跑（2026-05-06）

> 目標：一次補齊 `go-live` 的 §1（Auth/RLS）、§3（排班閉環）、§8（審計/RLS 可見性）證據。  
> 對照：`docs/go-live-checklist.md`、`docs/project-completion-2week-tracker-2026-05-05.md`、`docs/project-completion-evidence-index-2026-05.md`。
> SQL 一鍵查詢：`docs/sql/gate-a-evidence-queries-2026-05-06.sql`
> 人工勾選表：`docs/gate-a-manual-evidence-checklist-2026-05-06.md`

## 0) 前置確認（已完成）

- [x] `npm run db:push` 已完成（含 `20260505160000`）。
- [x] `npm run ops:verify` 已完成（migration Local/Remote 一致；functions ACTIVE）。
- [x] 可選：`npm run gatea:evidence:auto` 產生自動證據檔（`docs/evidence/gate-a-auto-evidence-*.md`）。
- [x] 可選：`npm run gatea:evidence:http` 產生 401 證據；若設定 `GATEA_STAFF_ACCESS_TOKEN` 會一併產生 403 證據。
- [x] 可選：`npm run gatea:evidence:http:auth` 以 `GATEA_STAFF_EMAIL/PASSWORD` 先換 token，再自動產生 401/403 證據。
- [x] 可選：`npm run gatea:evidence:doctor` 檢查 `docs/evidence` 內人工截圖／401/403 是否齊備；加 `--write` 可另存報告檔（`npm run gatea:evidence:all` 會於同步 markdown 前先 `--write`）。
- [x] 可選：`npm run gatea:evidence:docs-sync` 只更新四份收尾 markdown 的 Gate A 自動引用區（與 `gatea:evidence:all` 內同一批次邏輯；需已存在最新 doctor 檔時再跑，或先跑 `doctor --write`）。
- [x] 可選：`npm run gatea:evidence:summary`（401/403/auto 進度與可否判定 `READY`／`NOT_READY` 一行）。
- [x] 可選：`npm run gatea:evidence:ready`；加 `--strict` 缺項時 exit 非 0（CI／本機 gate）。
- [x] 可選：`npm run gatea:evidence:next`（依目前缺口自動給下一步命令）。
- [x] 可選：`npm run gatea:evidence:gate`（NOT_READY 直接 exit 非 0，適合作為關卡）。
- [x] 可選：`npm run gatea:evidence:latest` 刷新固定入口 `docs/evidence/gate-a-latest.md`。
- [x] 判定規則單點：`scripts/gate-a-ready-core.mjs`。

### 0.1 取得 `GATEA_STAFF_ACCESS_TOKEN`（快速法）

1. 用 **staff** 帳號登入 STARCARE（同一瀏覽器）。
2. 開 DevTools Console，貼上：

```js
const key = Object.keys(localStorage).find((k) => k.includes('auth-token'))
const raw = key ? localStorage.getItem(key) : null
const token = raw ? JSON.parse(raw)?.access_token : null
console.log(token ?? 'NO_TOKEN')
```

3. 複製輸出 token 後在終端執行：

```bash
GATEA_STAFF_ACCESS_TOKEN="<貼上token>" npm run gatea:evidence:http
```

4. 產生 `...403...txt` 後，將檔名回填到 Evidence Index。

### 0.2 本機補測（僅 user-role-admin）

若需快速補 `user-role-admin` 實機測試證據，可先執行：

```bash
npm run test:e2e:auth:user-role-admin
```

> 備註：本對話 sandbox 內 Chromium 可能 SIGSEGV，請以本機終端結果為準。

## 1) go-live §1：Auth / RLS 初檢（約 3 分鐘）

### 1.1 角色登入證據
- [ ] 使用 `admin` 登入並截圖（左下角帳號 + `角色：ADMIN`）。
- [ ] 使用 `staff` 登入並截圖（左下角帳號 + `角色：STAFF`）。

### 1.2 401 / 403 證據
- [ ] 401：登出後直接呼叫受保護 Edge（Network 或 curl）取得 `401`。
- [ ] 403：以 `staff` 呼叫僅 admin 可用 `admin-user-role-set` 取得 `403`。

建議 curl（將 `<...>` 代入）：

```bash
curl -i -X POST "<SUPABASE_URL>/functions/v1/admin-user-role-set" \
  -H "Content-Type: application/json" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <STAFF_ACCESS_TOKEN>" \
  -d '{"targetEmail":"someone@example.com","role":"staff"}'
```

### 1.3 `user_roles` SQL
- [ ] 在 SQL Editor 執行並截圖：

```sql
select
  ur.user_id,
  ur.role,
  au.email,
  ur.created_at
from public.user_roles ur
left join auth.users au on au.id = ur.user_id
order by ur.created_at desc
limit 20;
```

## 2) go-live §3：排班閉環（約 3 分鐘）

- [ ] 在前端完成一次：啟動排班 → 一鍵儲存成功提示。
- [ ] 在 SQL Editor 執行並截圖：

```sql
select
  id,
  resident_id,
  session_id,
  staff_id,
  pass,
  actor_id,
  batch_id,
  created_at
from public.scheduling_history
where is_deleted = false
order by created_at desc
limit 10;
```

驗收重點：
- 最新列 `actor_id` 應對應本次登入者。
- `batch_id` 與前端最近儲存批次一致（可對照審計 detail）。

## 3) go-live §8：審計抽測（約 4 分鐘）

### 3.1 審計落庫
- [ ] 在 `#user-role-admin` 完成一次角色變更（可先用測試帳號）。
- [ ] 審計區可見 `USER_RBAC_ROLE_SET`。
- [ ] SQL Editor 查詢並截圖：

```sql
select id, action, entity_type, entity_id, actor_id, occurred_at
from public.audit_events
where is_deleted = false
order by occurred_at desc
limit 20;
```

### 3.2 RLS 可見性差異（staff / teamlead/admin）
- [ ] `staff`：僅見 `actor_id = 本人` 事件（截圖）。
- [ ] `teamlead`：可見全院 `is_deleted=false` 事件（截圖）。
- [ ] `admin`：可見全院 `is_deleted=false` 事件（截圖）。

## 4) 回填文件（完成後 2 分鐘）

1. `docs/go-live-checklist.md`  
   - 將 §1、§3、§8 對應勾選改為完成（僅在證據齊全時）。
2. `docs/project-completion-evidence-index-2026-05.md`  
   - 在 D2 / D3 / D4 列填入 SQL 截圖與操作證據連結。
3. `docs/project-completion-2week-tracker-2026-05-05.md`  
   - 更新 D2 / D3 / D4 狀態（`doing` → `done` 或保留 `doing` 並寫明缺口）。
4. 可直接套用模板：`docs/gate-a-evidence-fill-template-2026-05-06.md`

## 5) Gate A 判定口徑

- 若 §1、§3、§8 都有可追溯證據，則 Gate A 可進入「可判定」狀態。
- 若缺任一項，Gate A 維持 `doing`，並在阻塞欄寫明缺口與 owner。
