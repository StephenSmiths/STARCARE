# Gate C Engineering Baseline（Staff + Gate A）

- 更新時間：2026-05-15T12:22:00.784Z
- 判定：`ACCEPTED`
- Staff E2E：**`docs/evidence/gate-c-e2e-auth-latest.md`**
- Gate A：**`docs/evidence/gate-a-latest.md`**（含 admin/staff 登入截圖、401/403）

## 4 項 Playwright skip 之對照

| skip 案例 | 覆蓋證據 |
|-----------|----------|
| `#residents`（TL/Admin） | Gate A 院友／排班人工路徑；UAT S? |
| `#system-settings` P2 h3 | Gate A TL 登入 + UAT 系統設定 |
| `user-role-admin` admin | Gate A admin 截圖 |
| `user-role-admin` staff 403 | Gate A strict-http 403 txt |

## 升級為全自動

於 `.env` 設 `E2E_AUTH_TEAMLEAD_*`／`E2E_AUTH_ADMIN_*` 後重跑 `npm run gatec:e2e:auth`（0 skipped）。
