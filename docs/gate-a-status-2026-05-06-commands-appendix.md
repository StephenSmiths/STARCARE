# Gate A 收證指令與旗標速查（2026-05-06）

> **對照**：主狀態板 **`docs/gate-a-status-2026-05-06.md`**；取證速跑 **`docs/gate-a-evidence-capture-2026-05-06.md`**；固定入口 **`docs/evidence/gate-a-latest.md`**（檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**，見下文 **`latest`** 段）。

## 1) 每次收證後快速檢查

`gatea:evidence:http`／`gatea:evidence:http:auth` 內含的 HTTP 請求會把實際狀態寫入 `.txt`；若與預期（無 JWT → 401、staff JWT → 403）不符，會在 **stderr** 印出警告並**仍會落檔**，方便人工複核／附在簽核討論。加上 `--strict-http`（例如 `npm run gatea:evidence:http -- --strict-http`，或 `gatea:evidence:all -- --strict-http`）則上述不符時 **exit 非 0**。亦可設環境變數 **`GATEA_STRICT_HTTP=1`**（或 `true`／`yes`，可寫入 `.env`）。捷徑：`npm run gatea:evidence:http:strict`、`npm run gatea:evidence:http:auth:strict`、`npm run gatea:evidence:all:strict-http`。

> **終端 stdout 頁尾**：`gatea:evidence:http` 末段附 **全案收尾**／**§5** 兩行 blockquote（`scripts/gate-a-http-evidence.mjs`）。`gatea:evidence:http:auth` 以 **`stdio: inherit`** 委派子程序，頁尾由子程序輸出、**不重複列印**（`scripts/gate-a-http-evidence-auth.mjs`）；字串權威與例外見 `scripts/gate-a-markdown-footer.mjs` 檔首 **Export 契約**。

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

> `gatea:evidence:all` 預設先執行 `gatea:evidence:preflight:strict`（等同 `preflight -- --strict`；無 `docs/evidence` 或缺 VITE_* 即中止）；需略過加 `--no-preflight`。
> 加 `--strict-http` 時會轉給 HTTP 取證：401／403 狀態不符預期則該步 exit 非 0（證據檔仍會寫入）。  
> `gatea:evidence:all` 現在也會自動執行判定稿引用同步（decision ref／fill snippet／HTTP 嚴格／**全案收尾速查**末行；等同含 `gatea:evidence:decision-sync`，與 `gatea:evidence:decision-mini` 四行 stdout 一致）。
> `gatea:evidence:all` 會先執行 `gatea:evidence:doctor --write`，再以單一批次指令更新證據索引、Daily Log、2week tracker、kickoff checklist 的 Gate A 自動引用區（等同 `npm run gatea:evidence:docs-sync`；亦即個別之 `gatea:evidence:index-sync`／`daily-sync`／`tracker-sync`／`kickoff-sync`）；區塊內含 **HTTP 嚴格取證** ON／OFF（與 `preflight`／`summary` 同源）。如此 tracker／kickoff 內的 **doctor report** 會對應本次剛落檔的報告。
> `gatea:evidence:all` 會先產生單檔收斂快照：`docs/evidence/gate-a-report-*.md`（等同 `npm run gatea:evidence:report`），再同步四份文件，確保引用到當次最新 report。
> `gatea:evidence:all` 亦會更新固定入口：`docs/evidence/gate-a-latest.md`（**Next Command** 與 **`preflight:strict`** 並列；等同 `npm run gatea:evidence:latest`；檔尾 blockquote 由 **`gateALatestMarkdownFooterLines`** 產出，共四行，見 **`scripts/gate-a-markdown-footer.mjs`** 檔首 **Export 契約**）。
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

判定稿快速指令（decision-mini：ref／snippet／HTTP 嚴格；末行全案收尾／§5 速查）：

```bash
npm run gatea:evidence:decision-mini
```

直接自動回填判定稿 mini 區塊（ref／snippet／HTTP 嚴格／全案收尾速查）：

```bash
npm run gatea:evidence:decision-sync
```

> `decision-sync`（`gate-a-sync-decision-draft.mjs`）stdout 在 mini 區塊與 **`[updated]`**／**`[skip]`** 列之後附 **全案收尾**／**§5** 兩行 blockquote（與 **`docs-sync`** 末段同源字串）。

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
npm run gatea:evidence:preflight:strict
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

> `latest`（`gate-a-update-latest-pointer.mjs`）stdout 在 **`[updated]`** 列之後附 **全案收尾**／**§5** 兩行 blockquote；寫入 **`gate-a-latest.md`** 之頁尾則為 **`gateALatestMarkdownFooterLines`** 之四行 blockquote（固定入口＋上列兩行＋**stdout 頁尾**一行，見 **`scripts/gate-a-markdown-footer.mjs`** **Export 契約**），與終端 stdout 略異。

僅同步證據索引／日誌／追蹤板／啟動清單（與 `gatea:evidence:all` 內同一批次；建議先跑一次 `doctor --write` 再執行）：

```bash
npm run gatea:evidence:docs-sync
```

> `docs-sync`（`gate-a-sync-all-markdown.mjs`）stdout 末段會附 **全案收尾**／**§5** 兩行 blockquote（與 **`gatea:evidence:summary`** 同源）；**`gatea:evidence:all`** 內嵌呼叫時傳 **`--suppress-closeout-footer`**，避免緊接在 **`summary`** 之後重複同一頁尾。

清理 `docs/evidence` 內舊的自動快照（預設 dry-run，實際刪除需 `--apply`）：

```bash
npm run gatea:evidence:prune
npm run gatea:evidence:prune -- --keep=2 --apply
```
