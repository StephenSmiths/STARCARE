/** @vitest-environment happy-dom */
/** PDF 02【3】：排班衝突列表（Seq 15；與 `formatSchedulingConflictLine` 一致）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { SchedulingConflict } from '../../../services/schedulingService'
import { formatSchedulingConflictLine } from '../../../services/schedulingConflictLabels'
import { SchedulingConflictsPanel } from './SchedulingConflictsPanel'

afterEach(() => {
  cleanup()
})

describe('SchedulingConflictsPanel', () => {
  it('無衝突時顯示綠色提示', () => {
    render(<SchedulingConflictsPanel conflicts={[]} />)
    expect(screen.getByText('本次排班未偵測到衝突。')).toBeInstanceOf(HTMLElement)
  })

  it('有衝突時列出格式化文案', () => {
    const conflict: SchedulingConflict = {
      residentId: 'r-demo',
      residentName: '示範院友',
      type: 'NO_CAPACITY',
      reason: '該時段已滿',
    }
    render(<SchedulingConflictsPanel conflicts={[conflict]} />)
    expect(screen.getByText('排班衝突檢索')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(formatSchedulingConflictLine(conflict))).toBeInstanceOf(HTMLElement)
  })
})
