import { uiTokens } from '../../shared/ui/uiTokens'
import { useActivitySessionList } from '../hooks/useActivitySessionList'

interface ActivitySessionListPanelProps {
  actorId: string
  /** 與 `view:activity-sessions-import`／Edge 軟刪一致 */
  canMaintainSessions: boolean
}

export const ActivitySessionListPanel = ({ actorId, canMaintainSessions }: ActivitySessionListPanelProps) => {
  const { rows, isLoading, error, busySessionId, softDeleteSession } = useActivitySessionList()
  const softDeleteLocked = busySessionId !== null

  return (
    <section className={uiTokens.residentImportSectionMt4} aria-labelledby="activity-session-list-heading">
      <div className={uiTokens.layoutFlexBetweenGap2}>
        <h3 id="activity-session-list-heading" className={uiTokens.blockHeading}>
          活動時段列表{canMaintainSessions ? '（可軟刪除）' : ''}
        </h3>
        <span className={uiTokens.textSubtleXs}>共 {rows.length} 筆</span>
      </div>
      <p className={uiTokens.blockHelp}>依 Seq 10：刪除僅標記 `is_deleted`，不做硬刪除。</p>
      {isLoading ? <p className={uiTokens.textSubtleXsMt2}>載入中...</p> : null}
      {error ? <p className={uiTokens.formInlineErrorMt2Xs}>{error}</p> : null}
      {!isLoading && !error && rows.length === 0 ? (
        <p className={uiTokens.emptyInlineMutedBox}>目前沒有可顯示的活動時段。</p>
      ) : null}
      {rows.length > 0 ? (
        <div className={uiTokens.tableScrollTall}>
          <table className={uiTokens.tableCompact}>
            <thead className={uiTokens.tableHeadSticky}>
              <tr>
                <th className={uiTokens.tableCell}>日期</th>
                <th className={uiTokens.tableCell}>時段</th>
                <th className={uiTokens.tableCell}>員工</th>
                <th className={uiTokens.tableCell}>容量</th>
                <th className={uiTokens.tableCell}>操作</th>
              </tr>
            </thead>
            <tbody className={uiTokens.tableBodyDivided}>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className={uiTokens.tableCellNowrap}>{row.sessionDate}</td>
                  <td className={uiTokens.tableCell}>{row.timeSlot}</td>
                  <td className={uiTokens.tableCell}>{row.staffName}</td>
                  <td className={uiTokens.tableCell}>{row.capacity}</td>
                  <td className={uiTokens.tableCell}>
                    {canMaintainSessions ? (
                      <button
                        type="button"
                        disabled={softDeleteLocked}
                        onClick={() => void softDeleteSession(actorId, row)}
                        className={uiTokens.btnDangerOutlineDisabled}
                      >
                        {busySessionId === row.id ? '處理中…' : '軟刪除'}
                      </button>
                    ) : (
                      <span className={uiTokens.textSubtleXsMuted400}>—</span>
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
