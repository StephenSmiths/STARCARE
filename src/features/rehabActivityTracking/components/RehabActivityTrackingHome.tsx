import { uiTokens } from '../../shared/ui/uiTokens'
import { useRehabActivityTracking } from '../hooks/useRehabActivityTracking'
import { RehabTrackSection } from './RehabTrackSection'

/** PDF 02【8】復康活動追蹤（兩軌獨立） */
export const RehabActivityTrackingHome = () => {
  const { loadError, isLoading, rehabSnapshot, dementiaSnapshot, reload } = useRehabActivityTracking()

  if (isLoading) {
    return <p className="text-sm text-slate-600">載入兩軌追蹤資料…</p>
  }

  if (loadError) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-700">{loadError}</p>
        <button type="button" className={uiTokens.btnSecondary} onClick={() => void reload()}>
          重試
        </button>
      </div>
    )
  }

  return (
    <div className={uiTokens.stackVertical}>
      <p className="text-sm text-slate-600">
        以下為依目前院友與活動時段之<strong>乾跑預覽</strong>（未儲存排班、不寫入 SCHEDULING_RUN）；正式採用以智能排班頁為準。
      </p>
      <RehabTrackSection snapshot={rehabSnapshot} showDementiaColumn={false} />
      <RehabTrackSection snapshot={dementiaSnapshot} showDementiaColumn />
    </div>
  )
}
