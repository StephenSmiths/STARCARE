import { uiTokens } from '../../shared/ui/uiTokens'

type Props = {
  titleInput: string
  onTitleChange: (value: string) => void
  onGenerate: () => void
}

/** PDF 02【11】生成占位草稿（後端 AI 未接前） */
export const AiReportComposer = ({ titleInput, onTitleChange, onGenerate }: Props) => (
  <div className={`${uiTokens.surfaceCardCompact} flex flex-col gap-3 sm:flex-row sm:items-end`}>
    <label className={`${uiTokens.formFieldStack} min-w-[12rem] flex-1`}>
      <span className={uiTokens.formLabel}>報告標題</span>
      <input
        className={uiTokens.formInput}
        value={titleInput}
        onChange={(ev) => onTitleChange(ev.target.value)}
        placeholder="例如：本週復康服務摘要"
      />
    </label>
    <button type="button" className={uiTokens.btnAccent} onClick={() => onGenerate()}>
      生成草稿（占位）
    </button>
  </div>
)
