/** PDF 02【3】：排班頁 facade 與工作區實作為同一入口（既有 import 路徑不分裂）。 */
import { describe, expect, it } from 'vitest'
import { useScheduling } from './useScheduling'
import { useSchedulingWorkspace } from './useSchedulingWorkspace'

describe('useScheduling', () => {
  it('為 useSchedulingWorkspace 之別名（同一函式參照）', () => {
    expect(useScheduling).toBe(useSchedulingWorkspace)
  })
})
