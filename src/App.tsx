import { useEffect, useMemo, useState } from 'react'
import { SignInScreen, useAuth } from './features/auth'
import { PageShell } from './features/shared/components/PageShell'
import { uiTokens } from './features/shared/ui/uiTokens'
import { SchedulingAppLayout } from './features/scheduling/components/SchedulingAppLayout'
import { AppMainViews } from './app/AppMainViews'
import {
  VIEW_IDS,
  VIEW_PERMISSION_MAP,
  getModuleDescription,
  getViewFromHash,
  getViewTitle,
  type ViewId,
} from './app/viewRouting'

const App = () => {
  const { isConfigured, isLoading, session, hasPermission } = useAuth()
  const [view, setView] = useState<ViewId>(() => getViewFromHash(window.location.hash))
  const accessibleViews = useMemo(
    () => VIEW_IDS.filter((item) => hasPermission(VIEW_PERMISSION_MAP[item])),
    [hasPermission],
  )
  const effectiveView = hasPermission(VIEW_PERMISSION_MAP[view]) ? view : (accessibleViews[0] ?? 'scheduling')

  useEffect(() => {
    const syncHash = () => setView(getViewFromHash(window.location.hash))
    window.addEventListener('hashchange', syncHash)
    if (!window.location.hash) {
      window.location.hash = '#dashboard'
    }
    syncHash()
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useEffect(() => {
    if (window.location.hash === `#${effectiveView}`) return
    window.location.hash = `#${effectiveView}`
  }, [effectiveView])

  const viewTitle = useMemo(() => getViewTitle(effectiveView), [effectiveView])
  const moduleDescription = useMemo(() => getModuleDescription(effectiveView), [effectiveView])

  if (isConfigured && isLoading) {
    return (
      <div className={uiTokens.appAuthSessionLoadingRoot}>
        載入工作階段…
      </div>
    )
  }

  if (isConfigured && !session) {
    return <SignInScreen />
  }

  return (
    <SchedulingAppLayout>
      <main
        className={uiTokens.appMainContentArea}
      >
        <PageShell moduleTitle={viewTitle} moduleDescription={moduleDescription}>
          <AppMainViews effectiveView={effectiveView} hasPermission={hasPermission} />
        </PageShell>
      </main>
    </SchedulingAppLayout>
  )
}

export default App
