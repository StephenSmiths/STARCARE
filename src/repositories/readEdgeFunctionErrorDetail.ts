/** Edge Function 錯誤 JSON（`{ error: string }`）解析，便於客戶端顯示真實原因。 */
export const readEdgeFunctionErrorDetail = async (response: Response): Promise<string> => {
  const text = await response.text()
  if (!text.trim()) return ''
  try {
    const parsed = JSON.parse(text) as { error?: unknown }
    if (typeof parsed.error === 'string' && parsed.error.trim()) return parsed.error.trim()
  } catch {
    /* 非 JSON 時略過 */
  }
  const trimmed = text.trim()
  return trimmed.length > 240 ? `${trimmed.slice(0, 240)}…` : trimmed
}
