import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { hydrateProcessEnvMissingFromDotenv } from './gate-a-env-lib.mjs'

hydrateProcessEnvMissingFromDotenv()

const url = process.env.VITE_SUPABASE_URL
const anon = process.env.VITE_SUPABASE_ANON_KEY
const staffToken = process.env.GATEA_STAFF_ACCESS_TOKEN

if (!url || !anon) {
  throw new Error('缺少 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY')
}

const outDir = resolve(process.cwd(), 'docs/evidence')
mkdirSync(outDir, { recursive: true })

const ts = new Date().toISOString().replaceAll(':', '').replace('T', '-').slice(0, 19)
const endpoint = `${url}/functions/v1/admin-user-role-set`
const body = JSON.stringify({ targetEmail: 'nobody@example.com', role: 'staff' })

const toText = async (res) => {
  const text = await res.text()
  const headers = [...res.headers.entries()].map(([k, v]) => `${k}: ${v}`).join('\n')
  return `HTTP ${res.status}\n${headers}\n\n${text}\n`
}

// 401: 無 Authorization header
const r401 = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', apikey: anon },
  body,
})
const p401 = resolve(outDir, `gate-a-d2-401-admin-user-role-set-${ts}.txt`)
writeFileSync(p401, await toText(r401), 'utf8')

let p403 = ''
if (staffToken) {
  // 403: staff token 呼叫 admin-only edge
  const r403 = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anon,
      Authorization: `Bearer ${staffToken}`,
    },
    body,
  })
  p403 = resolve(outDir, `gate-a-d2-403-admin-user-role-set-${ts}.txt`)
  writeFileSync(p403, await toText(r403), 'utf8')
}

process.stdout.write(`401 evidence: ${p401}\n`)
if (p403) {
  process.stdout.write(`403 evidence: ${p403}\n`)
} else {
  process.stdout.write('403 evidence: skipped (set GATEA_STAFF_ACCESS_TOKEN to enable)\n')
}
