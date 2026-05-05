import { uiTokens } from '../../shared/ui/uiTokens'
import type { StaffOverviewRow } from '../../staff/services/staffManagementService'
import type { WorkPlanDraftLine } from '../services/workPlanDraftService'

/** 工作計劃 Composer：日期／員工／時段／名額／服務類型（PDF 02【2】） */
export const WorkPlanComposerFieldGrid = ({
  sessionDate,
  onSessionDateChange,
  staffRows,
  staffProfileId,
  onStaffProfileIdChange,
  timeSlot,
  onTimeSlotChange,
  capacity,
  onCapacityChange,
  serviceType,
  onServiceTypeChange,
}: {
  sessionDate: string
  onSessionDateChange: (value: string) => void
  staffRows: StaffOverviewRow[]
  staffProfileId: string
  onStaffProfileIdChange: (value: string) => void
  timeSlot: string
  onTimeSlotChange: (value: string) => void
  capacity: number
  onCapacityChange: (value: number) => void
  serviceType: WorkPlanDraftLine['serviceType']
  onServiceTypeChange: (value: WorkPlanDraftLine['serviceType']) => void
}) => (
  <div className={uiTokens.composerFieldGrid}>
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
      <span className={uiTokens.formLabel}>時段</span>
      <input
        className={uiTokens.formInput}
        value={timeSlot}
        onChange={(event) => onTimeSlotChange(event.target.value)}
        placeholder="09:00"
      />
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>名額</span>
      <input
        type="number"
        min={1}
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
  </div>
)
