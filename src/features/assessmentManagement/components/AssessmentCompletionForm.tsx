import { useState, type FormEvent } from 'react'
import type { Resident } from '../../residents/types/resident'
import { uiTokens } from '../../shared/ui/uiTokens'

type Props = {
  residents: Resident[]
  submitError: string
  isSubmitting: boolean
  onSubmit: (residentId: string, ptVersion: string, otVersion: string) => Promise<void>
}

/** PDF 02【9】補登目前錨點之 PT／OT 版本（尚缺之科必填） */
export const AssessmentCompletionForm = ({
  residents,
  submitError,
  isSubmitting,
  onSubmit,
}: Props) => {
  const [residentId, setResidentId] = useState('')
  const [ptVersion, setPtVersion] = useState('')
  const [otVersion, setOtVersion] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit(residentId, ptVersion, otVersion)
  }

  return (
    <div className={uiTokens.surfaceCard}>
      <h2 className={uiTokens.blockHeading}>登錄評估完成（PT／OT 版本）</h2>
      <p className={uiTokens.blockHelp}>以「最近已過錨點」為準；若僅缺單科可只填該科。</p>
      <form className="mt-4 flex flex-col gap-4" onSubmit={(ev) => void handleSubmit(ev)}>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>院友</span>
          <select
            className={uiTokens.formSelect}
            value={residentId}
            onChange={(ev) => setResidentId(ev.target.value)}
            required
          >
            <option value="">請選擇</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}（{r.bedNumber}）
              </option>
            ))}
          </select>
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>PT 版本標籤</span>
          <input
            className={uiTokens.formInput}
            value={ptVersion}
            onChange={(ev) => setPtVersion(ev.target.value)}
            placeholder="若本週期仍需 PT 請填"
          />
        </label>
        <label className={uiTokens.formFieldStack}>
          <span className={uiTokens.formLabel}>OT 版本標籤</span>
          <input
            className={uiTokens.formInput}
            value={otVersion}
            onChange={(ev) => setOtVersion(ev.target.value)}
            placeholder="若本週期仍需 OT 請填"
          />
        </label>
        {submitError ? <p className="text-sm text-red-700">{submitError}</p> : null}
        <button type="submit" className={uiTokens.btnPrimary} disabled={isSubmitting}>
          {isSubmitting ? '儲存中…' : '提交紀錄'}
        </button>
      </form>
    </div>
  )
}
