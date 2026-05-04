import type { SchedulingConflict } from '../../../services/schedulingService'
import { uiTokens } from '../../shared/ui/uiTokens'

interface SchedulingConflictsPanelProps {
  conflicts: SchedulingConflict[]
}

/** 排班衝突檢索區塊 */
export const SchedulingConflictsPanel = ({ conflicts }: SchedulingConflictsPanelProps) => {
  if (conflicts.length === 0) {
    return <div className={uiTokens.calloutOk}>本次排班未偵測到衝突。</div>
  }
  return (
    <div className={uiTokens.calloutWarn}>
      <p className={uiTokens.textSemiboldAmber950}>排班衝突檢索</p>
      <ul className={uiTokens.conflictBulletList}>
        {conflicts.map((conflict) => (
          <li key={`${conflict.residentId}-${conflict.type}-${conflict.reason}`}>
            {conflict.residentName}：{conflict.type}（{conflict.reason}）
          </li>
        ))}
      </ul>
    </div>
  )
}
