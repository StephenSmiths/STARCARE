/** @vitest-environment happy-dom */
/** PDF 02【3】：儀表板頂部三張統計卡（Seq 15）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SchedulingStatsCards } from './SchedulingStatsCards'

afterEach(() => {
  cleanup()
})

describe('SchedulingStatsCards', () => {
  it('顯示三張卡標題、數值與說明', () => {
    render(<SchedulingStatsCards totalResidents={12} compliantCount={5} pendingSlots={3} />)
    expect(screen.getByText('總院友數')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('本週已達標數')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('待補齊人次')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('12')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('5')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('3')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('納入本週排班之名單')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('資助復康週次數已滿足')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('尚缺之服務節數加總')).toBeInstanceOf(HTMLElement)
  })
})
