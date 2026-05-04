import { AuditTrailPanel } from '../../shared/components/AuditTrailPanel'
import { useAuditTrailList } from '../../shared/hooks/useAuditTrailList'
import { uiTokens } from '../../shared/ui/uiTokens'
import { useRehabActivityTracking } from '../hooks/useRehabActivityTracking'
import { RehabTrackSection } from './RehabTrackSection'

/** PDF 02【8】復康活動追蹤（兩軌獨立） */
export const RehabActivityTrackingHome = () => {
  const auditTrail = useAuditTrailList()
  const { loadError, isLoading, rehabSnapshot, dementiaSnapshot, reload } = useRehabActivityTracking()

  if (isLoading) {
    return <p className={uiTokens.moduleDescription}>載入兩軌追蹤資料…</p>
  }

  if (loadError) {
    return (
      <div className={uiTokens.layoutSpaceY2}>
        <p className={uiTokens.formInlineError}>{loadError}</p>
        <button type="button" className={uiTokens.btnSecondary} onClick={() => void reload()}>
          重試
        </button>
      </div>
    )
  }

  return (
    <div className={uiTokens.stackVertical}>
      <p className={uiTokens.moduleDescription}>
        以下為依目前院友與活動時段之<strong>乾跑預覽</strong>（未儲存排班、不寫入 SCHEDULING_RUN）；正式採用以智能排班頁為準。
      </p>
      <RehabTrackSection snapshot={rehabSnapshot} showDementiaColumn={false} />
      <RehabTrackSection snapshot={dementiaSnapshot} showDementiaColumn />
      <AuditTrailPanel
        title="復康／排班相關審計（全域）"
        help="本頁乾跑不寫 SCHEDULING_RUN；其他模組之排班／匯出審計仍見此處（PDF 02【8】／Seq 12）。"
        auditTrail={auditTrail}
      />
    </div>
  )
}
