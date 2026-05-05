import { uiTokens } from '../../shared/ui/uiTokens'
import type { ResidentInput } from '../types/resident'

/** 健康／用藥、資助與服務類型選項（院友管理 SOP） */
export type ResidentsSingleResidentFormCareFundingFieldsProps = {
  form: ResidentInput
  onChange: (next: ResidentInput) => void
}

export const ResidentsSingleResidentFormCareFundingFields = ({
  form,
  onChange,
}: ResidentsSingleResidentFormCareFundingFieldsProps) => (
  <>
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
    <label className={uiTokens.residentFormCheckboxLabel}>
      <input
        type="checkbox"
        checked={form.isSpecialCareCase}
        onChange={(event) => onChange({ ...form, isSpecialCareCase: event.target.checked })}
      />
      Special Care 個案
    </label>
    <div className={uiTokens.layoutGrid2ColGap2}>
      <select
        className={uiTokens.formSelect}
        value={form.gender}
        onChange={(event) => onChange({ ...form, gender: event.target.value as ResidentInput['gender'] })}
      >
        <option value="Female">女</option>
        <option value="Male">男</option>
      </select>
      <select
        className={uiTokens.formSelect}
        value={form.fundingType}
        onChange={(event) =>
          onChange({ ...form, fundingType: event.target.value as ResidentInput['fundingType'] })
        }
      >
        <option value="GradeA_Subsidized">甲一買位</option>
        <option value="Voucher">院舍券</option>
        <option value="Private">私位</option>
      </select>
      <select
        className={uiTokens.formSelect}
        value={form.serviceType}
        onChange={(event) =>
          onChange({ ...form, serviceType: event.target.value as ResidentInput['serviceType'] })
        }
      >
        <option value="Subsidized_Rehab">資助復康服務</option>
        <option value="Dementia_Service">認知障礙症服務</option>
        <option value="Both">兩者皆有</option>
      </select>
      <select
        className={uiTokens.formSelect}
        value={form.dementiaLevel}
        onChange={(event) =>
          onChange({ ...form, dementiaLevel: event.target.value as ResidentInput['dementiaLevel'] })
        }
      >
        <option value="None">沒有認知障礙</option>
        <option value="Mild">輕度</option>
        <option value="Moderate">中度</option>
        <option value="Severe">重度</option>
      </select>
    </div>
  </>
)
