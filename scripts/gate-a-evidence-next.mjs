/**
 * Gate A「下一步」指引 stdout；末段附 **`gateAStandardCloseoutBlockquotes`** 兩行 blockquote（**第一行**併主日誌 **Gate A／stdout** 細列歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**；**第二行**併 **人工／strict-http／keep=1**；字串見 **`scripts/gate-a-markdown-footer.mjs`** **Export 契約**）。細目見 **`docs/gate-a-status-2026-05-06-commands-appendix.md`** **`gatea:evidence:next`** 說明段。
 */
import { gateAStandardCloseoutBlockquotes } from './gate-a-markdown-footer.mjs'
import { computeGateAReadyState, recommendNextCommand } from './gate-a-ready-core.mjs'

const s = computeGateAReadyState()
const rec = recommendNextCommand(s)

const lines = []
lines.push('# Gate A Next Steps')
lines.push('')
lines.push(`- 當前狀態：\`${s.ready ? 'READY' : 'NOT_READY'}\``)
lines.push('')

if (s.ready) {
  lines.push('## 建議動作')
  lines.push('- 進行 Gate A 判定與簽核。')
  lines.push(`- 建議先跑：\`${rec.command}\`（${rec.reason}）`)
  lines.push(
    '- 再確認：`npm run gatea:evidence:latest`（寫入 `docs/evidence/gate-a-latest.md`；檔尾 blockquote 四行：`gateALatestMarkdownFooterLines`，敘述見 `docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment` 下文 `latest` 段）；人工／strict-http／keep=1：`docs/gate-a-manual-evidence-checklist-2026-05-06.md` 開首',
  )
} else {
  lines.push('## 缺口導向')
  lines.push(`- 建議先跑：\`${rec.command}\`（${rec.reason}）`)
  if (!s.ok403 && rec.command !== 'npm run gatea:evidence:http') {
    lines.push('- 備註：或手動帶 token 跑 `npm run gatea:evidence:http`')
  }
  lines.push('- 環境／目錄診斷：`npm run gatea:evidence:preflight`；嚴格檢查：`npm run gatea:evidence:preflight:strict`')
  lines.push('- 跑總流程：`npm run gatea:evidence:all`')
  lines.push(`- doctor 完成度：${s.doctorTotal > 0 ? `${s.doctorDone}/${s.doctorTotal}` : '未找到 doctor'}`)
  lines.push('- 補人工截圖後再檢查：`npm run gatea:evidence:ready -- --strict`')
  lines.push('- 人工／strict-http／keep=1：`docs/gate-a-manual-evidence-checklist-2026-05-06.md` 開首')
}

lines.push(``)
lines.push(...gateAStandardCloseoutBlockquotes())

process.stdout.write(`${lines.join('\n')}\n`)
