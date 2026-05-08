import { uiTokens } from '../../shared/ui/uiTokens'
import type { WorkPlanDraftLine } from '../services/workPlanDraftService'

/** 預覽列表（草稿列與移除） */
export const WorkPlanComposerDraftPreview = ({
  drafts,
  onRemoveDraft,
}: {
  drafts: WorkPlanDraftLine[]
  onRemoveDraft: (index: number) => void
}) => (
  <div className={uiTokens.composerPreviewShell}>
    <h3 className={uiTokens.blockHeading}>預覽列表</h3>
    {drafts.length === 0 ? (
      <p className={uiTokens.blockHelpMt2}>尚無列；請填妥上方欄位後按「加入預覽」。</p>
    ) : (
      <ul className={uiTokens.composerDraftList}>
        {drafts.map((row, index) => (
          <li
            key={`${row.sessionDate}-${row.staffProfileId}-${row.timeSlot}-${index}`}
            className={uiTokens.layoutFlexWrapBetweenGap2Py2}
          >
            <span>
              {row.sessionDate} · {row.staffDisplayName || row.staffProfileId}（{row.staffRoleType}）·{' '}
              {row.timeSlot} · 名額 {row.capacity} ·{' '}
              {row.activityType === 'Individual'
                ? '個別訓練'
                : row.activityType === 'Group'
                  ? '小組訓練'
                  : row.activityType === 'Assessment'
                    ? '評估'
                    : '其他'}{' '}
              · {row.serviceType === 'Subsidized_Rehab' ? '資助復康服務' : '認知障礙症服務'}
            </span>
            <button type="button" className={uiTokens.btnDangerOutline} onClick={() => onRemoveDraft(index)}>
              移除
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
)
