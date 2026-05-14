/** @vitest-environment happy-dom */
/** PDF 02【3】：本次排班指派條列（Seq 15）。 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { SchedulingAssignment } from '../../../services/schedulingService'
import { SchedulingAssignmentsList } from './SchedulingAssignmentsList'

afterEach(() => {
  cleanup()
})

const oneAssignment: SchedulingAssignment = {
  residentId: 'r-1',
  residentName: '示範院友',
  sessionId: 'session-abc',
  staffId: 'staff-1',
  pass: 2,
}

describe('SchedulingAssignmentsList', () => {
  it('無指派時顯示引導文案', () => {
    render(<SchedulingAssignmentsList assignments={[]} />)
    expect(screen.getByText('本次排班指派')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText(/尚未執行排班/)).toBeInstanceOf(HTMLElement)
  })

  it('有指派時列出院友、Pass 與 session id', () => {
    render(<SchedulingAssignmentsList assignments={[oneAssignment]} />)
    expect(screen.getByText('示範院友')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('Pass 2')).toBeInstanceOf(HTMLElement)
    expect(screen.getByText('（session-abc）')).toBeInstanceOf(HTMLElement)
  })
})
