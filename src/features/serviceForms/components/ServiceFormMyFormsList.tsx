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
    return <p className={uiTokens.emptyStateMuted}>尚無紀錄。</p>
  }
  return (
    <ul className={uiTokens.myFormsList}>
      {forms.map((row) => (
        <li key={row.id} className={uiTokens.myFormsListRow}>
          <div>
            <span className={uiTokens.textWeightMedium}>{row.sessionDate}</span>
            <span className={uiTokens.textMutedBodyMl2}>{row.residentName}</span>
            <span className={uiTokens.metaChipMl2}>{statusZh(row.status)}</span>
          </div>
          <div className={uiTokens.layoutFlexWrapGap2}>
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
