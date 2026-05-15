# STARCARE 兩週收尾進度板（2026-05-05）

> **對照**：計畫 **`docs/project-completion-2week-plan-2026-05-05.md`**；運維總覽 **`docs/business-logic.md`** §0；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**`pdf-sequenced-gap-checklist-revision-log`** 主檔與歸檔（**`2026-05-01a`**／**`archive-p2`**／**`archive-p3`**／**`archive-p4`**／**`archive-p5`**／**`archive-seq29-2026-05-09b`**／**`archive-gate-a-stdout-2026-05-09`**）路徑見 **`README.md`**「專案收尾」文件表；上線 **`docs/go-live-checklist.md`**。  
> **用法**：每日 standup 更新「狀態／阻塞／證據」，EOD 勾選完成項。  
> **同日文件**：**`docs/project-completion-daily-log-2026-05.md`**（日誌）、**`docs/project-completion-evidence-index-2026-05.md`**（證據）、**`docs/project-completion-kickoff-checklist-2026-05.md`**（啟動）。  
> **全案收尾母索引**：**`README.md`**「專案收尾」（併讀 **`docs/business-logic.md`** §0 **全案收尾執行** 所載 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））；Gate A **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（**第一行**併主日誌 **Gate A／stdout** 細列歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**；**第二行**併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

> Gate A 人工證據與 **HTTP 嚴格取證**／**`npm run gatea:evidence:refresh:strict-http`**／**`--keep=1`**：**`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首。

## 狀態圖例

- `todo`：未開始
- `doing`：進行中
- `done`：已完成
- `blocked`：受阻塞

## 責任人對照

| 代號 | 姓名/角色 | 主要責任 |
|---|---|---|
| TL |  | 技術決策、風險判斷、最終簽核 |
| FE |  | 前端流程修正、E2E 配合與 UI 驗證 |
| BE |  | Edge/RLS/SQL 驗證與資料一致性 |
| QA |  | 驗收證據整理、缺陷追蹤與回歸紀錄 |
| OPS |  | 部署、憑證、回滾演練與運維記錄 |

## 週次總覽

| 週次 | 目標 | 目前狀態 | 備註 |
|---|---|---|---|
| Week 1 | 正式庫閉環 + 權限/RLS/審計抽測（WP1+WP2） | doing | 2026-05-06 已完成 admin 角色治理鏈路（Edge + UI + 審計 + DB 約束修正） |
| Week 2 | 回歸收斂 + RC + 簽核上線（WP3+WP4+WP5） | todo |  |

## Day 1 啟動清單（開工即填）

| 項目 | Owner | 目標輸出 | 狀態 | 連結 |
|---|---|---|---|---|
| 鎖定驗收版本（commit/tag） | TL | 本輪唯一驗收基線 | [ ] |  |
| 建立缺陷編號規則（BUG-xxx） | QA | 缺陷命名一致 | [ ] |  |
| 指定 go-live §1/§3/§8 主責 | TL | 責任矩陣完成 | [ ] |  |
| 建立證據存放位置（SQL/截圖/artifact） | QA | 證據路徑可追溯 | [ ] |  |
| 確認 PAT / 部署窗口 | OPS | D9 可執行條件清楚 | [ ] |  |

> Gate A 即時狀態板：`docs/gate-a-status-2026-05-06.md`（**§5** 指令速查 `docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`）；證據固定入口：`docs/evidence/gate-a-latest.md`（**Next Command** 與 **`preflight:strict`** 並列；檔尾四行：**`gateALatestMarkdownFooterLines`**，見 **`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段）；人工／strict-http／keep=1：`docs/gate-a-manual-evidence-checklist-2026-05-06.md` 開首。

## 今日開工指令（可直接複用）

```bash
# 1) 本機全閘門（lint/typecheck/test/build:demo/e2e）
npm run ci

# 2) 可選：登入態 E2E（需 E2E_AUTH_*）
npm run test:e2e:auth

# 2a) 可選：僅 user-role-admin 權限補測（較快）
npm run test:e2e:auth:user-role-admin

# 2b) Gate A 自動流程（含 doctor 與收尾 markdown 同步；細節見 docs/gate-a-status-2026-05-06.md §5、docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment）
npm run gatea:evidence:all
# 2c) 僅四份收尾 markdown 自動引用（可選）：npm run gatea:evidence:docs-sync
# 2d) 可選：全流程後 prune + latest + docs-sync + decision-sync：npm run gatea:evidence:refresh
# 2e) 可選：取證前診斷 npm run gatea:evidence:preflight（嚴格：npm run gatea:evidence:preflight:strict）；指令總表：npm run gatea:evidence:list

# 3) Bundle 治理（與 CI 同源）
npm run perf:bundle:ci
npm run perf:bundle:ci:summary
```

