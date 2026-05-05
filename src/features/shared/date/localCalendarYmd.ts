/** 本地曆日 YYYY-MM-DD（瀏覽器時區）；篩選／表單預設日期共用 */
export const localCalendarYmd = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
