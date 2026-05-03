import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'

const tableWrap = 'overflow-x-auto rounded-lg border border-slate-200'
const th = 'border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700'
const td = 'max-w-[14rem] border-b border-slate-100 px-3 py-2 text-sm text-slate-800'

const excerpt = (text: string, max = 72): string => (text.length <= max ? text : `${text.slice(0, max)}…`)

type Props = { rows: ServiceFormRecord[]; isLoading?: boolean }

/** 歷史文件列表（不含草稿／待審／退件） */
export const HistoricalDocumentsTable = ({ rows, isLoading = false }: Props) => (
  <div className={tableWrap}>
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className={th}>工作節日期</th>
          <th className={th}>院友</th>
          <th className={th}>紀要</th>
          <th className={th}>核准時間</th>
          <th className={th}>審核者</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td className={td} colSpan={5}>
              自雲端載入已核准表單…
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td className={td} colSpan={5}>
              無符合條件之已核准紀錄
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={row.id}>
              <td className={td}>{row.sessionDate}</td>
              <td className={td}>{row.residentName}</td>
              <td className={`${td} whitespace-pre-wrap`} title={row.narrative}>
                {excerpt(row.narrative)}
              </td>
              <td className={td}>{row.reviewedAt?.slice(0, 16).replace('T', ' ') ?? '—'}</td>
              <td className={`${td} font-mono text-xs`}>{row.reviewerActorId ?? '—'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
      詳細欄位請使用匯出；正式版應接後端分頁與權限細分（PDF 02【10】）。
    </p>
  </div>
)
