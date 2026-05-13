# STARCARE 補強與交付計劃（客戶對齊版）

> **文件用途**：說明我方如何依**客戶提供且已簽核之 PDF** 進行補強、驗收與交付，可作為與客戶會議／郵件附件之**單一說明文件**。  
> **權威來源**：`docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf`、`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`、`docs/pdf/03-STARCARE-工程規範-Closed-Loop.pdf`（以下合稱「**三份母本**」）。  
> **內部工程入口（非對客戶正文）**：運維、CI、憑證總覽見 **`docs/business-logic.md`** §0（**`.cursorrules`** §3「部署與驗收閘門」）、**`README.md`**；序號主檔「**運維與工程**」路徑彙列見 **`docs/pdf-sequenced-gap-checklist.md`**（與 **§2** 所列運維附件同列）。**全案收尾證據鏈**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**）；精簡入口 **證據索引**／**啟動清單**：**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

---

## 1. 背景與目標（給客戶看的說法）

| 項目 | 說明 |
|------|------|
| **我們要做的事** | 確保開發與驗收**全程可追溯**至三份母本；已交付或進行中之功能，皆能對應到母本條款與功能編號。 |
| **客戶可期待的結果** | 清楚知道**哪些已符合**、**哪些分期**、**如何驗收**；減少口頭誤差與範圍爭議。 |
| **不變的原則** | 業務規則以**客戶簽核 PDF**為準；若母本之間有歧義，由**客戶／產品**書面裁定後再實作。 |

---

## 2. 我方已完成的「文件層」補強（可立即對客戶說明）

