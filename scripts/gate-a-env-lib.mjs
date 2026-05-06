/**
 * Gate A：讀取 repo 根目錄 `.env`，與目前程序環境合併規則為「已存在於 `process.env` 的鍵不被覆寫」。
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function readRepoDotenv(cwd = process.cwd()) {
  const envPath = resolve(cwd, '.env')
  if (!existsSync(envPath)) return {}
  const text = readFileSync(envPath, 'utf8')
  /** @type {Record<string, string>} */
  const out = {}
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const k = line.slice(0, eq).trim()
    const v = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    out[k] = v
  }
  return out
}

/** 僅補上 `process.env` 尚未出現的鍵（單跑 HTTP 取證時可讀到 `.env` 內 VITE_*／GATEA_*）。 */
export function hydrateProcessEnvMissingFromDotenv(cwd = process.cwd()) {
  const parsed = readRepoDotenv(cwd)
  for (const [k, v] of Object.entries(parsed)) {
    if (!Object.prototype.hasOwnProperty.call(process.env, k)) {
      process.env[k] = v
    }
  }
}

/** `spawn` 用：等同 `{ ...dotenv, ...process.env }`，shell／CI 優先。 */
export function buildSpawnBaseEnv(cwd = process.cwd()) {
  return { ...readRepoDotenv(cwd), ...process.env }
}

/** `--strict-http` 或 `GATEA_STRICT_HTTP`=1／true／yes（經合併環境後）。 */
export function gateAStrictHttpEnabled(argv, env) {
  if (argv.includes('--strict-http')) return true
  const v = String(env.GATEA_STRICT_HTTP ?? '').trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}
