import { useEffect, useState } from 'react'
import { useAuth } from '../../auth'
import { SCHEDULING_NAV_GROUPS } from '../config/schedulingNavConfig'

interface SchedulingSidebarProps {
  /** 小螢幕側欄是否展開 */
  isMobileOpen: boolean
  /** 導覽後關閉抽屜（小螢幕） */
  onRequestClose: () => void
}

/** 左側導覽：分組標題＋桌機固定欄、手機自左滑入覆蓋層（降低新手上手負擔） */
export const SchedulingSidebar = ({ isMobileOpen, onRequestClose }: SchedulingSidebarProps) => {
  const { user, role, isConfigured, hasPermission, signOut } = useAuth()
  const [activeHash, setActiveHash] = useState(() => window.location.hash || '#dashboard')

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash || '#dashboard')
    window.addEventListener('hashchange', syncHash)
    syncHash()
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  const asideTransform = isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'

  return (
    <aside
      id="app-sidebar-nav"
      className={`flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-slate-100
        fixed bottom-0 left-0 top-14 z-50 transition-transform duration-200 ease-out
        md:static md:top-auto md:z-auto md:h-auto md:translate-x-0
        ${asideTransform}`}
    >
      <div className="border-b border-slate-800 px-5 py-6">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-300">STARCARE</p>
        <p className="mt-1 text-lg font-semibold text-white">智能院舍照護</p>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
          選單已分組；不確定時先到「儀表盤」或「用戶手冊」。
        </p>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {SCHEDULING_NAV_GROUPS.map((group) => {
          const items = group.items.filter((item) => hasPermission(item.permission))
          if (items.length === 0) return null
          return (
            <div key={group.heading}>
              <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-wide text-slate-500">
                {group.heading}
              </p>
              <div className="space-y-1">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      activeHash === item.href
                        ? 'bg-violet-600/20 text-violet-200 ring-1 ring-violet-500/40'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    onClick={() => onRequestClose()}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </nav>
      <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
        {isConfigured && user?.email ? (
          <div className="mb-3 space-y-2">
            <p className="truncate text-slate-400" title={user.email}>
              {user.email}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-violet-300">角色：{role}</p>
            <button
              type="button"
              className="w-full rounded-lg border border-slate-600 px-2 py-1.5 text-slate-200 hover:bg-slate-800"
              onClick={() => void signOut()}
            >
              登出
            </button>
          </div>
        ) : null}
        <p>© 2026 STARCARE</p>
      </div>
    </aside>
  )
}
