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
    <div className={uiTokens.formSheetViewportRoot} aria-hidden={false}>
      <button
        type="button"
        className={uiTokens.formSheetBackdrop}
        aria-label="關閉表單"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={uiTokens.formSheetPanel}
      >
        <header className={uiTokens.formSheetHeader}>
          <div className={uiTokens.formSheetTitleShrinkWrap}>
            <h2 id={titleId} className={uiTokens.formSheetTitle}>
              {title}
            </h2>
            {description ? <p className={uiTokens.formSheetDescription}>{description}</p> : null}
          </div>
          <button type="button" className={uiTokens.formSheetCloseButtonSecondary} onClick={onClose}>
            關閉
          </button>
        </header>
        <div className={uiTokens.formSheetBody}>{children}</div>
      </div>
    </div>
  )
}
