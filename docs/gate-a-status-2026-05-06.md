# Gate A 即時狀態板（2026-05-06）

> 對照：`docs/go-live-checklist.md`、`docs/project-completion-2week-tracker-2026-05-05.md`  
> 取證入口：`docs/gate-a-evidence-capture-2026-05-06.md`  
> 勾選表：`docs/gate-a-manual-evidence-checklist-2026-05-06.md`  
> 自動證據檔名會隨每次取證變更；**固定入口**：`docs/evidence/gate-a-latest.md`（或跑 `npm run gatea:evidence:summary`）
> 判定草案：`docs/gate-a-decision-draft-2026-05-06.md`

## 1) 已完成（系統可驗證）

- [x] `admin-user-role-set` 已部署且 ACTIVE（functions list）。
- [x] CORS 與 `x-idempotency-key` 相容修正已部署。
- [x] migration `20260505160000` 已寫入遠端（Local/Remote 一致）。
- [x] `USER_RBAC_ROLE_SET` 審計可成功落庫（前端畫面與 SQL 已驗）。
- [x] `db:push` 與 `ops:verify` 已執行並留存自動證據檔。
- [x] 證據彙總指令可用：`npm run gatea:evidence:summary`

## 2) 待補（人工取證）

目前完成度（人工證據）：請以 `npm run gatea:evidence:doctor` 為準（預設 12 項；401 已有則至少 1/12）
目前完成度（自動證據面）：請以 `npm run gatea:evidence:summary` 為準（含 `READY`／`NOT_READY`、HTTP 嚴格 ON／OFF、`next command`，以及 doctor／report／snippet／decision ref 指向；`gate-a-latest.md`／`gate-a-report-*.md` 亦含 HTTP 嚴格狀態）

### go-live §1 Auth / RLS
- [ ] admin/staff 登入截圖
- [x] 401 證據（文字檔）已取得（實際路徑見 `docs/evidence/gate-a-latest.md` 之 `401 text` 列，或 `npm run gatea:evidence:summary`）
- [ ] 403 截圖（staff 呼叫 admin-only API）
- [ ] `user_roles` SQL 截圖

### go-live §3 排班閉環
- [ ] 排班儲存成功提示截圖
- [ ] `scheduling_history` SQL 截圖
- [ ] `actor_id` 與登入者一致核對

### go-live §8 審計 / 可見性
- [ ] `USER_RBAC_ROLE_SET` 操作與成功提示截圖
- [ ] `audit_events` SQL 截圖
- [ ] staff/teamlead/admin 可見性差異截圖（3 張）

## 3) Gate A 判定門檻

- [ ] §1 證據齊全
- [ ] §3 證據齊全
- [ ] §8 證據齊全
- [ ] `RES-06` 明確結論（完成或阻塞）

### 判定結論（待填）
- 結論：`待判定`
- 缺口 owner：`FE/BE/QA`
- 預計完成：`2026-05-06 <待填時間> BST`

## 4) 立即下一步（只做這 4 件）

1. 依 `docs/sql/gate-a-evidence-queries-2026-05-06.sql` 跑三段 SQL，截圖存檔。  
2. 執行 `npm run gatea:evidence:http`（若有 `GATEA_STAFF_ACCESS_TOKEN` 可自動產生 403 文字證據）。  
   - 取 token 方式見：`docs/gate-a-evidence-capture-2026-05-06.md` §0.1  
3. 在排班頁做一次「一鍵儲存排班結果」，截圖成功提示。  
4. 將截圖依 `docs/gate-a-manual-evidence-checklist-2026-05-06.md` 檔名存到 `docs/evidence/`；自動引用區會由 `gatea:evidence:all` 或 `gatea:evidence:refresh` 更新。另跑 `npm run gatea:evidence:doctor` 確認是否齊備。

> 完成以上 4 件後，即可由文件面進行 Gate A 判定收斂。

### 4.1 每次收證後快速檢查

`gatea:evidence:http`／`gatea:evidence:http:auth` 內含的 HTTP 請求會把實際狀態寫入 `.txt`；若與預期（無 JWT → 401、staff JWT → 403）不符，會在 **stderr** 印出警告並**仍會落檔**，方便人工複核／附在簽核討論。加上 `--strict-http`（例如 `npm run gatea:evidence:http -- --strict-http`，或 `gatea:evidence:all -- --strict-http`）則上述不符時 **exit 非 0**。亦可設環境變數 **`GATEA_STRICT_HTTP=1`**（或 `true`／`yes`，可寫入 `.env`）。捷徑：`npm run gatea:evidence:http:strict`、`npm run gatea:evidence:http:auth:strict`、`npm run gatea:evidence:all:strict-http`。

```bash
npm run gatea:evidence:summary
```

若輸出仍顯示 `403：（未找到）`，請先執行：

```bash
GATEA_STAFF_ACCESS_TOKEN="<staff token>" npm run gatea:evidence:http
```

或用帳密自動取 token（較省步驟）：

```bash
GATEA_STAFF_EMAIL="<staff email>" \
GATEA_STAFF_PASSWORD="<staff password>" \
npm run gatea:evidence:http:auth
```

一鍵跑 Gate A 自動流程（auto／http／summary／snippet／判定稿／doctor 落檔／四份 markdown 同步）：

```bash
npm run gatea:evidence:all
npm run gatea:evidence:all -- --no-preflight
npm run gatea:evidence:all -- --strict-http
```

收證後一鍵：**全流程 → `prune --apply` → 刷新 `gate-a-latest.md` → 四份 markdown `docs-sync` → 判定稿 `decision-sync`**（其餘旗標如 `--strict-http`、`--no-preflight` 會轉給 `all`；`--keep=N` 僅給 prune，預設 2）：

