import { uiTokens } from '../../shared/ui/uiTokens'
import { useShiftStartHandoverWorkspace } from '../hooks/useShiftStartHandoverWorkspace'
import { ShiftStartHandoverPanel } from './ShiftStartHandoverPanel'

/** PDF 02【5b】開工接更入口 */
export const ShiftStartHandoverHome = () => {
  const workspace = useShiftStartHandoverWorkspace()

  return (
    <div className={`mx-auto w-full max-w-5xl ${uiTokens.stackVertical}`}>
      <ShiftStartHandoverPanel workspace={workspace} />
    </div>
  )
}
