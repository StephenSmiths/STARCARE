# STARCARE 收尾啟動 30 分鐘清單（2026-05）

> **對照**：運維總覽 **`docs/business-logic.md`** §0；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**`pdf-sequenced-gap-checklist-revision-log`** 主檔與歸檔（**`2026-05-01a`**／**`archive-p2`**／**`archive-p3`**／**`archive-p4`**）路徑見 **`README.md`**「專案收尾」文件表；上線勾選 **`docs/go-live-checklist.md`**。  
> **全案收尾母索引**：**`README.md`**「專案收尾」（併讀 **`docs/business-logic.md`** §0 **全案收尾執行** 所載 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））；Gate A **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md`** **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。  
> 目的：讓任何成員在 30 分鐘內完成收尾任務啟動，避免只看懂文件但無法開工。  
> 背景與完成率估算：`docs/project-completion-audit-2026-05-05.md`。

## 0) 先開哪些文件（5 分鐘）

- `README.md`（看「專案收尾」小節）
- `docs/project-completion-audit-2026-05-05.md`（可選：先看完成度與缺口）
- `docs/project-completion-2week-plan-2026-05-05.md`（Gate／日程權威）
- `docs/project-completion-2week-tracker-2026-05-05.md`
- `docs/project-completion-daily-log-2026-05.md`
- `docs/project-completion-evidence-index-2026-05.md`
- `docs/go-live-checklist.md`
- `docs/gate-a-status-2026-05-06.md`（D2～D5：Gate A 即時狀態；**§5** 指令速查 `docs/gate-a-status-2026-05-06-commands-appendix.md`）
- `docs/gate-a-evidence-capture-2026-05-06.md`（Gate A 取證步驟）
- `docs/evidence/gate-a-latest.md`（Gate A 證據固定入口；**Next Command** 與 **`preflight:strict`** 並列；檔名隨取證更新；檔尾四行 **`gateALatestMarkdownFooterLines`**，見 **`docs/gate-a-status-2026-05-06-commands-appendix.md`** **`latest`** 段）
- `docs/supabase-deploy-runbook.md`（OPS：遠端部署與驗證）
- `docs/security-token-rotation-checklist.md`（OPS：PAT 與 §D 自檢）

## 1) 先對齊角色（5 分鐘）

- [ ] 指定今日 `TL / FE / BE / QA / OPS` 責任人
- [ ] 確認今天對應 Day（D1～D10）
- [ ] 確認今日 Gate 風險（A/B/C 是否受影響）

## 2) 先跑基礎檢查（10 分鐘）

```bash
# 全閘門（本機）
npm run ci

# 可選：登入態 E2E（需 E2E_AUTH_*）
npm run test:e2e:auth

# 可選：僅 user-role-admin 可選登入 E2E（admin 成功 + staff 403）
npm run test:e2e:auth:user-role-admin

# Gate A 自動流程（含 doctor 落檔與四份收尾 markdown 同步；見 README Gate A 條目）
npm run gatea:evidence:all

# 可選：取證前環境診斷（不列印密值）
# npm run gatea:evidence:preflight
# npm run gatea:evidence:preflight:strict

# 可選：全流程後修剪舊快照、再刷新 latest 與收尾 markdown／判定稿（見 gate-a-status）
# npm run gatea:evidence:refresh

# 可選：列出所有 gatea:evidence:* npm 指令
# npm run gatea:evidence:list

# 僅同步證據索引／日誌／追蹤板／啟動清單之自動引用區（建議先手動 doctor --write）
# npm run gatea:evidence:docs-sync

# 與 CI 同源的效能治理
npm run perf:bundle:ci
npm run perf:bundle:ci:summary
```

## 3) 先建立今日留痕（10 分鐘）

- [ ] 在追蹤板填入今日 Owner/狀態
- [ ] 在日誌建立今日段落（完成/未完成/阻塞/明日）
- [ ] 在證據索引新增今日列（PR/CI/SQL/截圖至少 1 種）
- [ ] 若有 DB 驗證，貼上 SQL 結果連結或截圖

## 完成判定（啟動成功）

以下皆達成才算啟動成功：

- [ ] 今日角色分工已明確
- [ ] 今日追蹤列與日誌段落已建立
- [ ] 至少一條可驗證證據已入索引
- [ ] 明日目標已寫入日誌

### Gate A 自動引用（由腳本同步）

> 下列清單由 `npm run gatea:evidence:docs-sync`／`refresh` 覆寫；路徑彙總以 `docs/evidence/gate-a-latest.md` 為準（檔尾四行：**`gateALatestMarkdownFooterLines`**，見 **`docs/gate-a-status-2026-05-06-commands-appendix.md`** **`latest`** 段）。

<!-- gatea-kickoff-auto-ref:start -->
- 可否判定：`NOT_READY`
- HTTP 嚴格取證：OFF
- auto evidence：`docs/evidence/gate-a-auto-evidence-2026-05-06-211730.md`
- 401 text：`docs/evidence/gate-a-d2-401-admin-user-role-set-2026-05-06-201757.4.txt`
- 403 text：`<待補 403 text>`
- decision ref：`docs/evidence/gate-a-decision-ref-20260506-201757.md`
- fill snippet：`docs/evidence/gate-a-fill-snippet-20260506-201757.md`
- doctor report：`docs/evidence/gate-a-evidence-doctor-20260506-201757.md`
- report：`docs/evidence/gate-a-report-20260506-201758.md`
- `npm run gatea:evidence:preflight:strict`（取證前嚴格環境檢查；與 README／go-live 並讀）
- **全案收尾與指令速查**：`docs/go-live-checklist.md`（開首長鏈）；`docs/gate-a-status-2026-05-06.md` **§5**／`docs/gate-a-status-2026-05-06-commands-appendix.md`。
<!-- gatea-kickoff-auto-ref:end -->
