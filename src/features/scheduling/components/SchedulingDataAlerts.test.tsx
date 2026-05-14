/** @vitest-environment happy-dom */
/** PDF 02【3】：排班載入／儲存與合規警示橫幅（Seq 15）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { SchedulingComplianceAlert } from '../../../services/schedulingComplianceAlertService'
import { SchedulingDataAlerts } from './SchedulingDataAlerts'

afterEach(() => {
  cleanup()
})

const base = {
  loadError: '',
  saveError: '',
  saveSuccess: false,
  complianceAlerts: [] as SchedulingComplianceAlert[],
}

const sampleAlert: SchedulingComplianceAlert = {
  code: 'MIDWEEK_SUBSIDIZED_ZERO',
  level: 'high',
  residentId: 'r1',
  residentName: '測試院友',
  fundingType: 'GradeA_Subsidized',
  message: '週三資助復康完成次數仍為 0（示意）',
}

describe('SchedulingDataAlerts', () => {
  it('staffProfilesLoadDegraded 時顯示職類載入降級說明', () => {
    render(<SchedulingDataAlerts {...base} staffProfilesLoadDegraded />)
    const bar = screen.getByRole('status')
    expect(bar.textContent).toContain('staff-profiles-list')
    expect(bar.textContent).toContain('SC 僅治療師')
  })

  it('合規警示與載入／儲存錯誤、成功訊息', () => {
    render(
      <SchedulingDataAlerts
        {...base}
        loadError="載入失敗"
        saveError="儲存失敗"
        saveSuccess
        complianceAlerts={[sampleAlert]}
      />,
    )
    expect(screen.getByText(sampleAlert.message)).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('載入失敗')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('儲存失敗')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/排班結果已成功儲存/)).toBeInstanceOf(HTMLElement)
  })
})
