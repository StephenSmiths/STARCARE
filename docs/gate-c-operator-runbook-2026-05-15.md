# Gate C 營運執行手冊（OPS／TL）

> **簽核草稿**：**`docs/gate-c-go-live-signoff-draft-2026-05-15.md`**  
> **診斷**：`npm run gatec:preflight`  
> **狀態**：2026-05-15 — 工程 **READY**；待 **PAT**、**§7 簽名**、客戶 UAT。

---

## 階段 A — 工程自檢（約 30 分鐘）

1. `npm run gatec:preflight` — 確認 E2E／Gate A 狀態。
2. 複製 **`.env.gate-c.example`** 所列至 `.env`（勿 commit）。
3. `npm run gatec:e2e:auth` — 須 **passed > 0**（全 skip 會 exit 1）；證據 **`docs/evidence/gate-c-e2e-auth-latest.md`**。
4. 可選：`npm run test:e2e:auth:user-role-admin`（Admin+Staff 憑證）。
5. `npm run ops:verify` — migration／functions 一致。
6. Supabase SQL Editor 執行 **`docs/sql/gate-c-go-live-verification.sql`**，截圖貼簽核包。

---

## 階段 B — PAT 輪替（OPS，約 15 分鐘）

依 **`docs/gate-c-pat-ops-runbook-2026-05-15.md`**（含勾選表與失敗處置）。

---

## 階段 C — 業務 UAT（1～2 天）

1. `FRONTEND_URL=... UAT_CONTACT=... npm run gatec:uat:kickoff`（或編輯 **`docs/uat/uat-kickoff-email-draft-2026-05-15.md`**）。
2. 附件帳號表：**`docs/uat/uat-account-handoff-template-2026-05-15.md`**（密碼分開交付）。
2. 系統設定 UAT → 智能排班 UAT（劇本互鏈）。
3. 缺陷記錄於 UAT 檔 **§六**；P0/P1 清零後進簽核。

---

## 階段 D — 簽核與 Go-Live

1. 三方填 **`docs/gate-c-go-live-signoff-draft-2026-05-15.md`** §4（用語 **`docs/gate-c-section7-signoff-wording-2026-05-15.md`**）。
2. 勾選 **`docs/go-live-checklist.md`** §6、§7。
3. **Go** 條件見簽核草稿 §6；否則維持 Staging UAT。

---

## 快速指令

| 指令 | 用途 |
|------|------|
| `npm run gatec:preflight` | Gate C 阻塞診斷 |
| `npm run gatec:preflight:strict` | 嚴格（備齊 VITE+E2E+Gate A READY） |
| `npm run test:e2e:auth` | 真庫 Playwright |
| `npm run gatea:evidence:preflight:strict` | Gate A 取證環境 |
