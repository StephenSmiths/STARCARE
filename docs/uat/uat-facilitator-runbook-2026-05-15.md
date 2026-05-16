# UAT 帶領人現場手冊（2～3 小時）

> **環境**：**`docs/uat/uat-staging-access-guide-2026-05-15.md`**  
> **開測信**：**`docs/uat/uat-kickoff-email-generated-local-2026-05-15.txt`**（或 `npm run gatec:uat:kickoff`）  
> **帳號表**：**`uat-account-handoff-template-2026-05-15.md`**

## 開場前（15 分鐘）

- [ ] Preview 已啟動：`npm run gatec:staging:preview`（或 Vercel URL 可開）
- [ ] TL／Admin 已登入成功一次
- [ ] 週更 CSV 樣本備妥：**`docs/uat/weekly-roster-uat-sample.csv`**（或院舍實際更表；表頭須含「服務類型、職位、姓名…」）
- [ ] 投影／螢幕共享就緒

## 流程（建議順序）

| 時段 | 劇本 | 通過標準 |
|------|------|----------|
| 0:00 | 開場 | 說明已知限制（見開測信） |
| 0:15 | 系統設定 UAT **二之二** | 五區政策可見、可儲存無錯 |
| 0:45 | 排班 UAT **S1～S5** | 週更匯入、確認、啟動排班；**員工工作表預覽**（非院友列表） |
| 1:15 | **S5～S8** | 預覽無衝突、儲存成功、審計有紀錄 |
| 1:45 | **S9～S10**（可選） | Staff 權限、缺陷登記 |
| 2:00 | 簽核 | 劇本 §五 簽名；P0/P1 清零才建議 go-live |

## 常見問題

| 現象 | 處理 |
|------|------|
| 登入失敗 | 對 `.env`／Vercel 的 `VITE_*` 與 Dashboard anon key |
| 週更表「職位須為 PT…」 | CSV **職位** 改為 `PT`／`OT` 等代碼，勿填中文職稱 |
| 週更表「找不到員工主檔」 | 將 CSV **姓名** 改為 **員工管理** 內既有員工（姓名＋職位須完全一致） |
| 排班無法儲存 | 確認 TL 角色、衝突數為 0 |
| 待審區空白 | Staff 正常；TL 需展開「待審核清單」 |
| 院友頁空白 | 需 **Team Lead** 帳（Staff 無權限） |

## 結束後

- [ ] 缺陷填入劇本 §六
- [ ] 掃描簽核回傳
- [ ] 工程更新 **`docs/project-completion-daily-log-2026-05.md`**
