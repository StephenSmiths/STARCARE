import { useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { ServiceFormsWorkspace } from '../hooks/useServiceFormsWorkspace'

/** PDF 02【5】主管審核待提交表單（TeamLead／Admin） */
export const ServiceFormReviewPanel = ({ workspace }: { workspace: ServiceFormsWorkspace }) => {
  const [rejectNote, setRejectNote] = useState('')
  const [targetId, setTargetId] = useState<string | null>(null)

  if (workspace.role === 'Staff') {
    return (
      <section className={uiTokens.surfaceCardCompactDimmed}>
        <h2 className={uiTokens.blockHeading}>表單審核</h2>
        <p className={uiTokens.moduleDescription}>Staff 無審批權限（01 §1）。</p>
      </section>
    )
  }

  const runApprove = (formId: string) => {
    const row = workspace.pendingReview.find((item) => item.id === formId)
    if (!row) return
    try {
      workspace.approve(row)
      window.alert('已核准')
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '核准失敗')
    }
  }

  const runSoftDelete = async (formId: string) => {
    if (!window.confirm('確定軟刪除此待審表單？（01 §5，將標記 is_deleted）')) return
    const row = workspace.pendingReview.find((item) => item.id === formId)
    if (!row) return
    try {
      await workspace.softDelete(row)
      window.alert('已軟刪除')
      setTargetId(null)
      setRejectNote('')
      void workspace.reloadContext()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '軟刪除失敗')
    }
  }

  const runReject = () => {
    if (!targetId) return
    const row = workspace.pendingReview.find((item) => item.id === targetId)
    if (!row) return
    try {
      workspace.rejectRevision(row, rejectNote)
      window.alert('已退回')
      setRejectNote('')
      setTargetId(null)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '退回失敗')
    }
  }

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>待審服務表單</h2>
      <p className={uiTokens.sectionHelp}>01 §2.2：僅 SUBMITTED 可核准／退回；不可審批本人（§1）。</p>
      {workspace.pendingReview.length === 0 ? (
        <p className={uiTokens.emptyStateMuted}>目前沒有待審項目。</p>
      ) : (
        <ul className={uiTokens.reviewQueueStack}>
          {workspace.pendingReview.map((row) => (
            <li key={row.id} className={uiTokens.reviewQueueItem}>
              <p className={uiTokens.reviewQueueTitle}>
                {row.sessionDate} · {row.residentName} · 填表人 actor：{row.ownerActorId.slice(0, 8)}…
              </p>
              <p className={uiTokens.reviewQueueNarrative}>{row.narrative}</p>
              <div className={uiTokens.reviewActionRow}>
                <button type="button" className={uiTokens.btnSuccess} onClick={() => runApprove(row.id)}>
                  核准
                </button>
                <button
                  type="button"
                  className={uiTokens.btnDangerOutline}
                  onClick={() => setTargetId(targetId === row.id ? null : row.id)}
                >
                  {targetId === row.id ? '取消退回' : '退回重改'}
                </button>
                <button type="button" className={uiTokens.btnCompact} onClick={() => void runSoftDelete(row.id)}>
                  軟刪除
                </button>
              </div>
              {targetId === row.id ? (
                <div className={uiTokens.reviewRejectBlock}>
                  <textarea
                    className={uiTokens.formTextarea}
                    placeholder="請填寫退回原因（必填）"
                    value={rejectNote}
                    onChange={(event) => setRejectNote(event.target.value)}
                  />
                  <button type="button" className={uiTokens.btnPrimary} onClick={() => void runReject()}>
                    確認退回
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
