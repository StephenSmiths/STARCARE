import type { FormEvent } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { ResidentInput } from '../types/resident'

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
    className={`grid gap-3 text-sm ${embedded ? '' : 'mt-3'}`}
    onSubmit={onSubmit}
    aria-busy={isSubmitting}
  >
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
      <span className={uiTokens.formLabel}>年齡</span>
      <input
        className={uiTokens.formInput}
        type="number"
        value={form.age}
        onChange={(event) => onChange({ ...form, age: Number(event.target.value) })}
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
      <span className="text-[11px] text-slate-500">PDF 01 §4.3；留白則依入住日 180 天估算（Seq 9）</span>
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>健康狀況</span>
      <textarea
        className={uiTokens.formTextarea}
        placeholder="例如：高血壓、糖尿病"
        value={form.healthCondition}
        onChange={(event) => onChange({ ...form, healthCondition: event.target.value })}
      />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>用藥記錄</span>
      <textarea
        className={uiTokens.formTextarea}
        placeholder="例如：每日早晚服藥"
        value={form.medicationRecord}
        onChange={(event) => onChange({ ...form, medicationRecord: event.target.value })}
      />
    </label>
    <label className={`flex items-center gap-2 ${uiTokens.formLabel}`}>
      <input type="checkbox" checked={form.isSpecialCareCase} onChange={(event) => onChange({ ...form, isSpecialCareCase: event.target.checked })} />
      Special Care 個案
    </label>
    <div className="grid grid-cols-2 gap-2">
      <select className={uiTokens.formSelect} value={form.gender} onChange={(event) => onChange({ ...form, gender: event.target.value as ResidentInput['gender'] })}>
        <option value="Female">女</option>
        <option value="Male">男</option>
      </select>
      <select className={uiTokens.formSelect} value={form.fundingType} onChange={(event) => onChange({ ...form, fundingType: event.target.value as ResidentInput['fundingType'] })}>
        <option value="GradeA_Subsidized">甲一買位</option>
        <option value="Voucher">院舍券</option>
        <option value="Private">私位</option>
      </select>
      <select className={uiTokens.formSelect} value={form.serviceType} onChange={(event) => onChange({ ...form, serviceType: event.target.value as ResidentInput['serviceType'] })}>
        <option value="Subsidized_Rehab">資助復康服務</option>
        <option value="Dementia_Service">認知障礙症服務</option>
        <option value="Both">兩者皆有</option>
      </select>
      <select className={uiTokens.formSelect} value={form.dementiaLevel} onChange={(event) => onChange({ ...form, dementiaLevel: event.target.value as ResidentInput['dementiaLevel'] })}>
        <option value="None">沒有認知障礙</option>
        <option value="Mild">輕度</option>
        <option value="Moderate">中度</option>
        <option value="Severe">重度</option>
      </select>
    </div>
    <div className="flex flex-wrap gap-2">
      <button className={uiTokens.btnPrimary} type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送出中…' : submitLabel}
      </button>
      <button className={uiTokens.btnSecondary} type="button" disabled={isSubmitting} onClick={onReset}>
        清空
      </button>
    </div>
  </form>
)
