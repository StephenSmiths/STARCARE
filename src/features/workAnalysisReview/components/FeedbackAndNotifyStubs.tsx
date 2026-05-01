import { useState } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'

const FEEDBACK_KEY = 'starcare-work-analysis-feedback-draft-v1'

const loadDraft = (): string => {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(FEEDBACK_KEY) ?? ''
  } catch {
    return ''
  }
}

const saveDraft = (text: string): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(FEEDBACK_KEY, text)
}

/** PDF 02【7】回饋（本地草稿）／通知占位 */
export const FeedbackAndNotifyStubs = () => {
  const [feedback, setFeedback] = useState(() => loadDraft())

  const persist = () => {
    saveDraft(feedback)
    window.alert('回饋草稿已儲存於瀏覽器（正式版應入庫並寫審計）')
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className={uiTokens.surfaceCardCompact}>
        <h2 className={uiTokens.blockHeading}>回饋</h2>
        <p className={uiTokens.sectionHelp}>記錄對團隊表現或流程之回饋草稿（不取代表單審核批示）。</p>
        <textarea
          className={`${uiTokens.formTextarea} mt-2`}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="例：本週待審偏長，建議…"
          rows={4}
        />
        <button type="button" className={`${uiTokens.btnCompact} mt-2`} onClick={persist}>
          儲存回饋草稿
        </button>
      </section>
      <section className={uiTokens.surfaceCardCompact}>
        <h2 className={uiTokens.blockHeading}>通知</h2>
        <p className="text-sm text-slate-600">
          推播／站內通知將於 <strong>Seq 27【14】通知中心</strong> 統一規劃；本頁可先搭配團隊報告文字手動發送。
        </p>
      </section>
    </div>
  )
}
