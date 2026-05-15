import { useId, type ReactNode } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'

export type SystemSettingsPdf16SectionProps = {
  /** PDF 02【16】大節標題（與簽核母本用語一致） */
  title: string
  /** 對照 PRD 之說明（繁中） */
  description: string
  /** 對客／驗收用：與簽核 PDF 分段及 P1／P2 之白話對照（可選） */
  alignmentNote?: ReactNode
  children: ReactNode
}

/** PDF 02【16】：智能排班設定、復康服務基本設定 兩大區外殼；**`section`** 以 **`aria-labelledby`** 與 **`h2`** 關聯（landmark）。 */
export const SystemSettingsPdf16Section = ({
  title,
  description,
  alignmentNote,
  children,
}: SystemSettingsPdf16SectionProps) => {
  const headingId = useId()
  return (
    <section className="flex flex-col gap-4" aria-labelledby={headingId}>
      <header className="flex flex-col gap-3">
        <h2 id={headingId} className={uiTokens.moduleTitle}>
          {title}
        </h2>
        <p className={uiTokens.moduleDescription}>{description}</p>
        {alignmentNote ? (
          <div className={uiTokens.bannerInfo} role="note">
            {alignmentNote}
          </div>
        ) : null}
      </header>
      <div className={uiTokens.stackVertical}>{children}</div>
    </section>
  )
}
