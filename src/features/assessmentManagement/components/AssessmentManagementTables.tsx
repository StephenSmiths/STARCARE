import type { AssessmentDueTask } from '../../residents/services/assessmentDueTaskService'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import type { AssessmentOverdueRow } from '../services/assessmentManagementDomainService'

type Props = {
  overdueRows: AssessmentOverdueRow[]
  dueSoonTasks: AssessmentDueTask[]
  history: AssessmentCompletionRecord[]
}

/** PDF 02【9】清單：逾期、14 天內到期、完成紀錄倒序 */
export const AssessmentManagementTables = ({ overdueRows, dueSoonTasks, history }: Props) => (
  <div className={uiTokens.layoutFlexColGap8}>
    <section>
      <h2 className={uiTokens.blockHeading}>逾期（待補 PT／OT）</h2>
      <div className={uiTokens.assessmentTableWrapMt2}>
        <table className={uiTokens.tableMinWidthCollapse}>
          <thead>
            <tr>
              <th className={uiTokens.tableCompactTh}>院友</th>
              <th className={uiTokens.tableCompactTh}>床號</th>
              <th className={uiTokens.tableCompactTh}>週期錨點</th>
              <th className={uiTokens.tableCompactTh}>距錨點（日）</th>
              <th className={uiTokens.tableCompactTh}>缺漏</th>
            </tr>
          </thead>
          <tbody>
            {overdueRows.length === 0 ? (
              <tr>
                <td className={uiTokens.assessmentTableTd} colSpan={5}>
                  目前無逾期項目
                </td>
              </tr>
            ) : (
              overdueRows.map((row) => (
                <tr key={`${row.residentId}-${row.cycleAnchorDate}`}>
                  <td className={uiTokens.assessmentTableTd}>{row.residentName}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.bedNumber}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.cycleAnchorDate}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.daysSinceAnchor}</td>
                  <td className={uiTokens.assessmentTableTd}>
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
      <div className={uiTokens.assessmentTableWrapMt2}>
        <table className={uiTokens.tableMinWidthCollapse}>
          <thead>
            <tr>
              <th className={uiTokens.tableCompactTh}>院友</th>
              <th className={uiTokens.tableCompactTh}>床號</th>
              <th className={uiTokens.tableCompactTh}>到期日</th>
              <th className={uiTokens.tableCompactTh}>剩餘（日）</th>
            </tr>
          </thead>
          <tbody>
            {dueSoonTasks.length === 0 ? (
              <tr>
                <td className={uiTokens.assessmentTableTd} colSpan={4}>
                  目前無 14 天內到期項目
                </td>
              </tr>
            ) : (
              dueSoonTasks.map((row) => (
                <tr key={`${row.residentId}-${row.dueDate}`}>
                  <td className={uiTokens.assessmentTableTd}>{row.residentName}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.bedNumber}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.dueDate}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.dueInDays}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className={uiTokens.blockHeading}>完成紀錄（最近優先）</h2>
      <div className={uiTokens.assessmentTableWrapMt2}>
        <table className={uiTokens.tableMinWidthCollapse}>
          <thead>
            <tr>
              <th className={uiTokens.tableCompactTh}>時間</th>
              <th className={uiTokens.tableCompactTh}>院友</th>
              <th className={uiTokens.tableCompactTh}>錨點</th>
              <th className={uiTokens.tableCompactTh}>科別</th>
              <th className={uiTokens.tableCompactTh}>版本</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td className={uiTokens.assessmentTableTd} colSpan={5}>
                  尚無紀錄
                </td>
              </tr>
            ) : (
              history.map((row) => (
                <tr key={row.id}>
                  <td className={uiTokens.assessmentTableTd}>{row.completedAt.slice(0, 16).replace('T', ' ')}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.residentName}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.cycleAnchorDate}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.discipline}</td>
                  <td className={uiTokens.assessmentTableTd}>{row.versionLabel}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  </div>
)
