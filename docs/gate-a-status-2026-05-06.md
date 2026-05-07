# Gate A 即時狀態板（2026-05-06）

> 對照：`docs/go-live-checklist.md`、`docs/project-completion-2week-tracker-2026-05-05.md`  
> 取證入口：`docs/gate-a-evidence-capture-2026-05-06.md`  
> 勾選表：`docs/gate-a-manual-evidence-checklist-2026-05-06.md`  
> 自動證據檔名會隨每次取證變更；**固定入口**：`docs/evidence/gate-a-latest.md`（**Next Command** 與 **`npm run gatea:evidence:preflight:strict`** 並列；或跑 `npm run gatea:evidence:summary`；檔尾 blockquote 含 **stdout 頁尾** 一行，見 **`gateALatestMarkdownFooterLines`**／**`commands-appendix`** 下文 **`latest`** 段）；**全案收尾與證據留痕**：見 **`docs/go-live-checklist.md`** 開首（**`README.md`**「專案收尾」、**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））。
> 多數 `gatea:evidence:*` 終端 stdout 末兩行 blockquote 維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；**`http:auth`** 頁尾見附錄 **inherit** 說明。
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
目前完成度（自動證據面）：請以 `npm run gatea:evidence:summary` 為準（含 `READY`／`NOT_READY`、HTTP 嚴格 ON／OFF、`next command`，以及 doctor／report／snippet／decision ref 指向；`gate-a-latest.md`／`gate-a-report-*.md` 亦含 HTTP 嚴格狀態；`gate-a-latest.md` 檔尾 blockquote 四行定義：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md`** 下文 **`latest`** 段））

### go-live §1 Auth / RLS
- [ ] admin/staff 登入截圖
- [x] 401 證據（文字檔）已取得（實際路徑見 `docs/evidence/gate-a-latest.md` 之 `401 text` 列，或 `npm run gatea:evidence:summary`；檔尾四行見 **`gateALatestMarkdownFooterLines`**／**`docs/gate-a-status-2026-05-06-commands-appendix.md`** 下文 **`latest`** 段））
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

## 5) 收證指令與旗標速查

見 **`docs/gate-a-status-2026-05-06-commands-appendix.md`**（**`npm run gatea:evidence:*`**、HTTP strict、preflight、doctor、refresh、prune 等）。