```sql
-- 4) 排班寫入驗證（go-live §3）
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

```sql
-- 5) 審計驗證（go-live §8）
select id, action, entity_type, entity_id, actor_id, occurred_at
from public.audit_events
where is_deleted = false
order by occurred_at desc
limit 20;
```

## 每日追蹤（D1～D10）

| Day | 任務 | Owner | 狀態 | 阻塞 | 證據連結（PR/SQL/截圖/Artifact） | 完成勾選 |
|---|---|---|---|---|---|---|
| D1 | 凍結驗收範圍、版本鎖定、風險清單 v1 | TL + QA | doing | 風險清單 v1 尚待 TL/QA 確認 | 基線提交：`d970f84`（含角色治理修正） | [ ] |
| D2 | go-live §1：Auth/RLS 初檢（admin/staff/401/403） | FE + BE | done | — | Gate A §1 證據（**`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** §A）；401/403 文字證據見 **`docs/evidence/gate-a-latest.md`** | [x] |
| D3 | go-live §3：排班閉環（排班→儲存→DB） | FE + BE + QA | done | — | Gate A §3 證據（排班儲存、`scheduling_history` SQL）；**`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** §B | [x] |
| D4 | go-live §8：審計抽測（含 RLS 可見性） | FE + BE | done | — | RES-06 **已完成**；RLS 三角色截圖見 Gate A §C | [x] |
| D5 | Week1 Gate：判定 RES-06、整理 P0/P1/P2 | TL + QA | done | — | Gate A PASS（**`docs/gate-a-status-2026-05-06.md`**、**`docs/evidence/gate-a-latest.md`**）；RES-06→**已完成** | [x] |
| D6 | 回歸 A：residents/staff/import | FE + QA | todo |  |  | [ ] |
| D7 | 回歸 B：scheduling/forms/handover | FE + QA | todo |  |  | [ ] |
| D8 | 缺陷收斂、產出 RC、風險清單 v2 | FE + BE + TL | done | — | `npm run ci`（2026-05-15）；缺陷板無 P0/P1；RC 見 D9 | [x] |
| D9 | 部署/回滾演練、PAT/部署一致性 | OPS + BE | done | — | `npm run db:push`（`20260509201000`）、`npm run ops:deploy:all`、`npm run ops:verify`（2026-05-15；Local/Remote 一致、Functions ACTIVE） | [x] |
| D10 | 最終簽核（go/no-go） | TL + QA + 業務 | todo |  |  | [ ] |

## Gate 檢核（Hard Gates）

| Gate | 時點 | 必要條件 | 是否通過 | 備註 |
|---|---|---|---|---|
| Gate A | D5 | go-live §1/§3/§8 證據齊全、RES-06 有結論 | [x] | 2026-05-15 PASS（READY） |
| Gate B | D8 | P0/P1=0、RC 可重複部署、CI 綠燈 | [x] | 2026-05-15 工程收斂（`c3755ad`） |
| Gate C | D10 | go-live checklist 可簽核、回滾路徑可用 | [ ] | 草稿 **`gate-c-go-live-signoff-draft-2026-05-15`**；缺 PAT／§7／e2e:auth |

### Gate A 自動引用（由腳本同步）

> 下列清單由 `npm run gatea:evidence:docs-sync`／`refresh` 覆寫；路徑彙總以 `docs/evidence/gate-a-latest.md` 為準（檔尾四行：**`gateALatestMarkdownFooterLines`**，見 **`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段）。

<!-- gatea-tracker-auto-ref:start -->
- 可否判定：`READY`
- HTTP 嚴格取證：ON
- auto evidence：`docs/evidence/gate-a-auto-evidence-2026-05-15-041120.md`
- 401 text：`docs/evidence/gate-a-d2-401-admin-user-role-set-2026-05-15-031146.1.txt`
- 403 text：`docs/evidence/gate-a-d2-403-admin-user-role-set-2026-05-15-031146.1.txt`
- decision ref：`docs/evidence/gate-a-decision-ref-20260515-031147.md`
- fill snippet：`docs/evidence/gate-a-fill-snippet-20260515-031147.md`
- doctor report：`docs/evidence/gate-a-evidence-doctor-20260515-031147.md`
- report：`docs/evidence/gate-a-report-20260515-031147.md`
- `npm run gatea:evidence:preflight:strict`（取證前嚴格環境檢查；與 README／go-live 並讀）
- **全案收尾與指令速查**：`docs/go-live-checklist.md`（開首長鏈）；`docs/gate-a-status-2026-05-06.md` **§5**／`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`；人工／strict-http／keep=1：`docs/gate-a-manual-evidence-checklist-2026-05-06.md` 開首；主日誌 **Gate A／stdout** 細列：`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`（併主日誌 **Archive gate-a-stdout-2026-05-09** 列）。
<!-- gatea-tracker-auto-ref:end -->

## 缺陷收斂板（上線範圍）

| ID | 模組 | 嚴重度 | 現況 | Owner | 目標日 | 備註 |
|---|---|---|---|---|---|---|
| — | （RC 範圍） | — | closed | TL/QA | 2026-05-15 | 無登記 P0/P1；CI 綠燈；P2 進 backlog |
| BUG-001 |  | — | n/a |  |  | 保留列（未使用） |
| BUG-002 |  | — | n/a |  |  | 保留列（未使用） |

## 每日 EOD 總結模板

```md
### YYYY-MM-DD EOD
- 今日完成：
- 未完成（原因）：
- 新增阻塞：
- 明日目標：
- 需要協助：
```

## 每日收工流程（固定 3 步）

1. 先更新本表「每日追蹤（D1～D10）」中的狀態、阻塞與證據連結。  
2. 再更新 `docs/project-completion-daily-log-2026-05.md` 當日段落（完成/未完成/風險/Gate 影響）。  
3. 最後在 standup 或群組貼出 EOD 摘要（完成項 + 阻塞 + 明日重點）。

## 快速連結

- 完成度盤點：`docs/project-completion-audit-2026-05-05.md`
- 兩週計畫：`docs/project-completion-2week-plan-2026-05-05.md`
- 上線檢核：`docs/go-live-checklist.md`
- 功能清單：`docs/feature-list.md`
