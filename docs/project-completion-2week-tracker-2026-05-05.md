# STARCARE 兩週收尾進度板（2026-05-05）

> **對照**：計畫 **`docs/project-completion-2week-plan-2026-05-05.md`**；運維總覽 **`docs/business-logic.md`** §0；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；上線 **`docs/go-live-checklist.md`**。  
> **用法**：每日 standup 更新「狀態／阻塞／證據」，EOD 勾選完成項。  
> **同日文件**：**`docs/project-completion-daily-log-2026-05.md`**（日誌）、**`docs/project-completion-evidence-index-2026-05.md`**（證據）、**`docs/project-completion-kickoff-checklist-2026-05.md`**（啟動）。  
> **全案收尾母索引**：**`README.md`**「專案收尾」；Gate A **`docs/evidence/gate-a-latest.md`**（**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**）。

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

> Gate A 即時狀態板：`docs/gate-a-status-2026-05-06.md`；證據固定入口：`docs/evidence/gate-a-latest.md`

## 今日開工指令（可直接複用）

```bash
# 1) 本機全閘門（lint/typecheck/test/build:demo/e2e）
npm run ci

# 2) 可選：登入態 E2E（需 E2E_AUTH_*）
npm run test:e2e:auth

# 2a) 可選：僅 user-role-admin 權限補測（較快）
npm run test:e2e:auth:user-role-admin

# 2b) Gate A 自動流程（含 doctor 與收尾 markdown 同步；細節見 docs/gate-a-status-2026-05-06.md）
npm run gatea:evidence:all
# 2c) 僅四份收尾 markdown 自動引用（可選）：npm run gatea:evidence:docs-sync
# 2d) 可選：全流程後 prune + latest + docs-sync + decision-sync：npm run gatea:evidence:refresh
# 2e) 可選：取證前診斷：npm run gatea:evidence:preflight；指令總表：npm run gatea:evidence:list

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
| D2 | go-live §1：Auth/RLS 初檢（admin/staff/401/403） | FE + BE | doing | 仍待補 401/403 截圖證據；`test:e2e:auth` 於 sandbox Chromium 啟動 SIGSEGV，需本機終端補測 | 管理員登入與角色頁驗證、`admin-user-role-set` 已部署（Supabase Functions）；`ops:verify` 已確認 functions ACTIVE；執行手順：`docs/gate-a-evidence-capture-2026-05-06.md`；勾選表：`docs/gate-a-manual-evidence-checklist-2026-05-06.md` | [ ] |
| D3 | go-live §3：排班閉環（排班→儲存→DB） | FE + BE + QA | doing | 待補 `scheduling_history` SQL 查詢結果截圖 | 系統設定頁審計顯示 `SCHEDULE_BATCH_SAVE`（2026-05-06）；執行手順：`docs/gate-a-evidence-capture-2026-05-06.md`；勾選表：`docs/gate-a-manual-evidence-checklist-2026-05-06.md` | [ ] |
| D4 | go-live §8：審計抽測（含 RLS 可見性） | FE + BE | doing | staff/teamlead/admin 可見性差異仍待完整抽測 | 已修復 `audit_events_entity_type_check`（含 `Auth`）並成功寫入 `USER_RBAC_ROLE_SET`；`db:push` + `ops:verify` 已完成一致性確認（含 migration `20260505160000`）；執行手順：`docs/gate-a-evidence-capture-2026-05-06.md`；勾選表：`docs/gate-a-manual-evidence-checklist-2026-05-06.md` | [ ] |
| D5 | Week1 Gate：判定 RES-06、整理 P0/P1/P2 | TL + QA | todo |  |  | [ ] |
| D6 | 回歸 A：residents/staff/import | FE + QA | todo |  |  | [ ] |
| D7 | 回歸 B：scheduling/forms/handover | FE + QA | todo |  |  | [ ] |
| D8 | 缺陷收斂、產出 RC、風險清單 v2 | FE + BE + TL | todo |  |  | [ ] |
| D9 | 部署/回滾演練、PAT/部署一致性 | OPS + BE | todo |  |  | [ ] |
| D10 | 最終簽核（go/no-go） | TL + QA + 業務 | todo |  |  | [ ] |

## Gate 檢核（Hard Gates）

| Gate | 時點 | 必要條件 | 是否通過 | 備註 |
|---|---|---|---|---|
| Gate A | D5 | go-live §1/§3/§8 證據齊全、RES-06 有結論 | [ ] |  |
| Gate B | D8 | P0/P1=0、RC 可重複部署、CI 綠燈 | [ ] |  |
| Gate C | D10 | go-live checklist 可簽核、回滾路徑可用 | [ ] |  |

### Gate A 自動引用（由腳本同步）

> 下列清單由 `npm run gatea:evidence:docs-sync`／`refresh` 覆寫；路徑彙總以 `docs/evidence/gate-a-latest.md` 為準。

<!-- gatea-tracker-auto-ref:start -->
- 可否判定：`NOT_READY`
- HTTP 嚴格取證：OFF
- auto evidence：`docs/evidence/gate-a-auto-evidence-2026-05-06-204753.md`
- 401 text：`docs/evidence/gate-a-d2-401-admin-user-role-set-2026-05-06-194814.5.txt`
- 403 text：`<待補 403 text>`
- decision ref：`docs/evidence/gate-a-decision-ref-20260506-194815.md`
- fill snippet：`docs/evidence/gate-a-fill-snippet-20260506-194814.md`
- doctor report：`docs/evidence/gate-a-evidence-doctor-20260506-194815.md`
- report：`docs/evidence/gate-a-report-20260506-194815.md`
<!-- gatea-tracker-auto-ref:end -->

## 缺陷收斂板（上線範圍）

| ID | 模組 | 嚴重度 | 現況 | Owner | 目標日 | 備註 |
|---|---|---|---|---|---|---|
| BUG-001 |  | P0/P1/P2 | todo |  |  |  |
| BUG-002 |  | P0/P1/P2 | todo |  |  |  |
| BUG-003 |  | P0/P1/P2 | todo |  |  |  |

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
