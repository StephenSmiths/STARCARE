/** @vitest-environment happy-dom */
/** PDF 02【3】：本次排班指派—員工工作表預覽（第一期）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { SchedulingAssignment, SchedulingSession } from '../../../services/schedulingService'
import { SchedulingAssignmentsList } from './SchedulingAssignmentsList'

afterEach(() => {
  cleanup()
})

const session: SchedulingSession = {
  id: 'session-abc',
  staffId: 'staff-1',
  staffName: '員工甲',
  date: '2026-05-11',
  timeSlot: '08:30-09:30',
  serviceType: 'Subsidized_Rehab',
  capacity: 1,
  activityName: '平衡訓練',
}

const oneAssignment: SchedulingAssignment = {
  residentId: 'r-1',
  residentName: '示範院友',
  sessionId: 'session-abc',
  staffId: 'staff-1',
  pass: 2,
}

describe('SchedulingAssignmentsList', () => {
  it('無指派時顯示引導文案', () => {
    render(<SchedulingAssignmentsList assignments={[]} previewSessions={[]} />)
    expect(screen.getByText(/員工工作表預覽/)).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/尚未執行排班/)).toBeInstanceOf(HTMLElement)
  })

  it('有指派時列員工、時段、活動與院友', () => {
    render(
      <SchedulingAssignmentsList assignments={[oneAssignment]} previewSessions={[session]} />,
    )
    expect(screen.getByText(/員工甲/)).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/11\/5\/2026/)).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/平衡訓練/)).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/示範院友/)).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/Pass 2/)).toBeInstanceOf(HTMLElement)
  })
})
