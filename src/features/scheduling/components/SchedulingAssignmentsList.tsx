import type { SchedulingAssignment } from '../../../services/schedulingService'
import { uiTokens } from '../../shared/ui/uiTokens'

/** 本次排班指派條列（Pass／session id） */
export const SchedulingAssignmentsList = ({
  assignments,
}: {
  assignments: SchedulingAssignment[]
}) => (
  <div className={uiTokens.surfaceCardCompact}>
    <h3 className={uiTokens.blockHeading}>本次排班指派</h3>
    {assignments.length === 0 ? (
      <p className={uiTokens.sectionHelp}>尚未執行排班，請點選右上角「啟動智能排班」。</p>
    ) : (
      <ul className={uiTokens.schedulingAssignmentList}>
        {assignments.map((a) => (
          <li key={`${a.sessionId}-${a.residentId}`} className={uiTokens.layoutListItemPy2}>
            <span className={uiTokens.reviewQueueTitle}>{a.residentName}</span>
            <span className={uiTokens.residentListPagerMetaMl2}>Pass {a.pass}</span>
            <span className={uiTokens.textSubtleXsMl2Slate400}>（{a.sessionId}）</span>
          </li>
        ))}
      </ul>
    )}
  </div>
)
