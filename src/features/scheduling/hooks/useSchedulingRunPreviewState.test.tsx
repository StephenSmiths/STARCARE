/** @vitest-environment happy-dom */
/** PDF 02【3】：試算結果與清空預覽（與重載對齊）。 */
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSchedulingRunPreviewState } from './useSchedulingRunPreviewState'

describe('useSchedulingRunPreviewState', () => {
  it('clearPreviewState 清空指派並重置儲存旗標', () => {
    const { result } = renderHook(() => useSchedulingRunPreviewState())
    act(() => {
      result.current.setResult({
        assignments: [{ residentId: 'r1', residentName: '甲', sessionId: 's1', staffId: 'st', pass: 1 }],
        conflicts: [],
        underTargetResidents: [],
      })
      result.current.setSaveSuccess(true)
      result.current.setSaveError('舊錯')
    })
    act(() => {
      result.current.clearPreviewState()
    })
    expect(result.current.result.assignments).toEqual([])
    expect(result.current.saveSuccess).toBe(false)
    expect(result.current.saveError).toBe('')
  })
})
