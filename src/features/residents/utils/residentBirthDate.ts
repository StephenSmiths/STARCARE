/** 日期工具：以本地時區穩定計算年齡，避免 UTC 日期跨日偏移。 */
const toLocalDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const isValidBirthDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return (
    Number.isFinite(year) &&
    Number.isFinite(month) &&
    Number.isFinite(day) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export const calculateAgeFromBirthDate = (birthDate: string, today = new Date()): number => {
  const [year, month, day] = birthDate.split('-').map(Number)
  const current = toLocalDate(today)
  let age = current.getFullYear() - year
  const birthdayPassed =
    current.getMonth() + 1 > month ||
    (current.getMonth() + 1 === month && current.getDate() >= day)
  if (!birthdayPassed) age -= 1
  return age
}

export const deriveBirthDateFromAge = (age: number, today = new Date()): string => {
  const year = toLocalDate(today).getFullYear() - age
  return `${String(year).padStart(4, '0')}-01-01`
}
