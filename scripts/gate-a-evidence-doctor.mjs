import { readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const evidenceDir = resolve(process.cwd(), 'docs/evidence')
const files = readdirSync(evidenceDir, { withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => d.name)

const hasExact = (name) => files.includes(name)
const hasIncludes = (needle) => files.some((f) => f.includes(needle))

const checks = [
  { key: 'd2_admin_login', label: 'D2 admin 登入截圖', ok: hasExact('gateA-d2-admin-login-2026-05-06.png') },
  { key: 'd2_staff_login', label: 'D2 staff 登入截圖', ok: hasExact('gateA-d2-staff-login-2026-05-06.png') },
  {
    key: 'd2_401',
    label: 'D2 401 證據（文字或截圖）',
    ok: hasIncludes('d2-401-admin-user-role-set') || hasExact('gateA-d2-401-2026-05-06.png'),
  },
  {
    key: 'd2_403',
    label: 'D2 403 證據（文字或截圖）',
    ok: hasIncludes('d2-403-admin-user-role-set') || hasExact('gateA-d2-403-admin-user-role-set-2026-05-06.png'),
  },
  { key: 'd2_user_roles_sql', label: 'D2 user_roles SQL 截圖', ok: hasExact('gateA-d2-user-roles-sql-2026-05-06.png') },
  { key: 'd3_save_success', label: 'D3 排班儲存成功截圖', ok: hasExact('gateA-d3-scheduling-save-success-2026-05-06.png') },
  { key: 'd3_sql', label: 'D3 scheduling_history SQL 截圖', ok: hasExact('gateA-d3-scheduling-history-sql-2026-05-06.png') },
  { key: 'd4_ui', label: 'D4 USER_RBAC_ROLE_SET 截圖', ok: hasExact('gateA-d4-user-rbac-role-set-ui-2026-05-06.png') },
  { key: 'd4_sql', label: 'D4 audit_events SQL 截圖', ok: hasExact('gateA-d4-audit-events-sql-2026-05-06.png') },
  { key: 'd4_rls_staff', label: 'D4 RLS staff 截圖', ok: hasExact('gateA-d4-rls-staff-2026-05-06.png') },
  { key: 'd4_rls_teamlead', label: 'D4 RLS teamlead 截圖', ok: hasExact('gateA-d4-rls-teamlead-2026-05-06.png') },
  { key: 'd4_rls_admin', label: 'D4 RLS admin 截圖', ok: hasExact('gateA-d4-rls-admin-2026-05-06.png') },
]

const done = checks.filter((c) => c.ok).length
const total = checks.length
const missing = checks.filter((c) => !c.ok)

const lines = []
lines.push('# Gate A Evidence Doctor')
lines.push('')
lines.push(`- 完成度：${done} / ${total}`)
lines.push(`- 缺口數：${missing.length}`)
lines.push('')
lines.push('## 檢查結果')
for (const c of checks) {
  lines.push(`- [${c.ok ? 'x' : ' '}] ${c.label}`)
}

if (missing.length > 0) {
  lines.push('')
  lines.push('## 建議下一步')
  if (missing.some((m) => m.key === 'd2_403')) {
    lines.push(
      '- 先補 403：`npm run gatea:evidence:http:auth`（需 `.env` 之 GATEA_STAFF_EMAIL／PASSWORD）；或於 `.env` 設 GATEA_STAFF_ACCESS_TOKEN 後跑 `gatea:evidence:http`',
    )
  }
  lines.push('- 跑一次總同步：`npm run gatea:evidence:all`')
  lines.push('- 補人工截圖後再跑：`npm run gatea:evidence:doctor`')
}

const output = `${lines.join('\n')}\n`
const shouldWrite = process.argv.includes('--write')

if (shouldWrite) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-')
  const outPath = resolve(evidenceDir, `gate-a-evidence-doctor-${stamp}.md`)
  writeFileSync(outPath, output, 'utf8')
  process.stdout.write(`${output}\n[saved] ${outPath}\n`)
} else {
  process.stdout.write(output)
}
