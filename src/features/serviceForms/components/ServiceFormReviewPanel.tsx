import { useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { ServiceFormsWorkspace } from '../hooks/useServiceFormsWorkspace'

/** PDF 02【5】主管審核待提交表單（TeamLead／Admin） */
export const ServiceFormReviewPanel = ({ workspace }: { workspace: ServiceFormsWorkspace }) => {
  const [rejectNote, setRejectNote] = useState('')
  const [targetId, setTargetId] = useState<string | null>(null)

  if (workspace.role === 'Staff') {
    return (
      <section className={`${uiTokens.surfaceCardCompact} opacity-70`}>
        <h2 className={uiTokens.blockHeading}>表單審核</h2>
        <p className="text-sm text-slate-600">Staff 無審批權限（01 §1）。</p>
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
        <p className="mt-3 text-sm text-slate-500">目前沒有待審項目。</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {workspace.pendingReview.map((row) => (
            <li key={row.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-medium text-slate-900">
                {row.sessionDate} · {row.residentName} · 填表人 actor：{row.ownerActorId.slice(0, 8)}…
              </p>
              <p className="mt-2 whitespace-pre-wrap text-slate-700">{row.narrative}</p>
              <div className="mt-3 flex flex-wrap gap-2">
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
              </div>
              {targetId === row.id ? (
                <div className="mt-3 space-y-2">
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
