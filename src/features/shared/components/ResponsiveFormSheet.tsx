import { useEffect, useId, useRef, type ReactNode } from 'react'
import { uiTokens } from '../ui/uiTokens'

export interface ResponsiveFormSheetProps {
  open: boolean
  onClose: () => void
  title: string
  /** 顯示於標題下方之補充說明 */
  description?: string
  children: ReactNode
}

/**
 * 響應式表單容器：小螢幕全螢幕、md 以上右側 Drawer。
 * 含 Esc 關閉、backdrop 點擊關閉、開啟時鎖定 body 捲動。
 */
export const ResponsiveFormSheet = ({ open, onClose, title, description, children }: ResponsiveFormSheetProps) => {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden={false}>
      <button
        type="button"
        className="absolute inset-0 z-0 bg-slate-900/40"
        aria-label="關閉表單"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-0 z-10 flex max-h-[100dvh] flex-col bg-white shadow-xl md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-lg"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-lg font-semibold text-slate-900">
              {title}
            </h2>
            {description ? <p className="mt-1 text-xs text-slate-600">{description}</p> : null}
          </div>
          <button type="button" className={`${uiTokens.btnSecondary} shrink-0 px-2.5 py-1 text-sm`} onClick={onClose}>
            關閉
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{children}</div>
      </div>
    </div>
  )
}
