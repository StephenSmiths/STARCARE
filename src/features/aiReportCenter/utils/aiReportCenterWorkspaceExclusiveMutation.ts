import type { MutableRefObject } from 'react'

/** 同步域動作：busy 鎖、清空錯誤、統一錯誤文案（對齊防連點語意）。 */
export function runAiReportWorkspaceExclusiveMutation(
  busy: MutableRefObject<boolean>,
  setError: (message: string) => void,
  fallbackMessage: string,
  fn: () => void,
  canProceed: () => boolean = () => true,
): void {
  if (!canProceed() || busy.current) return
  busy.current = true
  setError('')
  try {
    fn()
  } catch (error) {
    setError(error instanceof Error ? error.message : fallbackMessage)
  } finally {
    busy.current = false
  }
}
