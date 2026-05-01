import { useEffect, useState } from 'react'
import { useAuth } from '../../auth'

const navItems = [
  { label: '儀表盤', href: '#dashboard', permission: 'view:dashboard' as const },
  { label: '創建工作計劃', href: '#work-plan', permission: 'view:work-plan-compose' as const },
  { label: '工作計劃', href: '#work-session-plans', permission: 'view:work-session-plans' as const },
  { label: '服務表單', href: '#service-forms', permission: 'view:service-forms' as const },
  {
    label: '歷史文件',
    href: '#historical-documents',
    permission: 'view:historical-documents' as const,
  },
  {
    label: '工作分析／審核',
    href: '#work-analysis-review',
    permission: 'view:work-analysis-review' as const,
  },
  {
    label: 'AI 報告中心',
    href: '#ai-report-center',
    permission: 'view:ai-report-center' as const,
  },
  {
    label: '通知中心',
    href: '#notification-center',
    permission: 'view:notification-center' as const,
  },
  {
    label: '用戶手冊',
    href: '#user-manual',
    permission: 'view:user-manual' as const,
  },
  { label: '開工接更', href: '#shift-start-handover', permission: 'view:shift-start-handover' as const },
  { label: '收工交更', href: '#shift-end-handover', permission: 'view:shift-end-handover' as const },
  { label: '智能排班', href: '#scheduling', permission: 'view:scheduling' as const },
  {
    label: '復康活動追蹤',
    href: '#rehab-activity-tracking',
    permission: 'view:rehab-activity-tracking' as const,
  },
  {
    label: '評估管理',
    href: '#assessment-management',
    permission: 'view:assessment-management' as const,
  },
  {
    label: '系統設定',
    href: '#system-settings',
    permission: 'view:system-settings' as const,
  },
  { label: '院友管理', href: '#residents', permission: 'view:residents' as const },
  { label: '員工管理', href: '#staff-import', permission: 'view:staff-import' as const },
  { label: '活動時段匯入', href: '#activity-sessions-import', permission: 'view:activity-sessions-import' as const },
]

interface SchedulingSidebarProps {
  /** 小螢幕側欄是否展開 */
  isMobileOpen: boolean
  /** 導覽後關閉抽屜（小螢幕） */
  onRequestClose: () => void
}

/** 左側導覽：桌機固定欄、手機自左滑入覆蓋層 */
export const SchedulingSidebar = ({ isMobileOpen, onRequestClose }: SchedulingSidebarProps) => {
  const { user, role, isConfigured, hasPermission, signOut } = useAuth()
  const [activeHash, setActiveHash] = useState(() => window.location.hash || '#dashboard')
  const visibleNavItems = navItems.filter((item) => hasPermission(item.permission))

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
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {visibleNavItems.map((item) => (
          <a
            key={item.label}
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
