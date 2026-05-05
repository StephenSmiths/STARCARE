import type { StaffOverviewRow } from '../services/staffManagementService'
import { StaffProfileEditForm } from './StaffProfileEditForm'

export interface StaffProfileEditSheetProps {
  open: boolean
  row: StaffOverviewRow | null
  actorId: string
  onClose: () => void
  onSaved: () => void
}

/** PDF 02【13】單筆維護主檔（Seq 26）；僅 TeamLead／Admin 可成功呼叫 Edge */
export const StaffProfileEditSheet = ({ open, row, actorId, onClose, onSaved }: StaffProfileEditSheetProps) => {
  if (!open || !row) return null
  return <StaffProfileEditForm row={row} actorId={actorId} onClose={onClose} onSaved={onSaved} />
}
