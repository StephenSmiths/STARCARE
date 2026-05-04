import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import { uiTokens } from '../../shared/ui/uiTokens'

const excerpt = (text: string, max = 72): string => (text.length <= max ? text : `${text.slice(0, max)}…`)

type Props = { rows: ServiceFormRecord[]; isLoading?: boolean }

/** 歷史文件列表（不含草稿／待審／退件） */
export const HistoricalDocumentsTable = ({ rows, isLoading = false }: Props) => (
  <div className={uiTokens.historicalDocumentsTableWrap}>
    <table className={uiTokens.tableMinWidthCollapse}>
      <thead>
        <tr>
          <th className={uiTokens.tableCompactTh}>工作節日期</th>
          <th className={uiTokens.tableCompactTh}>院友</th>
          <th className={uiTokens.tableCompactTh}>紀要</th>
          <th className={uiTokens.tableCompactTh}>核准時間</th>
          <th className={uiTokens.tableCompactTh}>審核者</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td className={uiTokens.historicalDocumentsTd} colSpan={5}>
              自雲端載入已核准表單…
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td className={uiTokens.historicalDocumentsTd} colSpan={5}>
              無符合條件之已核准紀錄
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={row.id}>
              <td className={uiTokens.historicalDocumentsTd}>{row.sessionDate}</td>
              <td className={uiTokens.historicalDocumentsTd}>{row.residentName}</td>
              <td className={uiTokens.historicalDocumentsTdNarrative} title={row.narrative}>
                {excerpt(row.narrative)}
              </td>
              <td className={uiTokens.historicalDocumentsTd}>{row.reviewedAt?.slice(0, 16).replace('T', ' ') ?? '—'}</td>
              <td className={uiTokens.historicalDocumentsTdMonoId}>{row.reviewerActorId ?? '—'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    <p className={uiTokens.tableFootNote}>
      詳細欄位請使用匯出；正式版應接後端分頁與權限細分（PDF 02【10】）。
    </p>
  </div>
)
