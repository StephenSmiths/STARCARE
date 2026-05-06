# Gate A Evidence Doctor

- HTTP 嚴格取證（執行當下合併環境）：OFF
- 完成度：1 / 12
- 缺口數：11

## 檢查結果
- [ ] D2 admin 登入截圖
- [ ] D2 staff 登入截圖
- [x] D2 401 證據（文字或截圖）
- [ ] D2 403 證據（文字或截圖）
- [ ] D2 user_roles SQL 截圖
- [ ] D3 排班儲存成功截圖
- [ ] D3 scheduling_history SQL 截圖
- [ ] D4 USER_RBAC_ROLE_SET 截圖
- [ ] D4 audit_events SQL 截圖
- [ ] D4 RLS staff 截圖
- [ ] D4 RLS teamlead 截圖
- [ ] D4 RLS admin 截圖

## 建議下一步
- 先補 403：`npm run gatea:evidence:http:auth`（需 `.env` 之 GATEA_STAFF_EMAIL／PASSWORD）；或於 `.env` 設 GATEA_STAFF_ACCESS_TOKEN 後跑 `gatea:evidence:http`
- 跑一次總同步：`npm run gatea:evidence:all`
- 補人工截圖後再跑：`npm run gatea:evidence:doctor`
