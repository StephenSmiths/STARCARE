import { useState } from 'react'
import type { PolicyValidateError } from '../../../repositories/schedulingPolicyTypes'
import { uiTokens } from '../../shared/ui/uiTokens'

const defaultEffectiveLocal = (): string => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export type SystemSettingsPolicySubmitCardProps = {
  edgeEnabled: boolean
  loadError: string | null
  /** 與並行讀取同源：載入中不允許提交，避免 baseBundle 尚未就緒 */
  isPolicyLoading: boolean
  validateErrors: PolicyValidateError[]
  submitMessage: string | null
  isSubmitting: boolean
  onSubmit: (p: { effectiveFromLocal: string; changeSummary: string; confirmed: boolean }) => void | Promise<void>
}

/** P1：生效時間、變更原因、二次確認後呼叫 Edge validate／commit */
export const SystemSettingsPolicySubmitCard = ({
  edgeEnabled,
  loadError,
  isPolicyLoading,
  validateErrors,
  submitMessage,
  isSubmitting,
  onSubmit,
}: SystemSettingsPolicySubmitCardProps) => {
  const [eff, setEff] = useState(defaultEffectiveLocal)
  const [summary, setSummary] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  if (!edgeEnabled) {
    return (
      <article className={uiTokens.surfaceCard}>
        <p className={uiTokens.sectionHelp}>
          未偵測到 Supabase 環境變數，僅可使用本機儲存。Staging／正式環境請設定 VITE_SUPABASE_URL 與 ANON_KEY。
        </p>
      </article>
    )
  }

  return (
    <article className={uiTokens.surfaceCard}>
      <p className={uiTokens.sectionHelp}>
        PRD §4「新建版本」：呼叫 scheduling-policy-version-validate／commit；須 Team Lead／Admin。契約見
        docs/scheduling-policy-edge-function-contract.md。
      </p>
      {loadError ? <p className={uiTokens.bannerDanger}>{loadError}</p> : null}
      <div className={uiTokens.settingsFieldGrid}>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>生效時間（本地）</span>
          <input type="datetime-local" className={uiTokens.formInput} value={eff} onChange={(e) => setEff(e.target.value)} />
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>變更原因／備註（必填）</span>
          <textarea className={uiTokens.formInput} rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </label>
        <label className={uiTokens.formToggleLabel}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          我已閱讀並確認此變更對排班／報表之影響（二次確認）
        </label>
      </div>
      {validateErrors.length > 0 ? (
        <ul className={uiTokens.listDiscInsideTight} role="alert">
          {validateErrors.map((er) => (
            <li key={`${er.code}-${er.message}`}>
              {er.code}：{er.message}
            </li>
          ))}
        </ul>
      ) : null}
      {submitMessage ? <p className={uiTokens.inlineSuccessText}>{submitMessage}</p> : null}
      <button
        type="button"
        className={uiTokens.btnPrimary}
        disabled={isSubmitting || isPolicyLoading}
        onClick={() => void onSubmit({ effectiveFromLocal: eff, changeSummary: summary, confirmed })}
      >
        提交政策版本
      </button>
    </article>
  )
}
