import { uiTokens } from '../../shared/ui/uiTokens'
import { useActivitySessionList } from '../hooks/useActivitySessionList'

interface ActivitySessionListPanelProps {
  actorId: string
  /** 與 `view:activity-sessions-import`／Edge 軟刪一致 */
  canMaintainSessions: boolean
}

export const ActivitySessionListPanel = ({ actorId, canMaintainSessions }: ActivitySessionListPanelProps) => {
  const { rows, isLoading, error, busySessionId, softDeleteSession } = useActivitySessionList('facility-main')
  const softDeleteLocked = busySessionId !== null

  return (
    <section className="mt-4 rounded-md border border-slate-200 p-3 text-sm" aria-labelledby="activity-session-list-heading">
      <div className="flex items-center justify-between gap-2">
        <h3 id="activity-session-list-heading" className={uiTokens.blockHeading}>
          活動時段列表{canMaintainSessions ? '（可軟刪除）' : ''}
        </h3>
        <span className="text-xs text-slate-500">共 {rows.length} 筆</span>
      </div>
      <p className={uiTokens.blockHelp}>依 Seq 10：刪除僅標記 `is_deleted`，不做硬刪除。</p>
      {isLoading ? <p className="mt-2 text-xs text-slate-500">載入中...</p> : null}
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
      {!isLoading && !error && rows.length === 0 ? (
        <p className="mt-2 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-500">
          目前沒有可顯示的活動時段。
        </p>
      ) : null}
      {rows.length > 0 ? (
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-2 py-2">日期</th>
                <th className="px-2 py-2">時段</th>
                <th className="px-2 py-2">員工</th>
                <th className="px-2 py-2">容量</th>
                <th className="px-2 py-2">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-2 py-2">{row.sessionDate}</td>
                  <td className="px-2 py-2">{row.timeSlot}</td>
                  <td className="px-2 py-2">{row.staffName}</td>
                  <td className="px-2 py-2">{row.capacity}</td>
                  <td className="px-2 py-2">
                    {canMaintainSessions ? (
                      <button
                        type="button"
                        disabled={softDeleteLocked}
                        onClick={() => void softDeleteSession(actorId, row)}
                        className={`${uiTokens.btnDangerOutline} disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {busySessionId === row.id ? '處理中…' : '軟刪除'}
                      </button>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
