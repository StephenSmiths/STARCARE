# RBAC Seq 1 驗收清單（Admin / TeamLead / Staff）

> 對齊母本：`docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf` §1（RBAC）  
> 用途：提供可重複執行的抽測步驟，驗證前端導覽／路由守門與後端授權一致。  
> **對照**：運維與閘門總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）；審計正式庫抽測 **`docs/go-live-checklist.md`** §8；序號主檔「**運維與工程**」列見 **`docs/pdf-sequenced-gap-checklist.md`**。

**全案收尾與證據留痕**：**`README.md`**「專案收尾」；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**。

---

## 1) 前置條件

- 已套用 migration：`20260501111000_rbac_teamlead_alignment.sql`。
- `public.user_roles` 已存在三種測試帳號：
  - Admin（`role = 'admin'`）
  - TeamLead（`role = 'teamlead'`）
  - Staff（`role = 'staff'`）
- 三個帳號都可正常登入系統。
- （選擇）審計 **`audit_events`** 之 **RLS**（staff 僅本人／TeamLead·Admin 全院）與 UI 抽測，可併參 **`docs/go-live-checklist.md`** §8（RES-06）。
- （選擇）PAT／部署後自檢與可選程式全閘：**`docs/security-token-rotation-checklist.md`**（**§D**）、**`docs/feature-list.md`** §8（**`npm run ci`**）。

---

## 2) 權限矩陣（預期結果）

| 功能／入口 | Admin | TeamLead | Staff |
|-----------|-------|----------|-------|
| 儀表盤 `#dashboard` | 可見 | 可見 | 可見 |
| 創建工作計劃 `#work-plan` | 可見 | 可見 | 不可見 |
| 工作計劃 `#work-session-plans` | 可見 | 可見 | 可見 |
| 服務表單 `#service-forms` | 可見 | 可見 | 可見 |
| 歷史文件 `#historical-documents` | 可見 | 可見 | 可見 |
| 工作分析／審核 `#work-analysis-review` | 可見 | 可見 | 不可見 |
| AI 報告中心 `#ai-report-center` | 可見 | 可見 | 不可見 |
| 通知中心 `#notification-center` | 可見 | 可見 | 可見 |
| 用戶手冊 `#user-manual` | 可見 | 可見 | 可見 |
| 開工接更 `#shift-start-handover` | 可見 | 可見 | 可見 |
| 收工交更 `#shift-end-handover` | 可見 | 可見 | 可見 |
| 智能排班 `#scheduling` | 可見 | 可見 | 可見 |
| 復康活動追蹤 `#rehab-activity-tracking` | 可見 | 可見 | 可見 |
| 評估管理 `#assessment-management` | 可見 | 可見 | 可見 |
| 系統設定 `#system-settings` | 可見 | 可見 | 不可見 |
| 院友管理 `#residents` | 可見 | 可見 | 不可見 |
| 員工管理 `#staff-import` | 可見 | 可見 | 不可見 |
| 活動時段匯入 `#activity-sessions-import` | 可見 | 可見 | 不可見 |
| 表單審批（不可審批自己） | 允許（不可審自己） | 允許（不可審自己） | 不允許 |

---

## 3) 手動抽測步驟

1. 以 **Staff** 登入：
   - 側欄顯示「儀表盤」、「工作計劃」、「服務表單」、「歷史文件」、「通知中心」、「用戶手冊」、「開工接更」、「收工交更」、「智能排班」、「復康活動追蹤」、「評估管理」（無「創建工作計劃」「工作分析／審核」「AI 報告中心」）。
   - 手動輸入 `#work-plan`／`#work-analysis-review`／`#ai-report-center`／`#residents`／`#staff-import`／`#activity-sessions-import`，應自動回退可用頁面（通常 `#dashboard`）。
2. 以 **TeamLead** 登入：
   - 側欄顯示十八個入口（含儀表盤、創建工作計劃、工作計劃、服務表單、歷史文件、工作分析／審核、AI 報告中心、通知中心、用戶手冊、開工／收工交更、智能排班、復康活動追蹤、評估管理、系統設定等）。
   - 可進入院友／員工／活動時段匯入頁面。
3. 以 **Admin** 登入：
   - 側欄顯示十八個入口，行為與 TeamLead 一致。
4. 後端授權驗證（任一角色）：
   - 呼叫任一受保護 Edge Function（例如 `residents-list`）應成功。
4b. **員工寫入／維護 Edge**（對齊 `view:staff-import` 僅 TeamLead／Admin）：
   - 以 **Staff** JWT 呼叫 `staff-import-validate`、`staff-import-commit`、`staff-soft-delete`、`staff-profile-update` 應回 **`403`**。
   - 以 **TeamLead** 或 **Admin** JWT 呼叫上述函式（測試用小額 `rows`／單筆更新）應成功。
4c. **院友寫入／批量匯入、活動時段寫入 Edge**（對齊 `view:residents`、`view:activity-sessions-import` 僅 TeamLead／Admin；前端已同步隱藏對應表單／按鈕）：
   - 以 **Staff** JWT 呼叫 `residents-create`、`residents-update`、`residents-soft-delete`、`residents-import-validate`、`residents-import-commit`、`activity-sessions-import-validate`、`activity-sessions-import-commit`、`activity-sessions-soft-delete` 應回 **`403`**。
   - **`residents-list`**、**`residents-get`** 仍為已登入 **Staff／TeamLead／Admin** 可讀（供排班等）。
   - 以 **TeamLead** 或 **Admin** JWT 呼叫上述寫入／匯入函式應成功。
5. 負面案例：
   - 將某帳號 `user_roles` 改為非法值或移除該列，再呼叫 Edge Function 應回 `403`。

---

## 4) SQL 抽樣（建議）

```sql
-- 檢查三角色是否存在
select role, count(*)
from public.user_roles
group by role
order by role;

-- 抽樣確認目標帳號角色
select user_id, role, created_at
from public.user_roles
where user_id in ('<admin-uuid>', '<teamlead-uuid>', '<staff-uuid>');
```

---

## 5) 驗收紀錄欄（執行時填寫）

| 日期 | 測試人 | 環境 | 結果 | 備註 |
|------|--------|------|------|------|
|      |        |      |      |      |
