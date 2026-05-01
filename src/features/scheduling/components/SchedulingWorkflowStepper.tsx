import { uiTokens } from '../../shared/ui/uiTokens'
import type { SchedulingWorkflowUiModel } from '../services/schedulingWorkflowStepService'

const STEPS: Array<{ id: 1 | 2 | 3 | 4 | 5; label: string; hint: string }> = [
  { id: 1, label: '導入週更表', hint: 'CSV 與活動時段主檔一致' },
  { id: 2, label: '確認', hint: '核對本週更表／時段' },
  { id: 3, label: '智能排班', hint: '執行 3-Pass 與約束' },
  { id: 4, label: '預覽', hint: '指派與衝突檢視' },
  { id: 5, label: '確認採用', hint: '無衝突後儲存' },
]

export interface SchedulingWorkflowStepperProps {
  model: SchedulingWorkflowUiModel
  sessionCount: number
}

/** PDF 02【3】五步進度列（Seq 15） */
export const SchedulingWorkflowStepper = ({ model, sessionCount }: SchedulingWorkflowStepperProps) => {
  const doneFlags: Record<number, boolean> = {
    1: model.step1Done,
    2: model.step2Done,
    3: model.step3Done,
    4: model.step4Done,
    5: model.step5Done,
  }

  return (
    <section className="rounded-xl border border-violet-200 bg-violet-50/60 p-4" aria-label="智能排班五步流程">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className={`${uiTokens.blockHeading} text-violet-950`}>智能排班流程（五步）</h2>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-800 ring-1 ring-violet-200">
          已載入時段：{sessionCount} 節
        </span>
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => {
          const done = doneFlags[step.id]
          const active = model.activeStep === step.id
          return (
            <li key={step.id}>
              <div
                className={`flex h-full flex-col rounded-lg px-3 py-2 text-xs ${
                  active ? 'bg-violet-600 text-white shadow-md' : done ? 'bg-emerald-100 text-emerald-900' : 'bg-white text-slate-600 ring-1 ring-slate-200'
                }`}
              >
                <span className="font-semibold">
                  {done ? '✓ ' : ''}
                  {index + 1}. {step.label}
                </span>
                <span className={`mt-1 leading-snug ${active ? 'text-violet-100' : 'text-slate-500'}`}>{step.hint}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
