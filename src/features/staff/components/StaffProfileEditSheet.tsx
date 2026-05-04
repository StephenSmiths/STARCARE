import { useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import {
  staffManagementService,
  type StaffOverviewRow,
  type StaffServiceScope,
} from '../services/staffManagementService'

const ROLE_OPTIONS = ['PT', 'OT', 'PTA', 'OTA', 'TeamLead'] as const
const SCOPE_OPTIONS: StaffServiceScope[] = ['Subsidized_Rehab', 'Dementia_Care', 'Both']

export interface StaffProfileEditSheetProps {
  open: boolean
  row: StaffOverviewRow | null
  actorId: string
  onClose: () => void
  onSaved: () => void
}

type InnerProps = Omit<StaffProfileEditSheetProps, 'open' | 'row'> & { row: StaffOverviewRow }

/** 僅於 `open && row` 時掛載，故 `useState` 初值即來自當前列（無 effect 同步） */
const StaffProfileEditForm = ({ row, actorId, onClose, onSaved }: InnerProps) => {
  const [name, setName] = useState(row.staffName)
  const [roleType, setRoleType] = useState<(typeof ROLE_OPTIONS)[number]>(row.roleType ?? 'PT')
  const [serviceScope, setServiceScope] = useState<StaffServiceScope>(row.serviceScope ?? 'Both')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const canSave = Boolean(row.roleType && row.serviceScope)

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('顯示名稱不可為空')
      return
    }
    if (!canSave) {
      setError('缺少主檔職類或服務範圍，請確認已部署 staff-profiles-list 並重新整理。')
      return
    }
    setBusy(true)
    setError('')
    try {
      await staffManagementService.updateStaffProfile(
        actorId,
        {
          staffId: row.staffId,
          displayName: trimmed,
          roleType,
          serviceScope,
        },
        { staffName: row.staffName, roleType: row.roleType, serviceScope: row.serviceScope },
      )
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : '儲存失敗')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className={uiTokens.modalBackdrop}
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={uiTokens.modalPanelSheetMd} onClick={(e) => e.stopPropagation()}>
        <h3 className={uiTokens.blockHeading}>編輯員工主檔</h3>
        <p className={uiTokens.helpFinePrint}>ID：{row.staffId}</p>
        {!canSave ? (
          <p className={uiTokens.textUrgentHintMt2}>此列尚無完整主檔（職類／服務範圍），無法寫入後端。</p>
        ) : null}
        <div className={uiTokens.stackVerticalMt3}>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>顯示名稱</span>
            <input className={uiTokens.formInput} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>職類</span>
            <select
              className={uiTokens.formSelect}
              value={roleType}
              onChange={(e) => setRoleType(e.target.value as (typeof ROLE_OPTIONS)[number])}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className={uiTokens.formFieldStack}>
            <span className={uiTokens.formLabel}>服務範圍</span>
            <select
              className={uiTokens.formSelect}
              value={serviceScope}
              onChange={(e) => setServiceScope(e.target.value as StaffServiceScope)}
            >
              {SCOPE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          {error ? <p className={uiTokens.formInlineErrorXs}>{error}</p> : null}
        </div>
        <div className={uiTokens.formFooterActions}>
          <button type="button" className={uiTokens.btnSecondary} onClick={onClose} disabled={busy}>
            取消
          </button>
          <button type="button" className={uiTokens.btnPrimary} onClick={() => void submit()} disabled={busy || !canSave}>
            {busy ? '儲存中…' : '儲存'}
          </button>
        </div>
      </div>
    </div>
  )
}

/** PDF 02【13】單筆維護主檔（Seq 26）；僅 TeamLead／Admin 可成功呼叫 Edge */
export const StaffProfileEditSheet = ({ open, row, actorId, onClose, onSaved }: StaffProfileEditSheetProps) => {
  if (!open || !row) return null
  return <StaffProfileEditForm row={row} actorId={actorId} onClose={onClose} onSaved={onSaved} />
}
