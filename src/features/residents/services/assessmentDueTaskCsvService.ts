import type { AssessmentDueTask } from './assessmentDueTaskService'

const escapeCsv = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const dateStamp = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const buildAssessmentDueTasksCsv = (tasks: AssessmentDueTask[]): string => {
  const header = ['院友ID', '院友姓名', '床號', '到期日', '剩餘天數']
  const rows = tasks.map((task) => [
    escapeCsv(task.residentId),
    escapeCsv(task.residentName),
    escapeCsv(task.bedNumber),
    escapeCsv(task.dueDate),
    escapeCsv(String(task.dueInDays)),
  ])
  const bom = '\uFEFF'
  return bom + [header.join(','), ...rows.map((row) => row.join(','))].join('\n')
}

export const downloadAssessmentDueTasksCsv = (tasks: AssessmentDueTask[]): void => {
  const csv = buildAssessmentDueTasksCsv(tasks)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `評估到期待辦_${dateStamp()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
