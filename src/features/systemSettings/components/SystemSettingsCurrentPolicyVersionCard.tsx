import type { SchedulingPolicyVersionSummary } from '../../../repositories/schedulingPolicyTypes'
import { uiTokens } from '../../shared/ui/uiTokens'

const formatLocal = (iso: string): string => {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return iso
  return new Date(t).toLocaleString('zh-HK', { dateStyle: 'medium', timeStyle: 'short' })
}

export type SystemSettingsCurrentPolicyVersionCardProps = {
  edgeEnabled: boolean
  loadError: string | null
  isPolicyLoading: boolean
  version: SchedulingPolicyVersionSummary | null
}

/** PRD §4：目前生效（或最新載入）政策版本唯讀摘要 */
export const SystemSettingsCurrentPolicyVersionCard = ({
  edgeEnabled,
  loadError,
  isPolicyLoading,
  version,
}: SystemSettingsCurrentPolicyVersionCardProps) => {
  if (!edgeEnabled) return null

  return (
    <article className={uiTokens.surfaceCard}>
      <h3 className={uiTokens.pageSectionHeading}>目前政策版本（雲端摘要）</h3>
      <p className={uiTokens.sectionHelp}>對照 PRD §4：載入自 scheduling-policy-current-get；供 TL／Admin 確認寫入標的。</p>
      {loadError ? (
        <p className={uiTokens.inlineNoticeWarn}>無法載入版本摘要（詳見下方「政策版本」區錯誤訊息）。</p>
      ) : isPolicyLoading ? (
        <p className={uiTokens.sectionHelp}>載入雲端政策版本中…</p>
      ) : !version ? (
        <p className={uiTokens.panelMutedInset}>
          尚無政策版本資料（可能尚未首次提交，或後端回傳 legacy 聚合）。提交成功後將顯示版本 id、狀態與生效時間。
        </p>
      ) : (
        <dl className="mt-3 grid gap-2 text-sm text-slate-800 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-slate-500">版本 id（前綴）</dt>
            <dd className="font-mono text-xs">{version.id.slice(0, 8)}…</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">狀態</dt>
            <dd>{version.status}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">生效起（UTC 存、此處本地顯示）</dt>
            <dd>{formatLocal(version.effectiveFrom)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">建立時間</dt>
            <dd>{formatLocal(version.createdAt)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-slate-500">變更摘要</dt>
            <dd className="whitespace-pre-wrap break-words">{version.changeSummary || '—'}</dd>
          </div>
        </dl>
      )}
    </article>
  )
}
