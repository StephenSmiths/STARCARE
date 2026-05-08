import { useAuth } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useStaffSingleCreate, type StaffSingleCreateFormState } from '../hooks/useStaffSingleCreate'

type StaffSingleCreateCardProps = {
  actorId: string
  onCreated?: () => void
}

export const StaffSingleCreateCard = ({ actorId, onCreated }: StaffSingleCreateCardProps) => {
  const { hasPermission } = useAuth()
  const canCreate = hasPermission('view:staff-import')
  const { form, setForm, submit, errorMessage, successMessage, isSubmitting } = useStaffSingleCreate(onCreated)

  if (!canCreate) return null

  return (
    <article className={uiTokens.surfaceCard}>
      <h2 className={uiTokens.pageSectionHeading}>單筆新增員工</h2>
      <p className={uiTokens.sectionHelp}>TeamLead／Admin 專用；院舍與服務範圍由系統預設（與批量範本一致）。</p>
      <div className={uiTokens.stackVerticalMt3}>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>員工編號（可留空自動產生）</span>
          <input
            className={uiTokens.formInput}
            value={form.id}
            onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
            disabled={isSubmitting}
          />
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>姓名</span>
          <input
            className={uiTokens.formInput}
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            disabled={isSubmitting}
            required
          />
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>職位</span>
          <select
            className={uiTokens.formSelect}
            value={form.roleType}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                roleType: e.target.value as StaffSingleCreateFormState['roleType'],
              }))
            }
            disabled={isSubmitting}
          >
            <option value="">請選擇</option>
            <option value="PT">PT</option>
            <option value="PTA">PTA</option>
            <option value="OT">OT</option>
            <option value="OTA">OTA</option>
          </select>
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>性別</span>
          <select
            className={uiTokens.formSelect}
            value={form.gender}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                gender: e.target.value as StaffSingleCreateFormState['gender'],
              }))
            }
            disabled={isSubmitting}
          >
            <option value="">請選擇</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>聯絡電話</span>
          <input
            className={uiTokens.formInput}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            disabled={isSubmitting}
          />
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>電子郵箱</span>
          <input
            className={uiTokens.formInput}
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            disabled={isSubmitting}
          />
        </label>
      </div>
      {errorMessage ? <p className={uiTokens.formInlineErrorMt2Xs}>{errorMessage}</p> : null}
      {successMessage ? <p className={uiTokens.textSuccessSm}>{successMessage}</p> : null}
      <button
        type="button"
        className={uiTokens.btnPrimaryMt3WFit}
        disabled={isSubmitting}
        onClick={() => void submit(actorId)}
      >
        {isSubmitting ? '送出中…' : '新增員工'}
      </button>
    </article>
  )
}
