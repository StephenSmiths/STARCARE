# Gate A Evidence Doctor

- HTTP 嚴格取證（執行當下合併環境）：OFF
- 完成度：2 / 12
- 缺口數：10

## 檢查結果
- [ ] D2 admin 登入截圖
- [ ] D2 staff 登入截圖
- [x] D2 401 證據（文字或截圖）
- [x] D2 403 證據（文字或截圖）
- [ ] D2 user_roles SQL 截圖
- [ ] D3 排班儲存成功截圖
- [ ] D3 scheduling_history SQL 截圖
- [ ] D4 USER_RBAC_ROLE_SET 截圖
- [ ] D4 audit_events SQL 截圖
- [ ] D4 RLS staff 截圖
- [ ] D4 RLS teamlead 截圖
- [ ] D4 RLS admin 截圖

## 建議下一步
- 跑一次總同步：`npm run gatea:evidence:all`
- 補人工截圖後再跑：`npm run gatea:evidence:doctor`

> **全案收尾與證據留痕**：見 **`docs/go-live-checklist.md`** 開首 **全案收尾與證據留痕**（**`README.md`**「專案收尾」、**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））。
> **收證指令／旗標細部**：**`docs/gate-a-status-2026-05-06.md`** **§5**、**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`**。
