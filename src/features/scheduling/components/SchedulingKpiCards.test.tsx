/** @vitest-environment happy-dom */
/** PDF 02【3】：KPI 四卡＋週三 0 次提醒摘要（Seq 15）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'
import type { SchedulingKpiSnapshot } from '../../../services/schedulingKpiService'
import { SchedulingKpiCards } from './SchedulingKpiCards'

afterEach(() => {
  cleanup()
})

const baseKpis: SchedulingKpiSnapshot = {
  coverageRate: 10.5,
  conflictRatePer100: 2,
  averageAssignmentsPerResident: 1.25,
  underTargetRate: 5,
}

const alertA: SchedulingComplianceAlert = {
  code: 'MIDWEEK_SUBSIDIZED_ZERO',
  level: 'high',
  residentId: 'r-a',
  residentName: '院友甲',
  fundingType: 'GradeA_Subsidized',
  message: '示意',
}

describe('SchedulingKpiCards', () => {
  it('顯示四張 KPI 卡格式化數值；無警示時週三卡為中性', () => {
    render(<SchedulingKpiCards kpis={baseKpis} complianceAlerts={[]} />)
    expect(screen.getByText('覆蓋率')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('10.5%')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('2.0%')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('1.25')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('5.0%')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('週三 0 次提醒')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('目前無需跟進個案')).toBeInstanceOf(HTMLElement)
    expect(screen.queryByText(/需優先跟進：/)).toBeNull()
  })

  it('有合規警示時顯示優先跟進姓名', () => {
    render(<SchedulingKpiCards kpis={baseKpis} complianceAlerts={[alertA]} />)
    expect(screen.getByText(/需優先跟進：院友甲/)).toBeInstanceOf(HTMLElement)
  })
})
