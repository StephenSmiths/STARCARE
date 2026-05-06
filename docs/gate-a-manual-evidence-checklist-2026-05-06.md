# Gate A 人工證據勾選表（2026-05-06）

> 對照：`docs/gate-a-evidence-capture-2026-05-06.md`、`docs/gate-a-evidence-fill-template-2026-05-06.md`  
> 由腳本自動產生之 `.txt`／`gate-a-*.md` 檔名含時間戳會變動；**現況路徑**以 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:summary`**）為準。下表以**建議截圖檔名**為主。
> 取證前可先 `npm run gatea:evidence:preflight`（嚴格：`npm run gatea:evidence:preflight:strict`）確認合併環境之 VITE_* 與 `docs/evidence` 目錄。

## A. go-live §1（Auth/RLS）

- [ ] `admin` 登入成功截圖（左下角色）
  - 證據檔：`gateA-d2-admin-login-2026-05-06.png`
- [ ] `staff` 登入成功截圖（左下角色）
  - 證據檔：`gateA-d2-staff-login-2026-05-06.png`
- [ ] 401 截圖（未授權）
  - 證據檔：`docs/evidence/gate-a-d2-401-admin-user-role-set-2026-05-06-*.txt`（文字證據；實際檔名見 `docs/evidence/gate-a-latest.md` 之 `401 text`）或 `gateA-d2-401-2026-05-06.png`（截圖）
- [ ] 403 截圖（staff 呼叫 `admin-user-role-set`）
  - 證據檔：`gateA-d2-403-admin-user-role-set-2026-05-06.png`
- [ ] `user_roles` SQL 截圖
  - 證據檔：`gateA-d2-user-roles-sql-2026-05-06.png`

## B. go-live §3（排班閉環）

- [ ] 排班儲存成功提示截圖
  - 證據檔：`gateA-d3-scheduling-save-success-2026-05-06.png`
- [ ] `scheduling_history` SQL 截圖
  - 證據檔：`gateA-d3-scheduling-history-sql-2026-05-06.png`
- [ ] `actor_id` 與登入者一致（人工核對）
  - 核對結果：`<待填>`

## C. go-live §8（審計/RLS）

- [ ] `USER_RBAC_ROLE_SET` 成功提示/操作截圖
  - 證據檔：`gateA-d4-user-rbac-role-set-ui-2026-05-06.png`
- [ ] `audit_events` SQL 截圖
  - 證據檔：`gateA-d4-audit-events-sql-2026-05-06.png`
- [ ] staff 可見性截圖
  - 證據檔：`gateA-d4-rls-staff-2026-05-06.png`
- [ ] teamlead 可見性截圖
  - 證據檔：`gateA-d4-rls-teamlead-2026-05-06.png`
- [ ] admin 可見性截圖
  - 證據檔：`gateA-d4-rls-admin-2026-05-06.png`

## D. 完成判定

- [ ] A/B/C 全部打勾
- [ ] 已回填 `docs/project-completion-evidence-index-2026-05.md`
- [ ] 已回填 `docs/project-completion-daily-log-2026-05.md`
- [ ] 已更新 `docs/project-completion-2week-tracker-2026-05-05.md`
