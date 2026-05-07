import { uiTokens } from '../../shared/ui/uiTokens'
import type { ResidentInput } from '../types/resident'
import { calculateAgeFromBirthDate, isValidBirthDate } from '../utils/residentBirthDate'

/** 基本身分與入住／評估日期欄位（院友管理 SOP） */
export type ResidentsSingleResidentFormBasicFieldsProps = {
  form: ResidentInput
  onChange: (next: ResidentInput) => void
}

export const ResidentsSingleResidentFormBasicFields = ({
  form,
  onChange,
}: ResidentsSingleResidentFormBasicFieldsProps) => (
  <>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>姓名</span>
      <input
        className={uiTokens.formInput}
        placeholder="請輸入院友姓名"
        value={form.name}
        onChange={(event) => onChange({ ...form, name: event.target.value })}
      />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>床號</span>
      <input
        className={uiTokens.formInput}
        placeholder="例如 A-12"
        value={form.bedNumber}
        onChange={(event) => onChange({ ...form, bedNumber: event.target.value })}
      />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>區域</span>
      <input
        className={uiTokens.formInput}
        placeholder="例如 2/F 東翼"
        value={form.area}
        onChange={(event) => onChange({ ...form, area: event.target.value })}
      />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>出生日期（YYYY-MM-DD）</span>
      <input
        className={uiTokens.formInput}
        type="date"
        value={form.birthDate}
        onChange={(event) => {
          const nextBirthDate = event.target.value
          onChange({
            ...form,
            birthDate: nextBirthDate,
            age: isValidBirthDate(nextBirthDate) ? calculateAgeFromBirthDate(nextBirthDate) : form.age,
          })
        }}
      />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>入住日期（YYYY-MM-DD）</span>
      <input
        className={uiTokens.formInput}
        type="date"
        value={form.admissionDate}
        onChange={(event) => onChange({ ...form, admissionDate: event.target.value })}
      />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>下次評估到期日（可選）</span>
      <input
        className={uiTokens.formInput}
        type="date"
        value={form.assessmentNextDueDate ?? ''}
        onChange={(event) =>
          onChange({
            ...form,
            assessmentNextDueDate: event.target.value === '' ? null : event.target.value,
          })
        }
      />
      <span className={uiTokens.helpFinePrint}>PDF 01 §4.3；留白則依入住日 180 天估算（Seq 9）</span>
    </label>
  </>
)
