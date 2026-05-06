import { hydrateProcessEnvMissingFromDotenv } from './gate-a-env-lib.mjs'

hydrateProcessEnvMissingFromDotenv()

const url = process.env.VITE_SUPABASE_URL
const anon = process.env.VITE_SUPABASE_ANON_KEY
const staffEmail = process.env.GATEA_STAFF_EMAIL
const staffPassword = process.env.GATEA_STAFF_PASSWORD

if (!url || !anon) throw new Error('缺少 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY')
if (!staffEmail || !staffPassword) throw new Error('缺少 GATEA_STAFF_EMAIL 或 GATEA_STAFF_PASSWORD')

const authRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: anon,
  },
  body: JSON.stringify({ email: staffEmail, password: staffPassword }),
})
if (!authRes.ok) {
  const text = await authRes.text()
  throw new Error(`staff 登入取 token 失敗（HTTP ${authRes.status}）：${text}`)
}
const authJson = await authRes.json()
const token = authJson?.access_token
if (typeof token !== 'string' || !token) throw new Error('未取得 access_token')

process.stdout.write(`已取得 staff token（${staffEmail}）\n`)
process.env.GATEA_STAFF_ACCESS_TOKEN = token

const { spawnSync } = await import('node:child_process')
const out = spawnSync('node', ['scripts/gate-a-http-evidence.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, GATEA_STAFF_ACCESS_TOKEN: token },
})
if (out.status !== 0) {
  throw new Error(`執行 gate-a-http-evidence 失敗，exit=${out.status}`)
}
