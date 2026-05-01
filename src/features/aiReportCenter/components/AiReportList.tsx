import type { AiReportRecord } from '../types/aiReportCenter'
import { uiTokens } from '../../shared/ui/uiTokens'

const statusLabel = (s: AiReportRecord['status']): string => {
  if (s === 'DRAFT') return '草稿'
  if (s === 'ADOPTED') return '已採用'
  return '已發放'
}

type Props = {
  rows: AiReportRecord[]
  editId: string | null
  editBody: string
  onEditBody: (value: string) => void
  onOpenDraft: (row: AiReportRecord) => void
  onSaveBody: () => void
  onAdopt: (id: string) => void
  onDistribute: (id: string) => void
}

/** 報告列表：草稿可編輯／採用；已採用可發放 */
export const AiReportList = ({
  rows,
  editId,
  editBody,
  onEditBody,
  onOpenDraft,
  onSaveBody,
  onAdopt,
  onDistribute,
}: Props) => (
  <div className="space-y-4">
    {rows.length === 0 ? (
      <p className="text-sm text-slate-600">尚無報告，請先建立草稿。</p>
    ) : (
      rows.map((row) => (
        <div key={row.id} className={uiTokens.surfaceCardCompact}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">{row.title}</p>
              <p className="text-xs text-slate-500">
                {statusLabel(row.status)} · {row.createdAt.slice(0, 16).replace('T', ' ')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {row.status === 'DRAFT' ? (
                <>
                  <button type="button" className={uiTokens.btnSecondary} onClick={() => onOpenDraft(row)}>
                    {editId === row.id ? '編輯中' : '載入編輯'}
                  </button>
                  <button type="button" className={uiTokens.btnPrimary} onClick={() => onAdopt(row.id)}>
                    採用版本
                  </button>
                </>
              ) : null}
              {row.status === 'ADOPTED' ? (
                <button type="button" className={uiTokens.btnAccent} onClick={() => onDistribute(row.id)}>
                  發放
                </button>
              ) : null}
            </div>
          </div>
          {row.status === 'DRAFT' && editId === row.id ? (
            <div className="mt-3 space-y-2">
              <label className={uiTokens.formFieldStack}>
                <span className={uiTokens.formLabel}>內容</span>
                <textarea
                  className={uiTokens.formTextarea}
                  rows={8}
                  value={editBody}
                  onChange={(ev) => onEditBody(ev.target.value)}
                />
              </label>
              <button type="button" className={uiTokens.btnSuccess} onClick={() => onSaveBody()}>
                儲存內容
              </button>
            </div>
          ) : (
            <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs text-slate-800">
              {row.bodyText}
            </pre>
          )}
          {row.adoptedAt ? (
            <p className="mt-2 text-[11px] text-slate-500">採用時間：{row.adoptedAt}</p>
          ) : null}
          {row.distributedAt ? (
            <p className="text-[11px] text-slate-500">發放時間：{row.distributedAt}</p>
          ) : null}
        </div>
      ))
    )}
  </div>
)
