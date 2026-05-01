import { existsSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const DELIVERY_ROOT = 'delivery'
const PHASE5_PREFIX = 'phase5-day1-'

const isPhase5Artifact = (name) => name.startsWith(PHASE5_PREFIX)

if (!existsSync(DELIVERY_ROOT)) {
  console.log('[phase5-clean] delivery/ 不存在，無需清理。')
  process.exit(0)
}

const entries = readdirSync(DELIVERY_ROOT)
const targets = entries.filter(isPhase5Artifact)

if (targets.length === 0) {
  console.log('[phase5-clean] 找不到 phase5-day1 交付產物。')
  process.exit(0)
}

for (const target of targets) {
  rmSync(join(DELIVERY_ROOT, target), { recursive: true, force: true })
}

console.log(`[phase5-clean] 已清理 ${targets.length} 個項目。`)
for (const target of targets) {
  console.log(`- ${join(DELIVERY_ROOT, target)}`)
}
