# STARCARE 收尾驗收證據索引（2026-05）

> **對照（運維鏈）**：**`docs/business-logic.md`** §0；序號主檔 **`docs/pdf-sequenced-gap-checklist.md`**「**運維與工程**」列；上線 **`docs/go-live-checklist.md`**。  
> **全案收尾母索引**：**`README.md`**「專案收尾」。  
> 對照：`docs/project-completion-audit-2026-05-05.md`、`docs/project-completion-kickoff-checklist-2026-05.md`、`docs/project-completion-2week-tracker-2026-05-05.md`、`docs/project-completion-daily-log-2026-05.md`、`docs/go-live-checklist.md`

## 使用方式

- 每完成一個關鍵任務，就在此表新增一列。
- 證據連結至少包含一種：PR、CI run、SQL 結果、截圖/文件。
- Gate A/B/C 檢核前，先確認對應列已完整。

## 證據總表

| 日期 | Day | 模組/主題 | 對照條款 | PR/Commit | CI/Artifact | SQL 證據 | 截圖/文件 | Owner | 備註 |
|---|---|---|---|---|---|---|---|---|---|
| 2026-05-05 | D1 | 驗收範圍與版本基線 | Plan D1 |  |  |  |  | TL |  |
| 2026-05-06 | D2 | Auth / RLS 初檢 | go-live §1 | `3f1652d` / `d970f84` | 本機 typecheck/lint/vitest 通過；`ops:verify` 成功（2026-05-06 13:45 BST）；自動證據現況見 `docs/evidence/gate-a-latest.md`（當日首次快照檔名曾為 `gate-a-auto-evidence-2026-05-06-152954.md`） | `user_roles` SQL（待補截圖） | 管理員登入＋`#user-role-admin` 操作截圖（已留存）；401 文字證據現況見 `docs/evidence/gate-a-latest.md` 與下方「Gate A 自動引用」（當日曾留存 `gate-a-d2-401-admin-user-role-set-2026-05-06-143013.7.txt`） | FE/BE | `admin-user-role-set` 已部署至 `qrrreijvihiypgpagnln`；functions 清單顯示 ACTIVE、`admin-user-role-set` v2；sandbox 內 `test:e2e:auth` Chromium SIGSEGV，需本機補測 |
| 2026-05-07 | D3 | 排班閉環 | go-live §3 | `d970f84` | `ops:verify` 成功（環境一致） | `scheduling_history` SQL（待補截圖） | 排班儲存成功提示截圖（待補） | FE/BE/QA | 待補一次當日最新批次 `batch_id` 與 `actor_id` 對照 |
| 2026-05-08 | D4 | 審計抽測（RES-06） | go-live §8 | `3f1652d` / `d970f84` | `npm run db:push`、`npm run ops:verify`（2026-05-06） | `audit_events` 約束修正 SQL（含 `Auth`）與 migration `20260505160000` 已落遠端 | `USER_RBAC_ROLE_SET` 審計列出現在角色頁審計區截圖 | FE/BE | staff/teamlead/admin 可見性差異抽測仍待補齊 |
| 2026-05-09 | D5 | Gate A 結論 | Gate A |  |  |  |  | TL/QA |  |
| 2026-05-12 | D6 | 回歸 A（residents/staff/import） | Plan D6 |  |  |  |  | FE/QA |  |
| 2026-05-13 | D7 | 回歸 B（scheduling/forms/handover） | Plan D7 |  |  |  |  | FE/QA |  |
| 2026-05-14 | D8 | RC + 缺陷收斂 | Gate B |  |  |  |  | TL/FE/BE |  |
| 2026-05-15 | D9 | 部署/回滾/憑證 | go-live §2/§6 |  |  |  |  | OPS/BE |  |
| 2026-05-16 | D10 | 最終簽核 | Gate C |  |  |  |  | TL/QA/業務 |  |

> **Gate A 證據檔名**：上表 2026-05-06 列括號內之歷史檔名僅供追溯；**現況**以 `docs/evidence/gate-a-latest.md` 及本文件下方「Gate A 自動引用」區塊（`docs-sync`／`refresh` 覆寫）為準。

> 2026-05-06 取證助手：  
> - 速跑步驟：`docs/gate-a-evidence-capture-2026-05-06.md`  
> - 回填模板：`docs/gate-a-evidence-fill-template-2026-05-06.md`
> - SQL 腳本：`docs/sql/gate-a-evidence-queries-2026-05-06.sql`

## Gate A 待填檔名（完成後刪除本段）

### Gate A 自動引用（由腳本同步）

> 下列清單由 `npm run gatea:evidence:docs-sync`／`refresh` 覆寫；路徑彙總以 `docs/evidence/gate-a-latest.md` 為準。

<!-- gatea-auto-ref:start -->
- 可否判定：`NOT_READY`（規則：scripts/gate-a-ready-core.mjs）
- HTTP 嚴格取證：OFF（`--strict-http`／`GATEA_STRICT_HTTP`）
- auto evidence：`docs/evidence/gate-a-auto-evidence-2026-05-06-165413.md`
- 401 text：`docs/evidence/gate-a-d2-401-admin-user-role-set-2026-05-06-155438.8.txt`
- 403 text：`<待補 403 text>`
- decision ref：`docs/evidence/gate-a-decision-ref-20260506-155439.md`
- fill snippet：`docs/evidence/gate-a-fill-snippet-20260506-155439.md`
- report：`docs/evidence/gate-a-report-20260506-155439.md`
<!-- gatea-auto-ref:end -->

- D2（§1）：
  - `<gateA-d2-admin-login-2026-05-06.png>`
  - `<gateA-d2-staff-login-2026-05-06.png>`
  - `<gateA-d2-401-2026-05-06.png>`
  - `<gateA-d2-403-admin-user-role-set-2026-05-06.png>`
  - `<gateA-d2-user-roles-sql-2026-05-06.png>`
- D3（§3）：
  - `<gateA-d3-scheduling-save-success-2026-05-06.png>`
  - `<gateA-d3-scheduling-history-sql-2026-05-06.png>`
  - `batch_id=<...> / actor_id=<...>`
- D4（§8）：
  - `<gateA-d4-user-rbac-role-set-ui-2026-05-06.png>`
  - `<gateA-d4-audit-events-sql-2026-05-06.png>`
  - `<gateA-d4-rls-staff-2026-05-06.png>`
  - `<gateA-d4-rls-teamlead-2026-05-06.png>`
  - `<gateA-d4-rls-admin-2026-05-06.png>`

## Gate 快速核對

### Gate A（D5）
- [ ] go-live §1 證據齊全
- [ ] go-live §3 證據齊全
- [ ] go-live §8 證據齊全
- [ ] `RES-06` 有明確結論（完成/阻塞）

### Gate B（D8）
- [ ] P0/P1 為 0
- [ ] RC 可重複部署
- [ ] CI 穩定綠燈（含 E2E/perf）

### Gate C（D10）
- [ ] go-live checklist 完成簽核
- [ ] 部署與回滾路徑確認
- [ ] 憑證輪替與安全收尾完成

## 相關文件

- `docs/project-completion-audit-2026-05-05.md`
- `docs/project-completion-2week-plan-2026-05-05.md`
- `docs/project-completion-2week-tracker-2026-05-05.md`
- `docs/project-completion-daily-log-2026-05.md`
- `docs/project-completion-kickoff-checklist-2026-05.md`