1. **三份母本**已固定存放於專案 **`docs/pdf/`**，檔名統一、便於版控與搜尋。  
2. **`docs/business-logic.md`**：已依 **01 核心業務邏輯與 SOP** 整理為工程可讀之條目，並載明與 **02** 之分工及**程式落差摘要**（供內部與客戶技術窗口查閱）。  
3. **`.cursorrules`（工程規範）**已更新為**明列三份 PDF 路徑**，後續開發一律以此對齊。  
4. **上線／部署／憑證／母本 P0**：內部可引用 **`docs/go-live-checklist.md`**、**`docs/supabase-deploy-runbook.md`**（含 **`npm run ops:deploy:all`**、**`npm run ci`**）、**`docs/security-token-rotation-checklist.md`**（PAT 輪替；**§D** 部署後自檢含可選 **`npm run ci`**）、**`docs/pdf-alignment-p0-backlog.md`**（P0 勾選項）、**`docs/pdf-sequenced-gap-checklist.md`**（主檔「**運維與工程**」列與 **§0**／**`README`** 對齊），作為對外「有書面程序」之補充附件；院友／評估完成／**Seq 29 院舍排班政策**之 Edge 行為見 **`docs/residents-edge-function-contract.md`**、**`docs/assessment-completion-records-contract.md`**、**`docs/scheduling-policy-edge-function-contract.md`**；**Seq 29 系統設定**本機／Staging **前向煙霧**（無 Supabase bundle、**`#system-settings`**）見 **`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`** **二之一**（段末 **工程維護互鏈**）、**`docs/seq29-system-settings-pdf02-traceability.md`**、**`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**。

---

## 3. 給客戶的「交付方法」——建議採三階段

### 階段 A：對齊與盤點（約 1～2 次會議，視範圍而定）

| 步驟 | 內容 | 產出 |
|------|------|------|
| A1 | 與客戶確認：**三份母本版本是否皆為最新簽核版**；若有更新版，請提供並取代 `docs/pdf/` 內對應檔名或另存版本號。 | 版本紀錄（日期＋檔名） |
| A2 | 以 **02《智能院舍照護管理系統》** 之 **【1】～【16】** 為主軸，建立 **「功能項 × 母本出處 × 現況」** 矩陣（見下節範本）。 | 已提供 **`docs/pdf-sequenced-gap-checklist.md`**（含 **Seq 1～38** 與缺漏摘要）；可複製為矩陣母版與客戶共編。 |
| A3 | 針對 **01** 之 MUST／NEVER／合規／Audit 條款，標註 **已實作／部分／未實作** 與**證據**（畫面、API、SQL）。 | 合規對照表 |

### 階段 B：分期承諾（對外口徑一致）

| 步驟 | 內容 | 產出 |
|------|------|------|
| B1 | 與客戶共同劃分 **MVP／第二期／長期**（務必白紙黑字：對應【1】～【16】編號）。 | 里程碑表（含日期區間） |
| B2 | 每一期結束之 **驗收準則** 只引用 **母本章節或功能編號**，避免模糊用語。 | 驗收清單 |

### 階段 C：驗收與簽核（每一期結束必做）

| 步驟 | 內容 | 產出 |
|------|------|------|
| C1 | **示範錄影或現場走查**＋**資料庫抽樣 SQL**（若客戶同意）證明關鍵閉環。 | 驗收紀錄 |
| C2 | 客戶簽署 **「本期範圍符合母本某某條／【N】」** 或載明**已知差異與排程**。 | 簽核紀要 |

---

## 4. 「功能 × 母本」矩陣範本（請與客戶一起填狀態）

以下為 **02 主文件** 功能編號之**欄位範本**（實際列舉請以 PDF 為準逐條展開）。

| 編號 | 功能名稱（依 02 PDF） | 主要母本 | 現況（請填：未開始／進行中／已交付） | 驗收證據／備註 |
|------|------------------------|----------|--------------------------------------|----------------|
| 【1】 | （例：儀表盤） | 02 |  |  |
| 【2】 | （例：創建工作計劃） | 02 |  |  |
| … | … | 01／02／03 |  |  |
| 【16】 | （例：系統設定） | 02 |  |  |

**合規與鐵律**（Pass、雙軌、統計不可混算、Audit 等）請另用小表對 **01** 條款逐條勾選。

---

## 5. 與客戶溝通時建議主動說明的三點（降低誤解）

1. **文件就位 ≠ 程式已 100% 符合**：程式須依矩陣**逐條補強或列為下期**，並由客戶簽核分期。  
2. **三份母本各有角色**：**01** 管硬性規則；**02** 管產品範圍與流程；**03** 管工程／閉環約定；歧義時請客戶裁定。  
3. **變更管制**：母本更新時，請同步給我方**檔案＋變更摘要**，以便更新 `docs/business-logic.md` 與矩陣，避免無聲漂移。

---

## 6. 我方建議之會議邀請範本（可貼給客戶）

主旨：**STARCARE｜依三份簽核 PDF 之補強計劃與驗收對齊會議**  
內文要點：

- 說明三份母本已存放於 **`docs/pdf/`** 並為工程唯一引用路徑。  
- 請客戶確認是否皆為**最新簽核版**。  
- 會議目標：完成 **【1】～【16】** 與 **01 鐵律條款** 之**現況盤點**與**分期承諾**。  
- 請客戶攜：任何**補充條款**或**院舍現場驗收重點**。

---

## 7. 行動方案（誰／做什麼／何時完成）

以下為**可勾選**的執行順序；日期請依專案實際填入。**負責**欄：P＝產品／專案經理、E＝工程、C＝客戶。

### 7.1 本週內（建議 D+5 內完成）

| # | 行動 | 負責 | 完成定義 |
|---|------|------|----------|
| 1 | 寄送會議邀請（§6 範本），附件本檔＋三份母本或下載連結 | P | 客戶已確認收到 |
| 2 | 與客戶確認三份 PDF 皆為**最新簽核版**；若非最新，取得新檔並更新 `docs/pdf/`、註記版本日期 | C → E | `docs/pdf/` 與版本紀錄一致 |
| 3 | 建立 **【1】～【16】** 全表（自 02 PDF 謄出功能名稱，勿省略） | E | 表格可分享給客戶編輯 |
| 4 | 建立 **01 鐵律對照小表**（RBAC、雙軌、Pass、合規、Audit、軟刪、防抖）逐列「已／部分／未」 | E | 每列有證據欄位（畫面／API／SQL） |

### 7.2 第一次對齊會議後（建議 D+14 內）

| # | 行動 | 負責 | 完成定義 |
|---|------|------|----------|
| 5 | 與客戶走完矩陣：每個【N】標 **本期做／下期／不做** 與理由 | P＋C | 矩陣欄位填滿、雙方簡署或郵件確認 |
| 6 | 產出 **MVP／第二期／長期** 里程碑表（對應【N】與 01 條款） | P | 白紙黑字含目標日期區間 |
| 7 | 針對「未／部分」項目開 **工程 issue**（一項一卡，標母本出處） | E | backlog 可追蹤 |

### 7.3 每期交付前（重複執行）

| # | 行動 | 負責 | 完成定義 |
|---|------|------|----------|
| 8 | 撰寫本期 **驗收清單**（只引用母本編號／【N】，不含模糊用語） | P＋E | 客戶事前同意 |
| 9 | 內部 **走查＋抽樣 SQL／Log**（依 **`docs/go-live-checklist.md`** 類型擴充；部署與 **`npm run ci`** 見 **`docs/supabase-deploy-runbook.md`**） | E | 紀錄留存 |
| 10 | 驗收會議：示範、對矩陣勾選、記載差異與下期 | P＋C | **簽核紀要**或郵件確認 |

### 7.4 持續（每 sprint 或每兩週）

| # | 行動 | 負責 | 完成定義 |
|---|------|------|----------|
| 11 | 母本若有更新：客戶給檔＋變更摘要 → 更新 `docs/pdf/`、`business-logic.md`、矩陣 | C → E | 修訂紀錄已寫 |
| 12 | 對外報告：本期完成【N】、仍開放議題、下期預告 | P | 客戶可轉發院舍 |

---

## 8. 修訂紀錄

| 日期 | 說明 |
|------|------|
| 2026-05-01 | 初版：補強與對客戶交付之方法與階段說明。 |
| 2026-05-01 | 新增 **§7 行動方案**（檢核清單與負責分工）。 |
| 2026-05-03 | §7.3 行 9：補 **`docs/go-live-checklist.md`**、**`docs/supabase-deploy-runbook.md`**（含 **`npm run ci`**）路徑。 |
| 2026-05-03 | §2：增第 4 點（上線／runbook／憑證清單可作對外補充附件）。 |
| 2026-05-03 | 對照 **`README.md`** 文件表：已納入本檔與 **`pdf03-cursorrules-alignment.md`** 入口連結。 |
| 2026-05-03 | §2 第 4 點：補 **`pdf-alignment-p0-backlog.md`**（P0 勾選項）。 |
| 2026-05-03 | §2 第 4 點：補院友／評估完成 **Edge 契約**路徑；**`pdf-alignment-p0-backlog.md`** 首段附錄同步。 |
| 2026-05-03 | 對照 **`README.md`** 文件表：增 **Phase 4／5 交付索引**（**`phase4-day4-delivery-index`**、**`phase5-day1-delivery-index`**）與 **`npm run ci`** 對照說明；**`pdf03-cursorrules-alignment.md`** §4 維護項同步。 |
| 2026-05-03 | §2 第 4 點：**`security-token-rotation-checklist.md`** 補 **§D**／可選 **`npm run ci`** 用語（與 **`go-live-checklist.md`** §6、主檔「運維與工程」對齊）。 |
| 2026-05-03 | 對照 **`README.md`** 憑證列、**`go-live-checklist.md`** §0、**`supabase-deploy-runbook.md`** §6：**§D**／可選 **`npm run ci`** 用語。 |
| 2026-05-03 | **`.cursorrules`** §3 與 **`business-logic.md`** §0、**`feature-list.md`** §8：工程規範與運維入口連動說明對齊。 |
| 2026-05-03 | **`README.md`** **`business-logic`** 列、**`pdf-alignment-p0-backlog.md`** 工程附錄、**`pdf03-cursorrules-alignment.md`** §3：**`.cursorrules`** §3／**`business-logic`** §0 對照補強。 |
| 2026-05-03 | **`README.md`** 開頭、`pdf-sequenced-gap-checklist.md`「相關檔」、**`feature-list.md`** 頁尾／§8：**`.cursorrules`** §3 一句式入口。 |
| 2026-05-03 | **`security-token-rotation-checklist.md`** 標題下增對照 **`business-logic.md`** §0、**`go-live-checklist.md`**、**`supabase-deploy-runbook.md`**（與上線／runbook／pdf03 一致）。 |
| 2026-05-03 | **`feature-list.md`**、**`pdf-alignment-p0-backlog.md`**、**`adr-0001`**、**`rbac-seq1-verification-checklist.md`**：開首增 **對照** **`business-logic.md`** §0／**`.cursorrules`** §3。 |
| 2026-05-03 | **`residents-edge-function-contract.md`**、**`assessment-completion-records-contract.md`**：開首增 **對照**（**`business-logic.md`** §0、**`go-live-checklist.md`**）。 |
| 2026-05-03 | 開首增 **內部工程入口**（**`business-logic.md`** §0、**`.cursorrules`** §3、**`README.md`**）；**`phase3-day5-acceptance.md`** 增 Phase 4／5 與 **`business-logic.md`** §0 **對照**。 |
| 2026-05-04 | **`business-logic.md`** §0、**`README.md`** 文件表、**`feature-list.md`** 頁尾／§8、**`pdf03-cursorrules-alignment.md`** §3／§4、**`pdf-alignment-p0-backlog.md`**：補 Stage 2／Phase 3 **歷史追溯**路徑（非現行交付權威）。 |
| 2026-05-05 | **`pdf-sequenced-gap-checklist.md`** 主檔「**運維與工程**」補歷史入口；**`pdf03-cursorrules-alignment.md`** §4 維護項補主檔該列；**`business-logic.md`** §8 一筆。 |
| 2026-05-06 | **`.cursorrules`** §3、**`pdf-alignment-p0-backlog.md`** 工程附錄、**`feature-list.md`** §8、**`pdf03`** §3：與序號主檔「**運維與工程**」列閉環對齊。 |
| 2026-05-07 | **`README.md`** 開頭／文件表、**`pdf03-cursorrules-alignment.md`** §3、**`feature-list.md`** §8：補 **`pdf-sequenced-gap-checklist.md`**「**運維與工程**」與 **§0**／**§3** 對齊敘述。 |
| 2026-05-08 | **`pdf-sequenced-gap-checklist.md`** 開首 **對照**；**`go-live-checklist.md`** 開首 **對照**；**`.github/workflows/ci.yml`**／**`pdf03`** §3／§4；**`feature-list.md`** §8 CI 項；**`business-logic.md`** §8 一筆。 |
| 2026-05-09 | **`supabase-deploy-runbook.md`**、**`security-token-rotation-checklist.md`**、**`rbac-seq1-verification-checklist.md`** 開首 **對照** 補 **`pdf-sequenced`**「**運維與工程**」列。 |
| 2026-05-10 | **`residents-edge-function-contract.md`**、**`assessment-completion-records-contract.md`**、**`feature-list.md`**、**`pdf03`**（標題區／§4）、**`adr-0001`**：開首／標題區 **對照** 補 **`pdf-sequenced`**「**運維與工程**」列。 |
| 2026-05-11 | 開首 **內部工程入口**／**§2** 第 4 點補 **`pdf-sequenced`**「**運維與工程**」；**`business-logic.md`** §0、**`pdf-alignment-p0-backlog.md`** 開首 **對照**、**`feature-list.md`** §8 同步。 |
| 2026-05-12 | **`phase*.md`**、**`stage*.md`** 與 acceptance／closeout **腳本** 產出：開首 **對照** 補 **`pdf-sequenced`**「**運維與工程**」列。 |
| 2026-05-13 | **`.cursorrules`** §3、**`README.md`**、**`business-logic.md`** §0、**`pdf03`** §3、**`feature-list.md`** §8、**`ci.yml`**：**`phase*.md`**／**`stage*.md`** 與 **`pdf-sequenced`** 互鏈敘述。 |
| 2026-05-14 | **`feature-list.md`** 頁尾、**`pdf03`** §4：維護閉環（**`README`**／**§0**／**`ci.yml`**／**`phase*.md`**／**`stage*.md`**／**`pdf-sequenced`**）。 |
| 2026-05-15 | **`business-logic-revision-log.md`**（**`business-logic.md`** §8 拆出）；**`README.md`**、**`pdf03`** §4、**`feature-list.md`** 頁尾、**`pdf-alignment-p0-backlog.md`** Seq 38。 |
| 2026-05-16 | **`pdf-sequenced-gap-checklist-revision-log.md`**（及 **`pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**）；**`pdf-sequenced-gap-checklist.md`** 主檔 ≤200 行；**`pdf03`**、**`README.md`**、**`feature-list.md`**。 |
| 2026-05-17 | **`pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**；主修訂日誌預留 ≤200 行；**`pdf03`**、**`README.md`**、**`.cursorrules`** §3。 |
| 2026-05-09 | **§2 第 4 點**：補 **`docs/scheduling-policy-edge-function-contract.md`**（Seq 29 **`scheduling-policy-*`**）與院友／評估契約並列；補 **Seq 29 系統設定**前向煙霧（**UAT** **二之一** 段末 **工程維護互鏈**、**`seq29-system-settings-pdf02-traceability.md`**）。 |

---

*本檔為對外溝通輔助；契約與法遵仍以客戶簽核之 PDF 及雙方合約為準。*
