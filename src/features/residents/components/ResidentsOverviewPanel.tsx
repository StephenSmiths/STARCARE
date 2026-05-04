import { useMemo } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { Resident } from '../types/resident'

interface ResidentsOverviewPanelProps {
  residents: Resident[]
}

/** 院友管理概覽：快速掌握總量、重點照護與資助結構 */
export const ResidentsOverviewPanel = ({ residents }: ResidentsOverviewPanelProps) => {
  const stats = useMemo(() => {
    const total = residents.length
    const specialCare = residents.filter((item) => item.isSpecialCareCase).length
    const dementiaCare = residents.filter(
      (item) => item.dementiaLevel === 'Moderate' || item.dementiaLevel === 'Severe',
    ).length
    const subsidized = residents.filter((item) => item.fundingType === 'GradeA_Subsidized').length
    return { total, specialCare, dementiaCare, subsidized }
  }, [residents])

  return (
    <section>
      <h3 className={uiTokens.blockHeading}>院友資料概覽</h3>
      <p className={uiTokens.blockHelp}>以目前名單即時統計，用於管理層快速掌握重點分佈。</p>
      <div className={uiTokens.residentOverviewGrid}>
        <article className={uiTokens.residentKpiTileSlate}>
          <p className={uiTokens.textSubtleXs}>院友總數</p>
          <p className={uiTokens.statValueLgSlate900}>{stats.total}</p>
        </article>
        <article className={uiTokens.residentKpiTileAmber}>
          <p className={uiTokens.textSubtleXsAmber700}>Special Care 個案</p>
          <p className={uiTokens.statValueLgAmber900}>{stats.specialCare}</p>
        </article>
        <article className={uiTokens.residentKpiTileViolet}>
          <p className={uiTokens.textSubtleXsViolet700}>中重度認知障礙</p>
          <p className={uiTokens.statValueLgViolet900}>{stats.dementiaCare}</p>
        </article>
        <article className={uiTokens.residentKpiTileEmerald}>
          <p className={uiTokens.textSubtleXsEmerald700}>甲一買位</p>
          <p className={uiTokens.statValueLgEmerald900}>{stats.subsidized}</p>
        </article>
      </div>
    </section>
  )
}
