import type { FormEvent } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { ResidentInput } from '../types/resident'
import { ResidentsSingleResidentFormBasicFields } from './ResidentsSingleResidentFormBasicFields'
import { ResidentsSingleResidentFormCareFundingFields } from './ResidentsSingleResidentFormCareFundingFields'

interface ResidentsSingleResidentFormProps {
  form: ResidentInput
  submitLabel: string
  onChange: (next: ResidentInput) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  onReset: () => void
  /** 送出中鎖定按鈕，防重覆提交（對齊業務 PDF） */
  isSubmitting?: boolean
  /** 置於 Drawer／全螢幕層內時省略頂部外距 */
  embedded?: boolean
}

/** 新增／編輯單一院友表單（對齊院友管理 SOP 欄位） */
export const ResidentsSingleResidentForm = ({
  form,
  submitLabel,
  onChange,
  onSubmit,
  onReset,
  isSubmitting = false,
  embedded = false,
}: ResidentsSingleResidentFormProps) => (
  <form
    className={embedded ? uiTokens.residentFormGrid : uiTokens.residentFormGridMt3}
    onSubmit={onSubmit}
    aria-busy={isSubmitting}
  >
    <ResidentsSingleResidentFormBasicFields form={form} onChange={onChange} />
    <ResidentsSingleResidentFormCareFundingFields form={form} onChange={onChange} />
    <div className={uiTokens.layoutFlexWrapGap2}>
      <button className={uiTokens.btnPrimary} type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送出中…' : submitLabel}
      </button>
      <button className={uiTokens.btnSecondary} type="button" disabled={isSubmitting} onClick={onReset}>
        清空
      </button>
    </div>
  </form>
)
