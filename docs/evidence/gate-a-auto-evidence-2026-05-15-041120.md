# Gate A 自動證據（2026-05-15 041120）

- 產生時間（UTC ISO）：`2026-05-15T03:11:20.069Z`
- branch：`main`
- commit：`7680ecf`

## ops:verify / migration list

```
Local          | Remote         | Time (UTC)          
  ----------------|----------------|---------------------
   20260429120000 | 20260429120000 | 2026-04-29 12:00:00 
   20260429130000 | 20260429130000 | 2026-04-29 13:00:00 
   20260429140000 | 20260429140000 | 2026-04-29 14:00:00 
   20260430120000 | 20260430120000 | 2026-04-30 12:00:00 
   20260430123000 | 20260430123000 | 2026-04-30 12:30:00 
   20260430130000 | 20260430130000 | 2026-04-30 13:00:00 
   20260430143000 | 20260430143000 | 2026-04-30 14:30:00 
   20260430195000 | 20260430195000 | 2026-04-30 19:50:00 
   20260501111000 | 20260501111000 | 2026-05-01 11:10:00 
   20260501140000 | 20260501140000 | 2026-05-01 14:00:00 
   20260501210000 | 20260501210000 | 2026-05-01 21:00:00 
   20260502103000 | 20260502103000 | 2026-05-02 10:30:00 
   20260502120000 | 20260502120000 | 2026-05-02 12:00:00 
   20260502133000 | 20260502133000 | 2026-05-02 13:30:00 
   20260502140000 | 20260502140000 | 2026-05-02 14:00:00 
   20260503100000 | 20260503100000 | 2026-05-03 10:00:00 
   20260505160000 | 20260505160000 | 2026-05-05 16:00:00 
   20260507163000 | 20260507163000 | 2026-05-07 16:30:00 
   20260507171000 | 20260507171000 | 2026-05-07 17:10:00 
   20260508120000 | 20260508120000 | 2026-05-08 12:00:00 
   20260508193000 | 20260508193000 | 2026-05-08 19:30:00 
   20260509153000 | 20260509153000 | 2026-05-09 15:30:00 
   20260509153100 | 20260509153100 | 2026-05-09 15:31:00 
   20260509160000 | 20260509160000 | 2026-05-09 16:00:00 
   20260509201000 |                | 2026-05-09 20:10:00
```

## ops:verify / functions list

