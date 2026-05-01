import type { AssessmentDueTask } from '../../residents/services/assessmentDueTaskService'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import type { AssessmentOverdueRow } from '../services/assessmentManagementDomainService'

const tableWrap = 'overflow-x-auto rounded-lg border border-slate-200'
const th = 'border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700'
const td = 'border-b border-slate-100 px-3 py-2 text-sm text-slate-800'

type Props = {
  overdueRows: AssessmentOverdueRow[]
  dueSoonTasks: AssessmentDueTask[]
  history: AssessmentCompletionRecord[]
}

/** PDF 02【9】清單：逾期、14 天內到期、完成紀錄倒序 */
export const AssessmentManagementTables = ({ overdueRows, dueSoonTasks, history }: Props) => (
  <div className="flex flex-col gap-8">
    <section>
      <h2 className={uiTokens.blockHeading}>逾期（待補 PT／OT）</h2>
      <div className={`mt-2 ${tableWrap}`}>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>院友</th>
              <th className={th}>床號</th>
              <th className={th}>週期錨點</th>
              <th className={th}>距錨點（日）</th>
              <th className={th}>缺漏</th>
            </tr>
          </thead>
          <tbody>
            {overdueRows.length === 0 ? (
              <tr>
                <td className={td} colSpan={5}>
                  目前無逾期項目
                </td>
              </tr>
            ) : (
              overdueRows.map((row) => (
                <tr key={`${row.residentId}-${row.cycleAnchorDate}`}>
                  <td className={td}>{row.residentName}</td>
                  <td className={td}>{row.bedNumber}</td>
                  <td className={td}>{row.cycleAnchorDate}</td>
                  <td className={td}>{row.daysSinceAnchor}</td>
                  <td className={td}>
                    {[row.missingPt ? 'PT' : null, row.missingOt ? 'OT' : null].filter(Boolean).join('、')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className={uiTokens.blockHeading}>14 天內到期（估算）</h2>
      <div className={`mt-2 ${tableWrap}`}>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>院友</th>
              <th className={th}>床號</th>
              <th className={th}>到期日</th>
              <th className={th}>剩餘（日）</th>
            </tr>
          </thead>
          <tbody>
            {dueSoonTasks.length === 0 ? (
              <tr>
                <td className={td} colSpan={4}>
                  目前無 14 天內到期項目
                </td>
              </tr>
            ) : (
              dueSoonTasks.map((row) => (
                <tr key={`${row.residentId}-${row.dueDate}`}>
                  <td className={td}>{row.residentName}</td>
                  <td className={td}>{row.bedNumber}</td>
                  <td className={td}>{row.dueDate}</td>
                  <td className={td}>{row.dueInDays}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className={uiTokens.blockHeading}>完成紀錄（最近優先）</h2>
      <div className={`mt-2 ${tableWrap}`}>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>時間</th>
              <th className={th}>院友</th>
              <th className={th}>錨點</th>
              <th className={th}>科別</th>
              <th className={th}>版本</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td className={td} colSpan={5}>
                  尚無紀錄
                </td>
              </tr>
            ) : (
              history.map((row) => (
                <tr key={row.id}>
                  <td className={td}>{row.completedAt.slice(0, 16).replace('T', ' ')}</td>
                  <td className={td}>{row.residentName}</td>
                  <td className={td}>{row.cycleAnchorDate}</td>
                  <td className={td}>{row.discipline}</td>
                  <td className={td}>{row.versionLabel}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  </div>
)
