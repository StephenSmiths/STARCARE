# Gate C：正式上線簽核草稿（D10）

> **對照**：**`docs/go-live-checklist.md`**、**`docs/security-token-rotation-checklist.md`**、**`docs/project-completion-evidence-index-2026-05.md`**（Gate C 區）。  
> **前置**：Gate A **PASS**（**`docs/evidence/gate-a-latest.md`**）；Gate B 工程 **通過**（**`npm run ci`** 2026-05-15）。  
> **狀態（2026-05-15）**：**不可 go-live** — 待 §6 PAT、§7 三方簽名、可選 **`test:e2e:auth`** 真庫綠燈。

---

## 1. 可驗證項（工程已備證據）

| 區塊 | 項目 | 證據／備註 |
|------|------|------------|
| §0 | 最小閉環（登入→排班→儲存→DB） | Gate A §B；**`gateA-d3-scheduling-*`** |
| §1 | admin/staff 登入、user_roles、401/403 | Gate A 截圖／strict-http txt |
| §2 | migration／functions 一致 | D9 **`ops:verify`**（2026-05-15） |
| §3 | 儲存成功、scheduling_history、actor_id | Gate A §3（啟動排班／新增院友留 UAT **S5**） |
| §5 | runbook、Edge 契約、demo CI | **`npm run ci`**；契約檔＋**ACTIVE** |
| §8 | 審計 UI、RLS staff 隔離 | Gate A §C；RES-06 **已完成** |
| 回滾 | **`docs/supabase-deploy-runbook.md`** | Gate C evidence-index 已勾 |

---

## 2. 待辦（Gate C 阻塞）

| 優先 | 項目 | 責任 | 動作 |
|------|------|------|------|
| P0 | §6 新 PAT 驗證部署、停用舊 PAT | OPS／TL | **`docs/security-token-rotation-checklist.md`** §A |
| P0 | §7 三方簽名 | 業務／技術／決策 | 本檔 **§4** 簽核表 |
| P1 | §1 `residents`／`scheduling_history` RLS 書面紀錄 | QA | SQL＋角色帳號抽測 |
| P1 | §8 `audit_events` SQL 抽樣 | QA | go-live §8 查詢 |
| P2 | **`npm run test:e2e:auth`** 非 skip 全綠 | 工程 | 本檔 **§3**；2026-05-15 為 **15 skipped** |
| P2 | 客戶 UAT | 業務 | **`docs/uat/scheduling-intelligent-uat-2026-05-15.md`** |

---

## 3. `test:e2e:auth` 補測（真庫 Playwright）

### 3.1 執行紀錄

| 日期 | 指令 | 結果 | 說明 |
|------|------|------|------|
| 2026-05-15 AM | `test:e2e:auth` | 15 skipped | 無 **`E2E_AUTH_*`** → **`gate-c-e2e-auth-attempt-2026-05-15.md`** |
| 2026-05-15 PM | `npm run gatec:e2e:auth` | **PASS** | **11 passed**，0 failed，4 skipped；**`GATEA_STAFF_*`→`E2E_AUTH_*`** → **`gate-c-e2e-auth-latest.md`** |

**結論**：Staff 主路徑已綠燈；**TL／Admin 專項**（院友、系統設定 P2、user-role-admin）仍 skip，建議 UAT 前補 **`E2E_AUTH_TEAMLEAD_*`** 再跑一輪。

### 3.2 `.env` 設定（勿提交密碼）

```bash
# 主路徑（Team Lead 或等同權限，涵蓋 auth-login*.spec 多數案例）
E2E_AUTH_EMAIL=<staging-teamlead@example.com>
E2E_AUTH_PASSWORD=<secret>

# user-role-admin（admin 提交 + staff 403）
E2E_AUTH_ADMIN_EMAIL=<admin@example.com>
E2E_AUTH_ADMIN_PASSWORD=<secret>
E2E_AUTH_STAFF_EMAIL=<staff@example.com>
E2E_AUTH_STAFF_PASSWORD=<secret>

# system-settings P2 h3（優先 Team Lead）
E2E_AUTH_TEAMLEAD_EMAIL=<teamlead@example.com>
E2E_AUTH_TEAMLEAD_PASSWORD=<secret>
```

執行：

```bash
npm run test:e2e:auth
# 僅權限證據：npm run test:e2e:auth:user-role-admin
```

通過後：將終端摘要（passed 數、0 failed）貼入 **§5 證據**，並勾 **`docs/go-live-checklist.md`** §1.1。

診斷指令：`npm run gatec:preflight`（嚴格：`npm run gatec:preflight:strict`）。  
SQL 抽測：**`docs/sql/gate-c-go-live-verification.sql`**。  
營運步驟：**`docs/gate-c-operator-runbook-2026-05-15.md`**。

---

## 4. §7 上線簽核表（待簽）

| 角色 | 姓名 | 日期 | 確認內容 | 簽名 |
|------|------|------|----------|------|
| 產品／業務 | | | 智能排班與系統設定 UAT 符合 PDF 02【3】【16】預期（含已知限制） | |
| 技術（TL） | | | §1～§5、§8 勾選完成；PAT 已輪替；RLS／審計抽測無異常 | |
| 決策人 | | | 批准正式環境 go-live | |

**業務 UAT 參考**：**`docs/uat/scheduling-intelligent-uat-2026-05-15.md`**、**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`**。

---

## 5. §6 PAT 輪替記錄（OPS 填寫）

| 步驟 | 完成 | 日期 | 操作者 | 備註 |
|------|------|------|--------|------|
| 建立新 PAT | [ ] | | | Dashboard → Account → Tokens |
| 新 PAT 驗證 `ops:deploy:all` 或 `ops:verify` | [ ] | | | 勿寫入 repo |
| 停用舊 PAT | [ ] | | | |
| 確認未於聊天／文件洩漏新 PAT | [ ] | | | |

---

## 6. Go/No-Go 建議（草稿）

| 決策 | 條件 |
|------|------|
| **No-Go（現況）** | §6、§7 未完成；`test:e2e:auth` 未真跑 |
| **Go（建議門檻）** | §6 全勾；§7 三方簽名；§1 RLS 紀錄；§8 audit_events SQL；UAT 簽核；`test:e2e:auth` **0 failed**（或書面豁免附 Gate A 人工證據） |

---

## 7. 證據附件清單（簽核包）

- **`docs/evidence/gate-a-latest.md`**
- **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`**
- Gate B：`npm run ci` 2026-05-15（tracker **`c3755ad`**）
- D9：部署日誌（**`docs/project-completion-daily-log-2026-05.md`** 2026-05-15）
- （補）`test:e2e:auth` 終端輸出／Playwright report