```
ID                                   | NAME                                 | SLUG                                 | STATUS | VERSION | UPDATED_AT (UTC)    
  --------------------------------------|--------------------------------------|--------------------------------------|--------|---------|---------------------
   278ed09b-1c19-496c-bf5e-f3343b99819e | residents-create                     | residents-create                     | ACTIVE | 13      | 2026-05-12 11:34:46 
   56429a03-06f6-4d2b-b415-5db2e9eff9e3 | residents-get                        | residents-get                        | ACTIVE | 13      | 2026-05-12 11:34:51 
   dedcaa40-d8d5-48a7-8c07-a184224a2b84 | residents-list                       | residents-list                       | ACTIVE | 13      | 2026-05-12 11:34:57 
   c244ea30-3ce3-40d5-9be8-1e26422dc200 | residents-soft-delete                | residents-soft-delete                | ACTIVE | 13      | 2026-05-12 11:35:02 
   f3193023-a85b-49aa-bcaa-3b2f56eb2dda | residents-update                     | residents-update                     | ACTIVE | 13      | 2026-05-12 11:35:08 
   ed93b2dd-a98e-4f14-b3ba-aa60b6913bc3 | schedule-assignments-batch           | schedule-assignments-batch           | ACTIVE | 14      | 2026-05-12 11:35:24 
   b12bdf40-ed10-4741-97cd-ce0d1ee87600 | scheduling-sessions-list             | scheduling-sessions-list             | ACTIVE | 13      | 2026-05-12 11:35:35 
   e85a2bb1-8d63-4308-b5b4-39f09856d6a7 | activities-list                      | activities-list                      | ACTIVE | 11      | 2026-05-12 11:35:40 
   29e17769-5f35-40b2-88f3-5eabd0341376 | activity-sessions-list               | activity-sessions-list               | ACTIVE | 13      | 2026-05-12 11:35:45 
   02f17c7a-551f-423a-95de-1461b7f54ad7 | scheduling-rules-get                 | scheduling-rules-get                 | ACTIVE | 11      | 2026-05-12 11:35:51 
   2f22ea7f-fc84-4b50-a043-32f0a73f8a55 | staff-skills-list                    | staff-skills-list                    | ACTIVE | 11      | 2026-05-12 11:36:18 
   76951a55-77c2-4f3d-8ed3-7f25189f06be | residents-import-validate            | residents-import-validate            | ACTIVE | 11      | 2026-05-12 11:36:34 
   177f15d4-f1a1-443e-b94f-6dae999bb13d | residents-import-commit              | residents-import-commit              | ACTIVE | 12      | 2026-05-12 11:36:39 
   0804b841-e772-428d-b1dc-3b737ee0da59 | staff-import-validate                | staff-import-validate                | ACTIVE | 11      | 2026-05-12 11:36:44 
   042ba624-b115-4202-8752-baa13d2ab129 | staff-import-commit                  | staff-import-commit                  | ACTIVE | 11      | 2026-05-12 11:36:49 
   44116d48-26c9-4891-acf6-12c70f10e211 | activity-sessions-import-validate    | activity-sessions-import-validate    | ACTIVE | 10      | 2026-05-12 11:37:00 
   bbab2f9a-0063-47e1-9184-1b5145ed0bcf | activity-sessions-import-commit      | activity-sessions-import-commit      | ACTIVE | 10      | 2026-05-12 11:37:06 
   689e0a64-8578-470f-9d29-02998ac23a90 | scheduling-kpi-history-list          | scheduling-kpi-history-list          | ACTIVE | 9       | 2026-05-12 11:37:11 
   bedf1ce0-0453-47a5-abdb-d26ccf03f9fc | scheduling-kpi-history-upsert        | scheduling-kpi-history-upsert        | ACTIVE | 9       | 2026-05-12 11:37:16 
   566a5ffb-b209-4ace-889f-515de831f92e | scheduling-kpi-history-clear         | scheduling-kpi-history-clear         | ACTIVE | 9       | 2026-05-12 11:37:21 
   0b16861a-435f-4814-8cc0-356c9222bf8e | service-forms-list                   | service-forms-list                   | ACTIVE | 8       | 2026-05-12 11:37:43 
   444ef5be-3566-45d9-9b21-1eebc659fed8 | service-forms-upsert                 | service-forms-upsert                 | ACTIVE | 8       | 2026-05-12 11:37:49 
   334123dc-8428-45f2-a676-334ea30fe4ba | service-forms-soft-delete            | service-forms-soft-delete            | ACTIVE | 8       | 2026-05-12 11:37:54 
   2c7c4e69-dbe3-499f-9719-64ccaab58192 | scheduling-history-soft-delete       | scheduling-history-soft-delete       | ACTIVE | 9       | 2026-05-12 11:35:30 
   29e477e5-4bc4-4b7c-a03c-7528efb027eb | staff-soft-delete                    | staff-soft-delete                    | ACTIVE | 8       | 2026-05-12 11:35:13 
   fec796f4-823f-4e4c-b749-3324c951e9d7 | activity-sessions-soft-delete        | activity-sessions-soft-delete        | ACTIVE | 8       | 2026-05-12 11:35:18 
   da907c40-08f2-4690-bceb-53f968743235 | staff-profiles-list                  | staff-profiles-list                  | ACTIVE | 8       | 2026-05-12 11:36:23 
   fca1fdef-28f6-4995-9e07-2c4bafb64cca | staff-profile-update                 | staff-profile-update                 | ACTIVE | 8       | 2026-05-12 11:36:28 
   261ecad3-92f2-43f5-b143-f5c7bed206b6 | assessment-due-list                  | assessment-due-list                  | ACTIVE | 8       | 2026-05-12 11:37:26 
   9eb83326-0206-4947-b71a-f182731ecf50 | audit-trail-append                   | audit-trail-append                   | ACTIVE | 8       | 2026-05-12 11:37:59 
   81d7f973-f8e6-48b0-b560-a7d2747969ee | audit-trail-list                     | audit-trail-list                     | ACTIVE | 8       | 2026-05-12 11:38:04 
   d91e75cb-fcba-4b46-ae2b-de51dbf4ce38 | assessment-completion-records-list   | assessment-completion-records-list   | ACTIVE | 8       | 2026-05-12 11:37:32 
   faed65b6-64ca-41d5-915d-673ee4d56577 | assessment-completion-records-append | assessment-completion-records-append | ACTIVE | 8       | 2026-05-12 11:37:37 
   5d2548e7-f446-4052-964f-6445ce1235b3 | admin-user-role-set                  | admin-user-role-set                  | ACTIVE | 9       | 2026-05-12 11:38:09 
   1df31219-24ce-4bd0-a41d-e9d45f4286cf | staff-create                         | staff-create                         | ACTIVE | 5       | 2026-05-12 11:36:55 
   48e2d8fc-3c92-4bc4-9093-77252e2d6efd | scheduling-policy-current-get        | scheduling-policy-current-get        | ACTIVE | 1       | 2026-05-12 11:35:56 
   570e29be-09b3-485f-a018-c462c58744cc | scheduling-policy-at-get             | scheduling-policy-at-get             | ACTIVE | 1       | 2026-05-12 11:36:02 
   7ec6fc7e-29e7-416e-93b5-627a0a732c90 | scheduling-policy-version-validate   | scheduling-policy-version-validate   | ACTIVE | 1       | 2026-05-12 11:36:08 
   656bdbfe-f6d7-4849-8911-08f4f1c5575f | scheduling-policy-version-commit     | scheduling-policy-version-commit     | ACTIVE | 1       | 2026-05-12 11:36:13
```

> 本檔由 `scripts/gate-a-auto-evidence.mjs` 產生；搭配 `docs/gate-a-evidence-capture-2026-05-06.md` 手動補齊截圖證據。

> **全案收尾與證據留痕**：見 **`docs/go-live-checklist.md`** 開首 **全案收尾與證據留痕**（**`README.md`**「專案收尾」、**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））。序號主檔修訂日誌 **`docs/pdf-sequenced-gap-checklist-revision-log.md`** 之 **Gate A／stdout** 細列歸檔見 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**（與主日誌 **Archive gate-a-stdout-2026-05-09** 列並讀）。
> **收證指令／旗標細部**：**`docs/gate-a-status-2026-05-06.md`** **§5**、**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`**；**人工／strict-http／keep=1**：**`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（**`docs/go-live-checklist.md`** §0.1）。