```bash
npm run gatea:evidence:refresh
npm run gatea:evidence:refresh -- --keep=3 --strict-http
npm run gatea:evidence:refresh:strict-http
```

> `gatea:evidence:all` 預設先執行 `gatea:evidence:preflight --strict`（無 `docs/evidence` 或缺 VITE_* 即中止）；需略過加 `--no-preflight`。
> 加 `--strict-http` 時會轉給 HTTP 取證：401／403 狀態不符預期則該步 exit 非 0（證據檔仍會寫入）。  
> `gatea:evidence:all` 現在也會自動執行判定稿引用同步（decision ref／fill snippet／HTTP 嚴格；等同含 `gatea:evidence:decision-sync`）。
> `gatea:evidence:all` 會先執行 `gatea:evidence:doctor --write`，再以單一批次指令更新證據索引、Daily Log、2week tracker、kickoff checklist 的 Gate A 自動引用區（等同 `npm run gatea:evidence:docs-sync`；亦即個別之 `gatea:evidence:index-sync`／`daily-sync`／`tracker-sync`／`kickoff-sync`）；區塊內含 **HTTP 嚴格取證** ON／OFF（與 `preflight`／`summary` 同源）。如此 tracker／kickoff 內的 **doctor report** 會對應本次剛落檔的報告。
> `gatea:evidence:all` 會先產生單檔收斂快照：`docs/evidence/gate-a-report-*.md`（等同 `npm run gatea:evidence:report`），再同步四份文件，確保引用到當次最新 report。
> `gatea:evidence:all` 亦會更新固定入口：`docs/evidence/gate-a-latest.md`（等同 `npm run gatea:evidence:latest`）。
> `gatea:evidence:doctor --write` 本身不計入 exit code（整體成敗仍以上方 auto/http 等步驟為準）；終端仍會列出缺口清單與 `[saved]` 路徑。

產生 Evidence Index 可貼片段：

```bash
npm run gatea:evidence:fill-snippet
```

產生 Gate A 判定稿引用片段：

```bash
npm run gatea:evidence:decision-ref
```

若要把判定稿引用片段也存成證據檔：

```bash
npm run gatea:evidence:decision-ref -- --write
```

判定稿快速指令（decision-mini 三行：ref／snippet／HTTP 嚴格）：

```bash
npm run gatea:evidence:decision-mini
```

直接自動回填判定稿三行引用：

```bash
npm run gatea:evidence:decision-sync
```

若已在 `.env` 設好 `GATEA_STAFF_EMAIL` / `GATEA_STAFF_PASSWORD`，可直接一鍵：

```bash
set -a && source .env && set +a && npm run gatea:evidence:http:auth && npm run gatea:evidence:summary
```

僅補 `user-role-admin` 可選登入 E2E（本機實機建議）：

```bash
npm run test:e2e:auth:user-role-admin
```

快速檢查目前還缺哪些 Gate A 證據：

```bash
npm run gatea:evidence:doctor
```

> doctor 報告（含 `--write` 落檔）開頭會列出 **HTTP 嚴格取證** ON／OFF；`gatea:evidence:fill-snippet`／`gatea:evidence:decision-ref` 產物亦含同一快照列。

快速判斷是否可進入 Gate A 判定（READY/NOT_READY）：

```bash
npm run gatea:evidence:ready
```

下一步建議（依目前缺口自動給命令）：

```bash
npm run gatea:evidence:next
```

取證前環境與證據目錄診斷（不列印密值，僅 SET／MISSING）：

```bash
npm run gatea:evidence:preflight
npm run gatea:evidence:preflight -- --strict
```

列出目前倉庫內所有 **`gatea:evidence:*`** npm 指令（自 `package.json` 讀取，免文件漏列）：

```bash
npm run gatea:evidence:list
```

> `preflight` 會列出「HTTP 嚴格取證」ON／OFF（對應 `--strict-http` 或 `GATEA_STRICT_HTTP`）。

> `--strict`：若不存在 `docs/evidence`、或 `VITE_SUPABASE_URL`／`VITE_SUPABASE_ANON_KEY` 合併後仍缺，則以非 0 exit（不等同 Gate A READY；全流程關卡仍用 `gatea:evidence:gate`）。

> `gatea:evidence:next` 與 `gatea:evidence:summary` 內之「next」行，會依 `{ .env ∪ process.env }` 判斷：有 staff 帳密則建議 `gatea:evidence:http:auth`；僅有 `GATEA_STAFF_ACCESS_TOKEN` 則建議 `gatea:evidence:http`。

規則實作單點：`scripts/gate-a-ready-core.mjs`（`gatea:evidence:latest`、`gatea:evidence:report`、終端 READY 輸出共用）。

嚴格模式（缺項時回傳非 0）：

```bash
npm run gatea:evidence:ready -- --strict
```

關卡模式（簡短輸出，NOT_READY 即非 0）：

```bash
npm run gatea:evidence:gate
```

另存報告到 `docs/evidence/`：

```bash
npm run gatea:evidence:doctor -- --write
```

更新固定入口（便於貼單一連結）：

```bash
npm run gatea:evidence:latest
```

僅同步證據索引／日誌／追蹤板／啟動清單（與 `gatea:evidence:all` 內同一批次；建議先跑一次 `doctor --write` 再執行）：

```bash
npm run gatea:evidence:docs-sync
```

清理 `docs/evidence` 內舊的自動快照（預設 dry-run，實際刪除需 `--apply`）：

```bash
npm run gatea:evidence:prune
npm run gatea:evidence:prune -- --keep=2 --apply
```
