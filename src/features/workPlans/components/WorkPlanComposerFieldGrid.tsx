import { useMemo, useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { Resident } from '../../residents/types/resident'
import type { StaffOverviewRow } from '../../staff/services/staffManagementService'
import type { StaffProfileRoleType } from '../../../services/schedulingService'
import type { WorkPlanContentOption } from '../constants/workPlanCascadeCatalog'
import type { WorkPlanActivityType, WorkPlanDraftLine } from '../services/workPlanDraftService'

/** 工作計劃 Composer：日期／員工／時段／名額／服務類型（PDF 02【2】） */
export const WorkPlanComposerFieldGrid = ({
  sessionDate,
  onSessionDateChange,
  staffRows,
  staffProfileId,
  onStaffProfileIdChange,
  staffRoleType,
  startTime,
  onStartTimeChange,
  durationMinutes,
  onDurationMinutesChange,
  activityType,
  allowedActivityTypes,
  onActivityTypeChange,
  residents,
  residentIds,
  onToggleResident,
  activityContent,
  contentOptions,
  onActivityContentChange,
  activityContentOther,
  onActivityContentOtherChange,
  activityDetail,
  detailOptions,
  onActivityDetailChange,
  activityDetailOther,
  onActivityDetailOtherChange,
  capacity,
  onCapacityChange,
  maxGroupCapacity,
  serviceType,
  onServiceTypeChange,
}: {
  sessionDate: string
  onSessionDateChange: (value: string) => void
  staffRows: StaffOverviewRow[]
  staffProfileId: string
  onStaffProfileIdChange: (value: string) => void
  staffRoleType: StaffProfileRoleType
  startTime: string
  onStartTimeChange: (value: string) => void
  durationMinutes: number
  onDurationMinutesChange: (value: number) => void
  activityType: WorkPlanActivityType
  allowedActivityTypes: WorkPlanActivityType[]
  onActivityTypeChange: (value: WorkPlanActivityType) => void
  residents: Resident[]
  residentIds: string[]
  onToggleResident: (id: string) => void
  activityContent: string
  contentOptions: WorkPlanContentOption[]
  onActivityContentChange: (value: string) => void
  activityContentOther: string
  onActivityContentOtherChange: (value: string) => void
  activityDetail: string
  detailOptions: string[]
  onActivityDetailChange: (value: string) => void
  activityDetailOther: string
  onActivityDetailOtherChange: (value: string) => void
  capacity: number
  onCapacityChange: (value: number) => void
  maxGroupCapacity: number
  serviceType: WorkPlanDraftLine['serviceType']
  onServiceTypeChange: (value: WorkPlanDraftLine['serviceType']) => void
}) => (
  <WorkPlanComposerFieldGridInner
    sessionDate={sessionDate}
    onSessionDateChange={onSessionDateChange}
    staffRows={staffRows}
    staffProfileId={staffProfileId}
    onStaffProfileIdChange={onStaffProfileIdChange}
    staffRoleType={staffRoleType}
    startTime={startTime}
    onStartTimeChange={onStartTimeChange}
    durationMinutes={durationMinutes}
    onDurationMinutesChange={onDurationMinutesChange}
    activityType={activityType}
    allowedActivityTypes={allowedActivityTypes}
    onActivityTypeChange={onActivityTypeChange}
    residents={residents}
    residentIds={residentIds}
    onToggleResident={onToggleResident}
    activityContent={activityContent}
    contentOptions={contentOptions}
    onActivityContentChange={onActivityContentChange}
    activityContentOther={activityContentOther}
    onActivityContentOtherChange={onActivityContentOtherChange}
    activityDetail={activityDetail}
    detailOptions={detailOptions}
    onActivityDetailChange={onActivityDetailChange}
    activityDetailOther={activityDetailOther}
    onActivityDetailOtherChange={onActivityDetailOtherChange}
    capacity={capacity}
    onCapacityChange={onCapacityChange}
    maxGroupCapacity={maxGroupCapacity}
    serviceType={serviceType}
    onServiceTypeChange={onServiceTypeChange}
  />
)

const WorkPlanComposerFieldGridInner = ({
  sessionDate,
  onSessionDateChange,
  staffRows,
  staffProfileId,
  onStaffProfileIdChange,
  staffRoleType,
  startTime,
  onStartTimeChange,
  durationMinutes,
  onDurationMinutesChange,
  activityType,
  allowedActivityTypes,
  onActivityTypeChange,
  residents,
  residentIds,
  onToggleResident,
  activityContent,
  contentOptions,
  onActivityContentChange,
  activityContentOther,
  onActivityContentOtherChange,
  activityDetail,
  detailOptions,
  onActivityDetailChange,
  activityDetailOther,
  onActivityDetailOtherChange,
  capacity,
  onCapacityChange,
  maxGroupCapacity,
  serviceType,
  onServiceTypeChange,
}: {
  sessionDate: string
  onSessionDateChange: (value: string) => void
  staffRows: StaffOverviewRow[]
  staffProfileId: string
  onStaffProfileIdChange: (value: string) => void
  staffRoleType: StaffProfileRoleType
  startTime: string
  onStartTimeChange: (value: string) => void
  durationMinutes: number
  onDurationMinutesChange: (value: number) => void
  activityType: WorkPlanActivityType
  allowedActivityTypes: WorkPlanActivityType[]
  onActivityTypeChange: (value: WorkPlanActivityType) => void
  residents: Resident[]
  residentIds: string[]
  onToggleResident: (id: string) => void
  activityContent: string
  contentOptions: WorkPlanContentOption[]
  onActivityContentChange: (value: string) => void
  activityContentOther: string
  onActivityContentOtherChange: (value: string) => void
  activityDetail: string
  detailOptions: string[]
  onActivityDetailChange: (value: string) => void
  activityDetailOther: string
  onActivityDetailOtherChange: (value: string) => void
  capacity: number
  onCapacityChange: (value: number) => void
  maxGroupCapacity: number
  serviceType: WorkPlanDraftLine['serviceType']
  onServiceTypeChange: (value: WorkPlanDraftLine['serviceType']) => void
}) => {
  const [residentQuery, setResidentQuery] = useState('')
  const filteredResidents = useMemo(() => {
    const q = residentQuery.trim().toLowerCase()
    if (!q) return residents
    return residents.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.bedNumber.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q),
    )
  }, [residents, residentQuery])

  return <div className={uiTokens.composerFieldGrid}>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>日期</span>
      <input
        type="date"
        className={uiTokens.formInput}
        value={sessionDate}
        onChange={(event) => onSessionDateChange(event.target.value)}
      />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>員工</span>
      <select
        className={uiTokens.formSelect}
        value={staffProfileId}
        onChange={(event) => onStaffProfileIdChange(event.target.value)}
      >
        <option value="">請選擇</option>
        {staffRows.map((row) => (
          <option key={row.staffId} value={row.staffId}>
            {row.roleType ? `${row.staffName}（${row.roleType}）` : row.staffName} · {row.staffId}
          </option>
        ))}
      </select>
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>開始時間</span>
      <input
        type="time"
        className={uiTokens.formInput}
        value={startTime}
        onChange={(event) => onStartTimeChange(event.target.value)}
      />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>時長（分鐘）</span>
      <select
        className={uiTokens.formSelect}
        value={durationMinutes}
        onChange={(event) => onDurationMinutesChange(Number(event.target.value))}
      >
        {[15, 30, 45, 60, 75, 90, 105, 120].map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>員工職位（自動帶入）</span>
      <input className={uiTokens.formInput} value={staffRoleType} disabled readOnly />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>活動類型</span>
      <select
        className={uiTokens.formSelect}
        value={activityType}
        onChange={(event) => onActivityTypeChange(event.target.value as WorkPlanActivityType)}
      >
        {allowedActivityTypes.map((item) => (
          <option key={item} value={item}>
            {item === 'Individual' ? '個別訓練' : item === 'Group' ? '小組訓練' : item === 'Assessment' ? '評估' : '其他'}
          </option>
        ))}
      </select>
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>活動內容</span>
      <select
        className={uiTokens.formSelect}
        value={activityContent}
        onChange={(event) => onActivityContentChange(event.target.value)}
      >
        <option value="">請選擇</option>
        {contentOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.value}
          </option>
        ))}
      </select>
    </label>
    {activityContent === '其他' ? (
      <label className={uiTokens.formFieldStack}>
        <span className={uiTokens.formLabel}>活動內容（其他）</span>
        <textarea
          className={uiTokens.formTextarea}
          value={activityContentOther}
          onChange={(event) => onActivityContentOtherChange(event.target.value)}
        />
      </label>
    ) : null}
    {detailOptions.length > 0 ? (
      <label className={uiTokens.formFieldStack}>
        <span className={uiTokens.formLabel}>活動細項</span>
        <select
          className={uiTokens.formSelect}
          value={activityDetail}
          onChange={(event) => onActivityDetailChange(event.target.value)}
        >
          <option value="">請選擇</option>
          {detailOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    ) : null}
    {activityDetail === '其他細項' ? (
      <label className={uiTokens.formFieldStack}>
        <span className={uiTokens.formLabel}>活動細項（其他）</span>
        <input
          className={uiTokens.formInput}
          value={activityDetailOther}
          onChange={(event) => onActivityDetailOtherChange(event.target.value)}
        />
      </label>
    ) : null}
    <label className={uiTokens.formFieldStackSmColSpan2Lg1}>
      <span className={uiTokens.formLabel}>名額</span>
      <input
        type="number"
        min={1}
        max={maxGroupCapacity}
        className={uiTokens.formInput}
        value={capacity}
        onChange={(event) => onCapacityChange(Number(event.target.value))}
      />
    </label>
    <label className={uiTokens.formFieldStackSmColSpan2Lg1}>
      <span className={uiTokens.formLabel}>服務類型（01 §3 軌道）</span>
      <select
        className={uiTokens.formSelect}
        value={serviceType}
        onChange={(event) =>
          onServiceTypeChange(event.target.value as WorkPlanDraftLine['serviceType'])
        }
      >
        <option value="Subsidized_Rehab">資助復康服務</option>
        <option value="Dementia_Care">認知障礙症服務</option>
      </select>
    </label>
    <div className={uiTokens.formFieldStackSmColSpan2Lg1}>
      <span className={uiTokens.formLabel}>選擇院友</span>
      <p className={uiTokens.textSubtleXs}>已選 {residentIds.length} 位；顯示 {filteredResidents.length} / {residents.length}</p>
      <input
        className={uiTokens.formInputMt3TextXs}
        placeholder="搜尋院友（姓名 / 床號 / ID）"
        value={residentQuery}
        onChange={(event) => setResidentQuery(event.target.value)}
      />
      <div className="mt-2 max-h-56 overflow-y-auto rounded border border-slate-200 p-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {filteredResidents.map((row) => (
            <label key={row.id} className={uiTokens.layoutFlexItemsCenterGap2}>
              <input
                type="checkbox"
                checked={residentIds.includes(row.id)}
                onChange={() => onToggleResident(row.id)}
              />
              <span>
                {row.name}
                <span className={uiTokens.textSubtleXs}>（{row.bedNumber || '—'}）</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
}
