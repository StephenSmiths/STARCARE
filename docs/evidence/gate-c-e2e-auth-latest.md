# Gate C E2E Auth Latest

- 更新時間：2026-05-15T12:19:14.614Z
- 結果：`PASS`
- passed：11
- failed：0
- skipped：4
- 指令：`npm run gatec:e2e:auth`
- 環境補齊：E2E_AUTH_EMAIL←GATEA_STAFF_EMAIL（Gate A staff）；E2E_AUTH_STAFF_EMAIL←GATEA_STAFF_EMAIL（Gate A staff）

## 摘要（末段）
```
  -  15 [chromium] › e2e/auth-login.user-role-admin.spec.ts:45:3 › auth-login（可選，user-role-admin） › staff 呼叫 admin-user-role-set API 會回 403

  4 skipped
  11 passed (36.6s)

npm warn Unknown env config "devdir". This will stop working in the next major version of npm.
[WebServer] npm warn Unknown env config "devdir". This will stop working in the next major version of npm.
[WebServer] npm warn Unknown env config "devdir". This will stop working in the next major version of npm.
(node:77019) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:77019) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
```
