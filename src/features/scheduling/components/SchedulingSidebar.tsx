import { useEffect, useState } from 'react'
import { buildReleaseLabel } from '../../../app/buildReleaseLabel'
import { useAuth } from '../../auth'
import { uiTokens } from '../../shared/ui/uiTokens'
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

  return (
    <aside
      id="app-sidebar-nav"
      className={isMobileOpen ? uiTokens.sidebarShellMobileOpen : uiTokens.sidebarShellMobileClosed}
    >
      <div className={uiTokens.sidebarHeader}>
        <p className={uiTokens.sidebarBrandKicker}>STARCARE</p>
        <p className={uiTokens.sidebarBrandTitle}>智能院舍照護</p>
        <p className={uiTokens.sidebarBrandHint}>選單已分組；不確定時先到「儀表盤」或「用戶手冊」。</p>
      </div>
      <nav className={uiTokens.sidebarNavScrollStack}>
        {SCHEDULING_NAV_GROUPS.map((group) => {
          const items = group.items.filter((item) => hasPermission(item.permission))
          if (items.length === 0) return null
          return (
            <div key={group.heading}>
              <p className={uiTokens.sidebarNavGroupLabel}>{group.heading}</p>
              <div className={uiTokens.sidebarNavItemsStack}>
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={
                      activeHash === item.href
                        ? uiTokens.sidebarNavLinkRowActive
                        : uiTokens.sidebarNavLinkRowInactive
                    }
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
      <div className={uiTokens.sidebarFooter}>
        {isConfigured && user?.email ? (
          <div className={uiTokens.sidebarFooterUserStack}>
            <p className={uiTokens.sidebarUserEmail} title={user.email}>
              {user.email}
            </p>
            <p className={uiTokens.sidebarRoleLine}>角色：{role}</p>
            <button type="button" className={uiTokens.sidebarMutedButton} onClick={() => void signOut()}>
              登出
            </button>
          </div>
        ) : null}
        <p className={uiTokens.sidebarBuildMeta} title="前端建置版本與日期（與部署驗收對照用）">
          {buildReleaseLabel()}
        </p>
        <p>© 2026 STARCARE</p>
      </div>
    </aside>
  )
}
