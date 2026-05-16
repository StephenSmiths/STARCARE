/** 讓出主執行緒，避免大量排班運算阻塞 UI（Chrome「頁面無回應」） */
export const yieldToMain = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
