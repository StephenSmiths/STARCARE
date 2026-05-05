import { describe, expect, it } from 'vitest'
import { buildReleaseLabel } from './buildReleaseLabel'

describe('buildReleaseLabel', () => {
  it('回傳版本與建置日字串（Vite define 注入）', () => {
    expect(buildReleaseLabel()).toMatch(/\d+\.\d+\.\d+ · 建置 \d{4}-\d{2}-\d{2}/)
  })
})
