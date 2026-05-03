import { uiTokens } from '../../shared/ui/uiTokens'
import type { ServiceFormRecord } from '../types/serviceForm'
import { statusZh } from './serviceFormStaffPanelUtils'

type Props = {
  forms: ServiceFormRecord[]
  onLoadForm: (row: ServiceFormRecord) => void
  onSoftDelete: (row: ServiceFormRecord) => void
}

/** 01 §5：Staff 我的表單列表（含軟刪除入口，Seq 10） */
export const ServiceFormMyFormsList = ({ forms, onLoadForm, onSoftDelete }: Props) => {
  if (forms.length === 0) {
    return <p className="mt-2 text-sm text-slate-500">尚無紀錄。</p>
  }
  return (
    <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 text-sm">
      {forms.map((row) => (
        <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
          <div>
            <span className="font-medium">{row.sessionDate}</span>
            <span className="ml-2 text-slate-600">{row.residentName}</span>
            <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs">{statusZh(row.status)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={uiTokens.linkDownload} onClick={() => onLoadForm(row)}>
              {row.status === 'APPROVED' || row.status === 'SUBMITTED' ? '檢視' : '載入編輯'}
            </button>
            {row.status !== 'APPROVED' ? (
              <button type="button" className={uiTokens.btnDangerOutline} onClick={() => onSoftDelete(row)}>
                軟刪除
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
