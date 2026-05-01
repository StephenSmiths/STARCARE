import { existsSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const DELIVERY_ROOT = 'delivery'
const PHASE4_PREFIX = 'phase4-'

const isPhase4Artifact = (name) => name.startsWith(PHASE4_PREFIX)

if (!existsSync(DELIVERY_ROOT)) {
  console.log('[phase4-clean] delivery/ 不存在，無需清理。')
  process.exit(0)
}

const entries = readdirSync(DELIVERY_ROOT)
const targets = entries.filter(isPhase4Artifact)

if (targets.length === 0) {
  console.log('[phase4-clean] 找不到 phase4 交付產物。')
  process.exit(0)
}

for (const target of targets) {
  rmSync(join(DELIVERY_ROOT, target), { recursive: true, force: true })
}

console.log(`[phase4-clean] 已清理 ${targets.length} 個項目。`)
for (const target of targets) {
  console.log(`- ${join(DELIVERY_ROOT, target)}`)
}
