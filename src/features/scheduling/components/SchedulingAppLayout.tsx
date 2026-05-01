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
    <div className="flex min-h-screen bg-slate-100">
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
        <span className="text-sm font-semibold text-slate-800">STARCARE</span>
      </div>
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-14 z-40 bg-slate-900/50 md:hidden"
          aria-label="關閉選單"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <SchedulingSidebar isMobileOpen={mobileNavOpen} onRequestClose={() => setMobileNavOpen(false)} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
