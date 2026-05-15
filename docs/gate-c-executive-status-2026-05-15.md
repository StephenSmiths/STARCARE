# STARCARE 上線準備狀態（管理層一頁）

> 即時：`npm run gatec:status` · 細項：**`docs/evidence/gate-c-latest.md`**

**日期**：2026-05-15

## 結論

| 維度 | 狀態 |
|------|------|
| **工程驗收** | **可簽**（Gate A/B、部署、Staff 自動化測試 11 項通過） |
| **客戶 UAT** | **可開測**（本機或雲端 Staging；劇本已備） |
| **正式 go-live** | **尚未批准**（PAT 輪替 + 三方簽核） |

## 已完成

- 智能排班閉環（登入→排班→儲存→DB）Gate A 取證
- 遠端 migration／Edge **ACTIVE**（D9）
- RES-06 審計／RLS 抽測
- CI 全綠（Gate B）

## 待辦（阻塞 go-live）

1. **OPS**：Supabase PAT 輪替（約 15 分鐘）  
2. **業務**：UAT 2～3 小時 + 劇本簽名  
3. **決策人**：PAT 完成後批准上線  

## 已知產品限制（UAT 一併確認）

- 週更表擇活動依**目錄職位**，非院友個人復康計劃優先  
- 私位週排班目標仍為 **1**（若業務要 2，需另案裁定）  
- 排班演算主要在前端  

## 文件入口

| 對象 | 文件 |
|------|------|
| OPS | `gate-c-pat-ops-runbook` |
| 帶領 UAT | `uat-facilitator-runbook` |
| TL 簽技術 | `gate-c-section7-signoff-wording` |
| 工程 | `gate-c-closeout-checklist` |
