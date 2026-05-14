/** @vitest-environment happy-dom */
/** PDF 02【3】：KPI 趨勢歷史表（Seq 15；Δ 與 schedulingKpiTrendFormat 一致）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import { SchedulingKpiTrendHistoryTable } from './SchedulingKpiTrendHistoryTable'

afterEach(() => {
  cleanup()
})

const baseRow = (ranAt: string, kpis: SchedulingKpiRunRecord['kpis']): SchedulingKpiRunRecord => ({
  ranAt,
  kpis,
  residentCount: 1,
  assignmentCount: 1,
  conflictCount: 0,
})

describe('SchedulingKpiTrendHistoryTable', () => {
  it('空歷史仍渲染表頭', () => {
    render(<SchedulingKpiTrendHistoryTable history={[]} />)
    expect(screen.getByRole('columnheader', { name: '時間' })).toBeInstanceOf(HTMLElement)
    expect(screen.getByRole('columnheader', { name: '覆蓋率' })).toBeInstanceOf(HTMLElement)
    expect(screen.queryByText('12.0%')).toBeNull()
  })

  it('單列時 Δ 欄為 em dash（無上一列）', () => {
    const row = baseRow('2026-05-09T12:00:00.000Z', {
      coverageRate: 12,
      conflictRatePer100: 0.5,
      averageAssignmentsPerResident: 0.75,
      underTargetRate: 4,
    })
    render(<SchedulingKpiTrendHistoryTable history={[row]} />)
    expect(screen.getByText('12.0%')).toBeInstanceOf(HTMLElement)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(4)
  })

  it('兩列時最新列對上一列計算 Δ', () => {
    const older = baseRow('2026-05-08T10:00:00.000Z', {
      coverageRate: 10,
      conflictRatePer100: 1,
      averageAssignmentsPerResident: 0.5,
      underTargetRate: 5,
    })
    const newer = baseRow('2026-05-09T12:00:00.000Z', {
      coverageRate: 12,
      conflictRatePer100: 0.5,
      averageAssignmentsPerResident: 0.75,
      underTargetRate: 4,
    })
    render(<SchedulingKpiTrendHistoryTable history={[newer, older]} />)
    expect(screen.getByText('+2.0 pt')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('-0.5 pt')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('+0.25')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('-1.0 pt')).toBeInstanceOf(HTMLElement)
  })
})
