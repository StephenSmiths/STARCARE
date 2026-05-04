import { useEffect, useState, type ReactNode } from 'react'
import { uiTokens } from '../../shared/ui/uiTokens'
import { SchedulingSidebar } from './SchedulingSidebar'

interface SchedulingAppLayoutProps {
  children: ReactNode
}

/** 應用程式主佈局：響應式側欄（小螢幕抽屜）+ 主內容區 */
export const SchedulingAppLayout = ({ children }: SchedulingAppLayoutProps) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const close = () => setMobileNavOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])

  return (
    <div className={uiTokens.schedulingAppShell}>
      <div className={uiTokens.mobileTopBar}>
        <button
          type="button"
          className={uiTokens.btnSecondary}
          aria-expanded={mobileNavOpen}
          aria-controls="app-sidebar-nav"
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          {mobileNavOpen ? '收合' : '選單'}
        </button>
        <span className={uiTokens.mobileTopBarTitle}>STARCARE</span>
      </div>
      {mobileNavOpen ? (
        <button
          type="button"
          className={uiTokens.mobileNavBackdrop}
          aria-label="關閉選單"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <SchedulingSidebar isMobileOpen={mobileNavOpen} onRequestClose={() => setMobileNavOpen(false)} />
      <div className={uiTokens.schedulingAppMainColumn}>{children}</div>
    </div>
  )
}
