import type { SchedulingConflict } from '../../../services/schedulingService'

interface SchedulingConflictsPanelProps {
  conflicts: SchedulingConflict[]
}

/** 排班衝突檢索區塊 */
export const SchedulingConflictsPanel = ({ conflicts }: SchedulingConflictsPanelProps) => {
  if (conflicts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-800">
        本次排班未偵測到衝突。
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold">排班衝突檢索</p>
      <ul className="mt-2 max-h-48 list-inside list-disc space-y-1 overflow-auto text-xs">
        {conflicts.map((conflict) => (
          <li key={`${conflict.residentId}-${conflict.type}-${conflict.reason}`}>
            {conflict.residentName}：{conflict.type}（{conflict.reason}）
          </li>
        ))}
      </ul>
    </div>
  )
}
