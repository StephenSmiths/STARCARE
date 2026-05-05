/**
 * 側欄建置標籤（Vite define；工程可觀測性，非業務序號）。
 * 供院舍端確認目前載入之前端建置，便於與部署／驗收對照。
 */
export const buildReleaseLabel = (): string =>
  `${__STARcare_APP_VERSION__} · 建置 ${__STARcare_BUILD_DAY__}`
