/** @vitest-environment happy-dom */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { AuditTrailRecord } from '../../../services/auditTrailService'
import { AuditTrailPanel } from './AuditTrailPanel'

const emptyTrail: AuditTrailRecord[] = []

describe('AuditTrailPanel', () => {
  it('section aria-labelledby 指向標題 h3 id', () => {
    const { container } = render(
      <AuditTrailPanel title="系統設定與相關審計（全域）" auditTrail={emptyTrail} />,
    )
    const section = container.querySelector('section')
    const labelledBy = section?.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const heading = screen.getByRole('heading', { name: '系統設定與相關審計（全域）' })
    expect(heading.tagName.toLowerCase()).toBe('h3')
    expect(heading.id).toBe(labelledBy)
  })

  it('同頁兩個實例時標題 id 不重複', () => {
    render(
      <div>
        <AuditTrailPanel title="審計 A" auditTrail={emptyTrail} />
        <AuditTrailPanel title="審計 B" auditTrail={emptyTrail} />
      </div>,
    )
    const a = screen.getByRole('heading', { name: '審計 A' })
    const b = screen.getByRole('heading', { name: '審計 B' })
    expect(a.id).toBeTruthy()
    expect(b.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
  })
})
