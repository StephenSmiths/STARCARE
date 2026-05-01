import type { ReactNode } from 'react'
import { uiTokens } from '../ui/uiTokens'

interface PageShellProps {
  moduleTitle: string
  moduleDescription?: string
  children: ReactNode
}

/** 頁面外殼：產品頂欄（masthead）+ 模組內容區垂直堆疊 */
export const PageShell = ({ moduleTitle, moduleDescription, children }: PageShellProps) => (
  <div className={uiTokens.stackVertical}>
    <header className={uiTokens.masthead}>
      <h1 className={uiTokens.productTitle}>STARCARE 智能院舍照護管理系統</h1>
      <p className={uiTokens.moduleKicker}>目前模組</p>
      <h2 className={uiTokens.moduleTitle}>{moduleTitle}</h2>
      {moduleDescription ? <p className={uiTokens.moduleDescription}>{moduleDescription}</p> : null}
    </header>
    <div className={uiTokens.stackVertical}>{children}</div>
  </div>
)
