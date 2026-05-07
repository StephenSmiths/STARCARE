import { ResidentsImportPanel } from './ResidentsImportPanel'
import { uiTokens } from '../../shared/ui/uiTokens'

export interface ResidentsAdminWriteSectionsProps {
  actorId: string
  canMaintain: boolean
  onImportCommitted: () => void
  onOpenCreateSheet: () => void
}

/** PDF 02【12】：寫入／批量匯入僅 TeamLead／Admin（與 Edge `guardTeamLeadOrAdmin` 一致） */
export const ResidentsAdminWriteSections = ({
  actorId,
  canMaintain,
  onImportCommitted,
  onOpenCreateSheet,
}: ResidentsAdminWriteSectionsProps) => {
  if (!canMaintain) {
    return (
      <p className={uiTokens.inlineNoticeWarn}>
        院友批量匯入與個別新增／編輯僅限 TeamLead／Admin；名單與匯出仍可檢視。
      </p>
    )
  }
  return (
    <>
      <section aria-labelledby="residents-bulk-import-heading">
        <h3 id="residents-bulk-import-heading" className={uiTokens.blockHeading}>
          院友批量匯入
        </h3>
        <p className={uiTokens.blockHelp}>以 Excel/CSV 預檢後匯入；通過預檢後再確認寫入名單。</p>
        <ResidentsImportPanel actorId={actorId} onImportCommitted={onImportCommitted} />
      </section>
      <section aria-labelledby="residents-single-heading">
        <h3 id="residents-single-heading" className={uiTokens.blockHeading}>
          新增個別院友
        </h3>
        <p className={uiTokens.blockHelp}>
          以表單逐筆建立院友資料（含資助類別與照護標記）。桌機為右側抽屜，手機為全螢幕。
        </p>
        <button className={uiTokens.btnPrimaryMt3WFit} type="button" onClick={onOpenCreateSheet}>
          開啟院友資料表單
        </button>
      </section>
    </>
  )
}
