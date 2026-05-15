# UAT 環境存取指南（Staging）

> 工程驗收狀態：**`docs/evidence/gate-c-latest.md`**（engineering READY）。  
> 開測信：**`npm run gatec:uat:kickoff`** · 帳號表：**`uat-account-handoff-template-2026-05-15.md`**

---

## 方案 A — 雲端 Staging（建議給客戶）

1. 部署前端至 Vercel（或既有 Hosting），Environment 設：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. 將 **HTTPS 網址** 填入開測信：
   ```bash
   FRONTEND_URL='https://<your-deployment>' UAT_CONTACT='<姓名>' npm run gatec:uat:kickoff
   ```
3. 後端已就緒：`npm run ops:verify`（2026-05-15 已通過）。

---

## 方案 B — 本機 Preview（內網 UAT／工程帶測）

> 煙霧紀錄（2026-05-15）：**`docs/evidence/gate-c-staging-preview-smoke-2026-05-15.md`**（build + preview HTTP 200）。

適用：客戶到場、或 VPN 存取工程師筆電／內網主機。

```bash
# 1) 確認 .env 含 VITE_SUPABASE_*（勿 commit）
npm run verify:supabase-vite-env:ping

# 2) 建置（保留 Supabase 變數）
npm run build

# 3) 啟動（預設 http://127.0.0.1:4173）
npm run preview -- --host 0.0.0.0 --port 4173
```

- 同網段客戶瀏覽：`http://<工程機區網 IP>:4173`
- 開測信範例：
  ```bash
  FRONTEND_URL='http://192.168.x.x:4173' UAT_CONTACT='...' npm run gatec:uat:kickoff
  ```

---

## 方案 C — 開發伺服器（僅工程除錯）

```bash
npm run dev
```

不建議作為客戶 UAT 正式環境（熱更新與 CI 建置不一致）。

---

## 測試帳號

| 角色 | 最低需求 |
|------|----------|
| UAT 主測 | **Team Lead** 或 **Admin**（系統設定、排班儲存、週更） |
| 對照 | **Staff** 一組（權限／可見性） |

帳號建立：Supabase Dashboard → Authentication；`user_roles` 見 **`.env.example`** 註解。

---

## 驗收劇本

1. [system-settings-policy-p1-uat-and-staging-2026-05-09.md](./system-settings-policy-p1-uat-and-staging-2026-05-09.md)（二之二 Staging）
2. [scheduling-intelligent-uat-2026-05-15.md](./scheduling-intelligent-uat-2026-05-15.md)（S1～S10）
