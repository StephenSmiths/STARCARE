import { expect, test } from '@playwright/test'
import { cueDemoPointerThenHover } from './helpers/demoRecordingCue'

/**
 * Demo：員工資料概覽「全選目前清單 → 軟刪除已選」與多重確認（`confirm`／`prompt`）。
 * 須 **`npm run build:demo`** 之 preview（無 Supabase）：時段種子帶出 3 位列，InMemory 軟刪可清空畫面。
 * 錄影：執行 `npm run test:e2e:demo:staff-batch-delete` 後於 `test-results` 目錄內找 `video.webm`。
 * 系統游標不會出現在錄影檔；以 **`cueDemoPointerThenHover`** 顯示紅點＋軌跡輔助觀看。
 */
test.describe('staff overview batch soft-delete (demo)', () => {
  test.setTimeout(120_000)

  test('全選並軟刪除已選（含確認與提示輸入）', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      if (dialog.type() === 'confirm') {
        await dialog.accept()
        return
      }
      if (dialog.type() === 'prompt') {
        const msg = dialog.message()
        if (msg.includes('確認軟刪除')) {
          await dialog.accept('確認軟刪除')
          return
        }
        const m = msg.match(/請輸入數字\s*(\d+)/)
        if (m?.[1]) {
          await dialog.accept(m[1])
          return
        }
        await dialog.dismiss()
      }
    })

    await page.goto('/#staff-import')
    await expect(page).toHaveURL(/#staff-import/)
    await expect(page.getByRole('heading', { name: '員工管理', exact: true })).toBeVisible()

    await expect(page.getByRole('heading', { name: '員工資料概覽', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: '全選目前清單' })).toBeVisible({ timeout: 30_000 })
    // Demo：略停頓便于錄影閱讀（非業務斷言）
    await page.waitForTimeout(1200)

    const selectAllBtn = page.getByRole('button', { name: '全選目前清單' })
    await cueDemoPointerThenHover(page, selectAllBtn)
    await selectAllBtn.click()
    await expect(page.getByText(/已選 3 位/)).toBeVisible()
    await page.waitForTimeout(800)

    const batchDeleteBtn = page.getByRole('button', { name: '軟刪除已選' })
    await cueDemoPointerThenHover(page, batchDeleteBtn)
    await batchDeleteBtn.click()

    await expect(page.getByText('目前尚無可顯示的員工資料。')).toBeVisible({ timeout: 30_000 })
  })
})
