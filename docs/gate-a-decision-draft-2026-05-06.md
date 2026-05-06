# Gate A 判定稿（草案）— 2026-05-06

> 對照：`docs/project-completion-2week-tracker-2026-05-05.md`、`docs/go-live-checklist.md`、`docs/project-completion-evidence-index-2026-05.md`

## 判定建議

- 目前建議：`有條件通過`（待補人工截圖證據後轉 `可通過`）

## 最新自動證據引用（每次貼兩行）

```bash
npm run gatea:evidence:decision-mini
```

> 將輸出的兩行直接貼到本段下方，作為最新留痕引用。
- decision ref：`docs/evidence/gate-a-decision-ref-20260506-145320.md`
- fill snippet：`docs/evidence/gate-a-fill-snippet-20260506-145320.md`

## 依據（已完成）

- [x] `admin-user-role-set` 已部署且 ACTIVE（functions list）
- [x] CORS + `x-idempotency-key` 已修正並重佈
- [x] migration `20260505160000` 已補齊至遠端（Local/Remote 一致）
- [x] `USER_RBAC_ROLE_SET` 流程可成功執行
- [x] `db:push` / `ops:verify` 已留存自動證據：`docs/evidence/gate-a-auto-evidence-2026-05-06-135940.md`

## 依據（待補人工證據）

### go-live §1（Auth/RLS）
- [ ] admin/staff 登入截圖
- [x] 401 證據（文字）`docs/evidence/gate-a-d2-401-admin-user-role-set-2026-05-06-140903.txt`
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
