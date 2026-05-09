import type { Locator, Page } from '@playwright/test'

/**
 * Demo 錄影用：Playwright 輸出之 video 不含系統游標；在目標中心顯示**大型**高對比圓環＋脈衝，
 * 全螢幕播放時仍易辨識（PDF 02【13】僅錄影輔助、非業務邏輯）。
 */
export async function cueDemoPointerThenHover(page: Page, locator: Locator): Promise<void> {
  const box = await locator.boundingBox()
  if (!box) return
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2

  await page.mouse.move(cx, cy, { steps: 22 })

  await page.evaluate(
    ({ x, y }) => {
      const styleId = 'starcare-demo-pointer-styles'
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          @keyframes starcare-demo-pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.92; }
          }
        `
        document.head.appendChild(style)
      }

      const id = 'starcare-demo-pointer-dot'
      let dot = document.getElementById(id)
      if (!dot) {
        dot = document.createElement('div')
        dot.id = id
        Object.assign(dot.style, {
          position: 'fixed',
          left: '0',
          top: '0',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '5px solid #b91c1c',
          background: 'rgba(254, 202, 202, 0.95)',
          boxShadow:
            '0 0 0 4px #fff, 0 0 0 6px #dc2626, 0 6px 28px rgba(185, 28, 28, 0.75)',
          pointerEvents: 'none',
          zIndex: '2147483647',
          transform: 'translate(-50%, -50%)',
          animation: 'starcare-demo-pulse 0.9s ease-in-out 2',
        })
        document.body.appendChild(dot)
      } else {
        dot.style.animation = 'none'
        void dot.offsetWidth
        dot.style.animation = 'starcare-demo-pulse 0.9s ease-in-out 2'
      }
      dot.style.left = `${x}px`
      dot.style.top = `${y}px`
    },
    { x: cx, y: cy },
  )

  await page.waitForTimeout(700)
}
