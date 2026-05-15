/**
 * 合併 Gate C Playwright 用環境：E2E_AUTH_* 優先；缺時由 GATEA_STAFF_* 補主路徑／Staff。
 * 不推測 Admin／TeamLead（仍須明確設定 E2E_AUTH_ADMIN_* 等）。
 */
/** @param {Record<string, string | undefined>} base */
export function resolveGateCE2EEnv(base) {
  /** @type {Record<string, string>} */
  const out = { ...base }
  const notes = []

  const copyIfMissing = (targetEmail, targetPwd, srcEmail, srcPwd, label) => {
    const hasTarget = Boolean(String(out[targetEmail] ?? '').trim() && String(out[targetPwd] ?? '').trim())
    if (hasTarget) return
    const email = String(out[srcEmail] ?? '').trim()
    const pwd = String(out[srcPwd] ?? '').trim()
    if (!email || !pwd) return
    out[targetEmail] = email
    out[targetPwd] = pwd
    notes.push(`${targetEmail}←${srcEmail}（${label}）`)
  }

  copyIfMissing('E2E_AUTH_EMAIL', 'E2E_AUTH_PASSWORD', 'GATEA_STAFF_EMAIL', 'GATEA_STAFF_PASSWORD', 'Gate A staff')
  copyIfMissing(
    'E2E_AUTH_STAFF_EMAIL',
    'E2E_AUTH_STAFF_PASSWORD',
    'GATEA_STAFF_EMAIL',
    'GATEA_STAFF_PASSWORD',
    'Gate A staff',
  )

  return { env: out, notes }
}
