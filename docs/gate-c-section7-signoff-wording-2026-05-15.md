# Gate C：§7 上線簽核用語（複製至簽名表）

> 填寫 **`docs/gate-c-go-live-signoff-draft-2026-05-15.md`** §4；證據包見該檔 §7。

---

## 技術負責人（TL）— 建議可於 PAT 前先行

**確認內容（貼入簽核表）：**

本人確認 STARCARE Staging／上線候選版本已完成下列工程驗收（2026-05-15）：

- Gate A **READY**（**`docs/evidence/gate-a-latest.md`**；含登入、401/403、排班儲存、審計 RLS）。
- Gate B **`npm run ci`** 通過；D9 **`ops:deploy:all`**／**`ops:verify`** 一致。
- Gate C 工程項 **6/6 READY**：Staff 真庫 Playwright **11 passed**（**`gate-c-e2e-auth-latest.md`**）；TL/Admin 四項 skip 已由 **Gate A 基線**覆蓋（**`gate-c-engineering-baseline-latest.md`**）。
- 回滾路徑：**`docs/supabase-deploy-runbook.md`**。

**待 OPS 完成後補記：** §6 PAT 輪替（**`gate-c-pat-ops-runbook-2026-05-15.md`**）。PAT 完成前之技術簽核僅代表工程驗收，**不等同正式 go-live**。

| 姓名 | 日期 | 簽名 |
|------|------|------|
| | | |

---

## 產品／業務

**確認內容：**

本人確認已閱 UAT 劇本並（或將）於 Staging 執行驗收；智能排班（PDF 02【3】）與系統設定（【16】）行為符合會議共識，**已知限制**（週更目錄門檻、私位週目標、前端排班演算等）已告知利害關係人。

- 劇本：**`docs/uat/scheduling-intelligent-uat-2026-05-15.md`**
- 系統設定：**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`**

| 姓名 | 日期 | 簽名 |
|------|------|------|
| | | |

---

## 決策人（Go-Live）

**確認內容（須 §6 PAT 已完成）：**

本人批准 STARCARE 於 **正式／約定環境** 上線，並確認：

- [ ] **`docs/go-live-checklist.md`** §6 PAT 已勾選
- [ ] 技術、業務簽核已完成
- [ ] 無未關閉 **P0/P1** 缺陷（UAT §六）

| 姓名 | 日期 | 簽名 |
|------|------|------|
| | | |

---

## 完成後（工程本機，勿 commit）

```bash
# .env 僅本機
GATE_C_PAT_DONE=1
GATE_C_SIGNOFF_DONE=1
npm run gatec:evidence:sync
```

預期 **`docs/evidence/gate-c-latest.md`** 判定趨近 **READY**（仍須人工核對勾選表）。
