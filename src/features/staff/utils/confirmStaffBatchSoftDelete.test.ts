/** @vitest-environment happy-dom */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { confirmStaffBatchSoftDelete } from './confirmStaffBatchSoftDelete'

describe('confirmStaffBatchSoftDelete', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('單筆且非全清單：僅需 confirm', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const ok = confirmStaffBatchSoftDelete({
      count: 1,
      isEntireVisibleList: false,
      sampleNames: ['A'],
    })
    expect(ok).toBe(true)
  })

  it('兩筆以上：需輸入確認片語', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(window, 'prompt').mockReturnValue('確認軟刪除')
    const ok = confirmStaffBatchSoftDelete({
      count: 2,
      isEntireVisibleList: false,
      sampleNames: ['A', 'B'],
    })
    expect(ok).toBe(true)
  })

  it('全清單：需再輸入總數數字', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const prompt = vi.spyOn(window, 'prompt')
    prompt.mockReturnValueOnce('確認軟刪除')
    prompt.mockReturnValueOnce('3')
    const ok = confirmStaffBatchSoftDelete({
      count: 3,
      isEntireVisibleList: true,
      sampleNames: ['A', 'B', 'C'],
    })
    expect(ok).toBe(true)
  })

  it('單筆但為全清單：confirm 後需輸入總數', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const prompt = vi.spyOn(window, 'prompt')
    prompt.mockReturnValueOnce('1')
    const ok = confirmStaffBatchSoftDelete({
      count: 1,
      isEntireVisibleList: true,
      sampleNames: ['Only'],
    })
    expect(ok).toBe(true)
  })

  it('片語錯誤則中止', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(window, 'prompt').mockReturnValue('錯誤')
    const ok = confirmStaffBatchSoftDelete({
      count: 2,
      isEntireVisibleList: false,
      sampleNames: ['A', 'B'],
    })
    expect(ok).toBe(false)
  })
})
