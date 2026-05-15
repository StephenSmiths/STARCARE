/**
 * PDF 02【16】兩大節頂部「對照簽核文件」白話說明（與 `SystemSettingsPdf16Section` 之 `alignmentNote` 併用）。
 * 用語避免工程元件名；以客戶可見之摺疊區標題對應母本區塊。
 */

const listClass = 'list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-sky-900'
const titleClass = 'mb-2 text-sm font-semibold text-sky-950'

/** 智能排班設定：母本「排班時間／規則／固定活動」與畫面區塊、P1／P2 關係 */
export const SystemSettingsPdf16SmartSchedulingAlignmentNote = () => (
  <>
    <p className={titleClass}>點樣同簽核 PDF（02【16】智能排班設定）對照？</p>
    <ul className={listClass}>
      <li>
        文件入面大致分兩段：先係<strong>排班同非治療時段</strong>（邊啲時間唔排工作節、開工準備等），之後係<strong>規則同固定活動</strong>（節數上限、小組人數、早操一類固定活動）。
      </li>
      <li>
        <strong>「排班時間設定」</strong>（下面第一個可摺疊區）：對應文件<strong>排班時間／非治療</strong>嗰 part。第一階（P1）已包括排班時段、資助復康用嘅「非治療」排除區間、開工準備開關等；用字未必同文件逐行一模一樣，但用途對應。
      </li>
      <li>
        <strong>「排班規則設定（P1）」</strong>（下面第二個可摺疊區）：對應文件<strong>排班規則設定</strong>裏面三個數字上限，以及「規則引擎／固定活動／服務類型」等總開關；呢啲屬第一階（P1）已可做嘅範圍。
      </li>
      <li>
        <strong>「排班細節參數（預留）」</strong>：留俾之後客戶再講細節先落地；簽核文件暫時<strong>冇要求</strong>逐格對住呢一區。
      </li>
      <li>
        <strong>「固定活動（雲端政策 P2）」</strong>：對應文件<strong>固定活動</strong>（逐筆活動、職位剔選等）。呢 part 屬第二階（P2），一般要喺<strong>已接通雲端院舍政策</strong>嘅環境（例如 Staging）先會見到；本機 demo 多數<strong>唔會顯示</strong>。
      </li>
    </ul>
  </>
)

/** 復康服務基本設定：母本大表與畫面區塊、P1／P2 關係 */
export const SystemSettingsPdf16RehabBasicsAlignmentNote = () => (
  <>
    <p className={titleClass}>點樣同簽核 PDF（02【16】復康服務基本設定）對照？</p>
    <ul className={listClass}>
      <li>
        文件入面係一張<strong>較大嘅表</strong>
        ，包括資助復康（甲一買位／院舍券／私位）、每週最低次數、各職類同節長剔選、Special Care 是否只限治療師、Pass
        優先次序、認知障礙症服務等。
      </li>
      <li>
        <strong>「資助復康服務與認知障礙症服務（P1）」</strong>
        （下面第一個可摺疊區）：第一階（P1）先做同合規最緊要、又易於喺本機驗收嘅項目（例如 Special Care 是否只限治療師）。<strong>唔係</strong>成張
        PDF 表格式搬晒上嚟。
      </li>
      <li>
        <strong>「資助復康三列」「資助職類矩陣」「資助 Pass 優先次序」「認知障礙症政策（雲端政策 P2）」</strong>各個可摺疊區：對應文件<strong>大表同 Pass 次序</strong>等其餘格；屬第二階（P2），要<strong>雲端院舍政策已啟用</strong>（例如 Staging）先會出現；本機 demo 多數<strong>只會見到上面 P1 嗰一區</strong>。
      </li>
    </ul>
  </>
)
