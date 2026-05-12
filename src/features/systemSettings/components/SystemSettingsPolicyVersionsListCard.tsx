import type { SchedulingPolicyVersionSummary } from '../../../repositories/schedulingPolicyTypes'
import { uiTokens } from '../../shared/ui/uiTokens'

const formatLocal = (iso: string): string => {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return iso
  return new Date(t).toLocaleString('zh-HK', { dateStyle: 'medium', timeStyle: 'short' })
}

export type SystemSettingsPolicyVersionsListCardProps = {
  edgeEnabled: boolean
  loadError: string | null
  isPolicyLoading: boolean
  versions: SchedulingPolicyVersionSummary[]
}

/** PRD §4：已建立政策版本列（唯讀）；資料來自 scheduling-policy-versions-list */
export const SystemSettingsPolicyVersionsListCard = ({
  edgeEnabled,
  loadError,
  isPolicyLoading,
  versions,
}: SystemSettingsPolicyVersionsListCardProps) => {
  if (!edgeEnabled) return null

  if (loadError) {
    return (
      <article className={uiTokens.surfaceCard}>
        <h3 className={uiTokens.pageSectionHeading}>政策版本列表（雲端）</h3>
        <p className={uiTokens.sectionHelp}>
          依 effective_from 新→舊排列（最多 50 筆）；含 scheduled／active／superseded，供稽核與確認未來生效稿。
        </p>
        <p className={uiTokens.inlineNoticeWarn} role="status">
          無法載入版本列表；請查看本段下方「提交政策版本」卡片之錯誤訊息（與「目前政策版本」載入同源）。
        </p>
      </article>
    )
  }

  return (
    <article className={uiTokens.surfaceCard}>
      <h3 className={uiTokens.pageSectionHeading}>政策版本列表（雲端）</h3>
      <p className={uiTokens.sectionHelp}>
        依 effective_from 新→舊排列（最多 50 筆）；含 scheduled／active／superseded，供稽核與確認未來生效稿。
      </p>
      {isPolicyLoading ? (
        <p className={uiTokens.sectionHelp}>載入版本列表中…</p>
      ) : versions.length === 0 ? (
        <p className={uiTokens.panelMutedInset}>尚無已提交之政策版本列。</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm text-slate-800">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="py-2 pr-3">生效起</th>
                <th className="py-2 pr-3">狀態</th>
                <th className="py-2 pr-3">變更摘要</th>
                <th className="py-2 pr-3">建立時間</th>
                <th className="py-2">版本 id</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.id} className="border-b border-slate-100">
                  <td className="py-2 pr-3 align-top whitespace-nowrap">{formatLocal(v.effectiveFrom)}</td>
                  <td className="py-2 pr-3 align-top">{v.status}</td>
                  <td className="py-2 pr-3 align-top break-words">{v.changeSummary || '—'}</td>
                  <td className="py-2 pr-3 align-top whitespace-nowrap text-xs">{formatLocal(v.createdAt)}</td>
                  <td className="py-2 align-top font-mono text-[11px] text-slate-600">{v.id.slice(0, 8)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  )
}
