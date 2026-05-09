import type { Locator, Page } from '@playwright/test'

/**
 * Demo 錄影用：Playwright 輸出之 video 不含系統游標；在目標中心顯示固定於頁面之最上層圓點，
 * 並以 mouse.move 帶入軌跡（對齊觀眾「游標移動」預期；PDF 02【13】僅錄影輔助、非業務邏輯）。
 */
export async function cueDemoPointerThenHover(page: Page, locator: Locator): Promise<void> {
  const box = await locator.boundingBox()
  if (!box) return
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2

  await page.mouse.move(cx, cy, { steps: 18 })

  await page.evaluate(
    ({ x, y }) => {
      const id = 'starcare-demo-pointer-dot'
      let dot = document.getElementById(id)
      if (!dot) {
        dot = document.createElement('div')
        dot.id = id
        Object.assign(dot.style, {
          position: 'fixed',
          left: '0',
          top: '0',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '3px solid #dc2626',
          background: 'rgba(254, 226, 226, 0.92)',
          boxShadow: '0 2px 14px rgba(220, 38, 38, 0.5)',
          pointerEvents: 'none',
          zIndex: '2147483647',
          transform: 'translate(-50%, -50%)',
        })
        document.body.appendChild(dot)
      }
      dot.style.left = `${x}px`
      dot.style.top = `${y}px`
    },
    { x: cx, y: cy },
  )

  await page.waitForTimeout(380)
}
