/** @vitest-environment happy-dom */
/** PDF 02【3】：排班模組主佈局（小螢幕選單／backdrop／hashchange 關閉）。 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const { sidebarState, MockSidebar } = vi.hoisted(() => {
  const sidebarState = { lastOpen: false as boolean }
  const MockSidebar = (props: { isMobileOpen: boolean; onRequestClose: () => void }) => {
    sidebarState.lastOpen = props.isMobileOpen
    return (
      <div data-testid="scheduling-sidebar-mock">
        <button type="button" onClick={() => props.onRequestClose()}>
          mock-sidebar-close
        </button>
      </div>
    )
  }
  return { sidebarState, MockSidebar }
})

vi.mock('./SchedulingSidebar', () => ({
  SchedulingSidebar: MockSidebar,
}))

import { SchedulingAppLayout } from './SchedulingAppLayout'

afterEach(() => {
  cleanup()
})

describe('SchedulingAppLayout', () => {
  it('子內容渲染且側欄初始為收合', () => {
    render(
      <SchedulingAppLayout>
        <div>儀表主內容</div>
      </SchedulingAppLayout>,
    )
    expect(screen.getByText('儀表主內容')).toBeInstanceOf(HTMLElement)
    expect(sidebarState.lastOpen).toBe(false)
  })

  it('選單開關與 backdrop 關閉', () => {
    render(
      <SchedulingAppLayout>
        <div />
      </SchedulingAppLayout>,
    )
    fireEvent.click(screen.getByRole('button', { name: '選單' }))
    expect(sidebarState.lastOpen).toBe(true)
    expect(screen.getByRole('button', { name: '關閉選單' })).toBeInstanceOf(HTMLElement)
    fireEvent.click(screen.getByRole('button', { name: '關閉選單' }))
    expect(sidebarState.lastOpen).toBe(false)
  })

  it('側欄 onRequestClose 會收合', () => {
    render(
      <SchedulingAppLayout>
        <div />
      </SchedulingAppLayout>,
    )
    fireEvent.click(screen.getByRole('button', { name: '選單' }))
    fireEvent.click(screen.getByRole('button', { name: 'mock-sidebar-close' }))
    expect(sidebarState.lastOpen).toBe(false)
  })

  it('hashchange 會收合手機選單', () => {
    render(
      <SchedulingAppLayout>
        <div />
      </SchedulingAppLayout>,
    )
    fireEvent.click(screen.getByRole('button', { name: '選單' }))
    expect(sidebarState.lastOpen).toBe(true)
    fireEvent(window, new HashChangeEvent('hashchange'))
    expect(sidebarState.lastOpen).toBe(false)
  })
})
