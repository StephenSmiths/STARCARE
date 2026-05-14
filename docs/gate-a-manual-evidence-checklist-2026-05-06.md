# Gate A 人工證據勾選表（2026-05-06）

> 對照：**`docs/gate-a-manual-evidence-checklist-2026-05-06.md`**（本表路徑，供互鏈與全文掃描）；**`docs/go-live-checklist.md`** §0.1、**`docs/business-logic.md`** §0 **全案收尾執行**；**`docs/gate-a-evidence-capture-2026-05-06.md`**、**`docs/gate-a-evidence-fill-template-2026-05-06.md`**、**`docs/gate-a-status-2026-05-06.md`**；收尾四檔開首同段互鏈：**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-daily-log-2026-05.md`**、**`docs/project-completion-2week-tracker-2026-05-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**  
> 由腳本自動產生之 `.txt`／`gate-a-*.md` 檔名含時間戳會變動；**現況路徑**以 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:summary`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**，見 **`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段）為準。下表以**建議截圖檔名**為主。
> 取證前可先 `npm run gatea:evidence:preflight`（嚴格：`npm run gatea:evidence:preflight:strict`）確認合併環境之 VITE_* 與 `docs/evidence` 目錄。  
> **HTTP 嚴格取證（401／403）與現況指標**：全流程請用 **`npm run gatea:evidence:refresh:strict-http`**（或合併環境設 **`GATEA_STRICT_HTTP`** 後跑 **`gatea:evidence:refresh`**）；**`docs/evidence/gate-a-latest.md`** 與收尾四檔 **`<!-- gatea-*-auto-ref -->`** 內之 **HTTP 嚴格取證** 會與該次旗標一致。若 **`docs/evidence`** 僅想保留最新一輪檔案，可用 **`npm run gatea:evidence:refresh:strict-http -- --keep=1`**；若僅手動 prune 而未重跑全流程，請接續 **`npm run gatea:evidence:latest -- --strict-http`**、**`npm run gatea:evidence:docs-sync -- --strict-http`**、**`npm run gatea:evidence:decision-sync -- --strict-http`** 以免 **latest**／引用區仍指向已刪檔名。  
> **全案收尾與證據留痕**：見 **`docs/go-live-checklist.md`** 開首 **全案收尾與證據留痕**（**`README.md`**「專案收尾」、**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））。序號主檔修訂日誌 **`docs/pdf-sequenced-gap-checklist-revision-log.md`** 之 **Gate A／stdout** 細列歸檔見 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**（與主日誌 **Archive gate-a-stdout-2026-05-09** 列並讀）。  
> **收證指令／旗標細部**：**`docs/gate-a-status-2026-05-06.md`** **§5**、**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`**；**人工／strict-http／keep=1**：**`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（**`docs/go-live-checklist.md`** §0.1）。
> 多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（第二行併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**；**`README.md`**「Gate A 終端頁尾（維護）」）。

## A. go-live §1（Auth/RLS）

- [x] `admin` 登入成功截圖（左下角色）
  - 證據檔：`gateA-d2-admin-login-2026-05-06.png`（證據索引註記「管理員登入…已留存」）
- [x] `staff` 登入成功截圖（左下角色）
  - 證據檔：`gateA-d2-staff-login-2026-05-06.png`
- [x] 401 截圖（未授權）
  - 證據檔：`docs/evidence/gate-a-d2-401-admin-user-role-set-2026-05-06-*.txt`（文字證據；實際檔名見 `docs/evidence/gate-a-latest.md` 之 `401 text`；檔尾四行見 **`gateALatestMarkdownFooterLines`**／**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段）或 `gateA-d2-401-2026-05-06.png`（截圖）
- [x] 403 截圖（staff 呼叫 `admin-user-role-set`）
  - 證據檔：`docs/evidence/gate-a-d2-403-admin-user-role-set-2026-05-06-*.txt`（文字證據；實際檔名見 `docs/evidence/gate-a-latest.md` 之 `403`）或 `gateA-d2-403-admin-user-role-set-2026-05-06.png`
- [x] `user_roles` SQL 截圖
  - 證據檔：`gateA-d2-user-roles-sql-2026-05-06.png`

## B. go-live §3（排班閉環）

- [x] 排班儲存成功提示截圖
  - 證據檔：`gateA-d3-scheduling-save-success-2026-05-06.png`
- [x] `scheduling_history` SQL 截圖
  - 證據檔：`gateA-d3-scheduling-history-sql-2026-05-06.png`
- [x] `actor_id` 與登入者一致（人工核對）
  - 核對結果：`一致（actor_id = b9827ee7-8003-42b2-a227-5714ab2e2e7d；依 D3/D4 SQL 截圖交叉核對）`

## C. go-live §8（審計/RLS）

- [x] `USER_RBAC_ROLE_SET` 成功提示/操作截圖
  - 證據檔：`gateA-d4-user-rbac-role-set-ui-2026-05-06.png`
- [x] `audit_events` SQL 截圖
  - 證據檔：`gateA-d4-audit-events-sql-2026-05-06.png`（證據索引註記 `audit_events` 約束修正 SQL 已落遠端）
- [x] staff 可見性截圖
  - 證據檔：`gateA-d4-rls-staff-2026-05-06.png`
- [x] teamlead 可見性截圖
  - 證據檔：`gateA-d4-rls-teamlead-2026-05-06.png`
- [x] admin 可見性截圖
  - 證據檔：`gateA-d4-rls-admin-2026-05-06.png`

## D. 完成判定

- [x] A/B/C 全部打勾
- [x] 已回填 `docs/project-completion-evidence-index-2026-05.md`
- [x] 已回填 `docs/project-completion-daily-log-2026-05.md`
- [x] 已更新 `docs/project-completion-2week-tracker-2026-05-05.md`
