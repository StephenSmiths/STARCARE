# Gate C：本機 Staging Preview 煙霧（2026-05-15）

| 項目 | 結果 |
|------|------|
| `npm run build` | exit 0 |
| `npm run preview -- --host 127.0.0.1 --port 4173` | 啟動成功 |
| `GET http://127.0.0.1:4173/` | **HTTP 200** |
| 用途 | 內網 UAT（見 **`docs/uat/uat-staging-access-guide-2026-05-15.md`** 方案 B） |

**開測信（本機示範）：**

```bash
FRONTEND_URL='http://127.0.0.1:4173' UAT_CONTACT='<聯絡人>' npm run gatec:uat:kickoff
```

同網段客戶請改為工程機區網 IP（`npm run gatec:staging:preview` 使用 `--host 0.0.0.0`）。

**備註：** `verify:supabase-vite-env:ping` 對 REST 回 401 時，仍以 **`gatec:e2e:auth` 11 passed** 與 Gate A 為準；若登入失敗請對齊 Dashboard anon key 與 `.env`。
