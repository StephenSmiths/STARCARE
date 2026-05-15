# Gate C：PAT 輪替執行單（OPS）

> 對照：**`docs/security-token-rotation-checklist.md`** §A、簽核草稿 **§5**、**`docs/gate-c-go-live-signoff-draft-2026-05-15.md`**。

**預計時間：** 15～20 分鐘  
**禁止：** 將 PAT 寫入 repo、聊天、截圖、簽核 PDF。

---

## 步驟 1 — 建立新 PAT

1. 登入 [Supabase Dashboard](https://supabase.com/dashboard) → **Account** → **Access Tokens**。
2. 建立新 token（建議名稱：`STARCARE-ops-2026-05`）。
3. 複製至密碼管理器（**不要**貼進 Slack／Email）。

| 完成 | 日期 | 操作者 |
|------|------|--------|
| [ ] | | |

---

## 步驟 2 — 驗證新 PAT（本機終端）

在 repo 根目錄（已 `npm install`）：

```bash
export SUPABASE_ACCESS_TOKEN="<新PAT>"
npm run ops:verify
```

**通過標準：** migration Local/Remote 一致；目標 functions 為 **ACTIVE**。

| 完成 | 日期 | 輸出摘要（可貼內部工單，勿含 token） |
|------|------|--------------------------------------|
| [ ] | | |

可選煙霧（需本機 `.env` 已有 `VITE_*`，**勿**把 PAT 寫入 `.env`）：

```bash
export SUPABASE_ACCESS_TOKEN="<新PAT>"
npm run db:push -- --dry-run
```

---

## 步驟 3 — 停用舊 PAT

1. Dashboard 找到舊 token → **Revoke**。
2. 關閉曾 `export` 舊 PAT 的 terminal 分頁。

| 完成 | 日期 | 操作者 |
|------|------|--------|
| [ ] | | |

---

## 步驟 4 — 收尾

1. 填 **`docs/gate-c-go-live-signoff-draft-2026-05-15.md`** §5 表格。
2. 通知 TL：於本機 `.env` 設 `GATE_C_PAT_DONE=1` 後執行 `npm run gatec:evidence:sync`（工程操作，勿 commit）。
3. 勾選 **`docs/go-live-checklist.md`** §6 四項。

---

## 失敗時

| 現象 | 動作 |
|------|------|
| `ops:verify` 失敗 | 保留新 PAT；查 migration／function 名稱；見 **`docs/supabase-deploy-runbook.md`** |
| 誤刪唯一 PAT | 立即再建 PAT；勿 force push |
| token 外洩 | 立即 revoke；建新 PAT；通知 TL 輪替 |
